// Typeorm
import { In } from 'typeorm';
// Express
import { Request, Response } from 'express';
// 👇 Generators & Validators
import { randomUUID } from 'crypto';
// Entities
import Order from '../entity/Order';
import Payment from '../entity/Payment';
import Food from '../entity/Food';
import User from '../entity/User';
// Constants, Helpers & Types
import { PaymentStatus, ResponseCode } from '../types/enum';
import { databaseError, entityManager, isOrder, limitOffset, uuidError, validateLimitOffset } from '../helpers';
import Balance from '../entity/Balance';

export const createOrder = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  // create a new payment for user orders
  const payment = new Payment({
    id: randomUUID(),
    status: PaymentStatus.PENDING,
    amount: 0,
    total: 0,
    createdBy: user,
  });

  const { orders } = body;

  // check if order is valid
  if (!(orders instanceof Array)) {
    return res.status(400).json({
      code: ResponseCode.VALIDATION_ERROR,
      message: 'Invalid Order.',
    });
  }

  // Remove order with invalid count and identifier
  const ids: Record<string, number> = {};
  orders.forEach((order) => {
    const item = isOrder(order);
    if (item) {
      ids[item.foodId] = item.count;
    }
  });

  // Find all valid food items
  const foods = await entityManager.find(Food, {
    where: {
      id: In(Object.keys(ids)),
    },
    relations: {
      menu: {
        restaurant: {
          location: {
            country: true,
          },
        },
      },
    },
  });

  // create order
  const order = foods.map((food) => {
    const order = new Order({
      payment,
      count: ids[food.id],
      food_name: food.name,
      food_price: food.price,
      menu: food.menu.name,
      restaurant_name: food.menu.restaurant?.name,
      restaurant_address: food.menu.restaurant?.location?.address,
      restaurant_country: food.menu.restaurant?.location?.country?.name,
    });
    // accumulate payment amount and count;
    payment.total += order.count;
    payment.amount += order.count * order.food_price;
    return order;
  });
  // Round payment amount to 2 decimal Places
  payment.amount = Math.round((payment.amount + Number.EPSILON) * 100) / 100;

  // save payment
  if (payment.total > 0) {
    await entityManager.save(payment);
    await entityManager.save(order);

    // remove payment details on each order item
    order.forEach((item) => delete (item as Partial<Order>).payment);

    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'Order created successfully.',
      order: {
        ...payment,
        items: order,
      },
    });
  } else {
    return res.status(400).json({
      code: ResponseCode.FAILED,
      message: 'Order not created - Invalid item(s) or count',
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { orderId } = req.params;

  // check if order id is valid
  if (uuidError(orderId, 'order', res)) {
    return;
  }

  // find order by id
  const order = await entityManager.findOne(Payment, {
    where: {
      id: orderId,
      createdBy: { id: user.id },
    },
    relations: {
      orders: true,
    },
  });

  if (order) {
    // change orders property to items
    delete Object.assign(order as Partial<Payment>, { items: order.orders }).orders;

    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Order found.',
      order,
    });
  } else {
    return res.status(204).send();
  }
};

export const getOrders = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  // Validate pagination parameters
  const { limit, offset } = validateLimitOffset(body);

  // find all orders
  const [orders, count] = await entityManager.findAndCount(Payment, {
    where: {
      createdBy: { id: user.id },
    },
    relations: {
      orders: true,
    },
    ...limitOffset(limit, offset),
  });

  // format status for each order
  const status = orders.reduce(
    (prev, curr) => {
      prev.pending += +(curr.status === PaymentStatus.PENDING);
      prev.failed += +(curr.status === PaymentStatus.FAILED);
      prev.paid += +(curr.status === PaymentStatus.PAID);

      // change orders property to items
      delete Object.assign(curr as Partial<Payment>, { items: curr.orders }).orders;

      return prev;
    },
    {
      pending: 0,
      failed: 0,
      paid: 0,
    },
  );

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'All Orders.',
    orders,
    count,
    status,
    limit,
    offset,
  });
};

export const payOrder = async (req: Request, res: Response) => {
  // authenticated user
  let { user } = req;

  const { orderId } = req.params;

  // check if order id is valid
  if (uuidError(orderId, 'order', res)) {
    return;
  }

  // find payment by the user id
  const payment = await entityManager.findOne(Payment, {
    where: { id: orderId, createdBy: { id: user.id } },
  });

  if (!payment) {
    return res.status(400).json({
      code: ResponseCode.FAILED,
      message: 'Order not found - Invalid order identifier or user',
    });
  }
  // check if order is already payed
  if (payment.status === PaymentStatus.PAID) {
    return res.status(400).json({
      code: ResponseCode.FAILED,
      message: 'Order already paid.',
      payment,
    });
  }

  try {
    // check if user balance is less than order amount
    user = (await entityManager.findOne(User, {
      where: { id: user.id },
      relations: { balance: true },
    })) as User;
    // cast to number
    payment.amount = +payment.amount;
    const current = +user.balance!.amount!;
    const balance = {
      old: current,
      new: current - payment.amount,
    };
    if (balance.old < payment.amount) {
      return res.status(400).json({
        code: ResponseCode.FORBIDDEN,
        message: 'Insufficient balance.',
        balance: balance.old,
        payment: payment.amount,
      });
    }
    // pay for order
    const updatePayment = await entityManager.update(Payment, { id: payment.id }, { status: PaymentStatus.PAID });
    // update user balance in database and session
    const updateBalance = await entityManager.update(Balance, { createdBy: user.id }, { amount: balance.new });
    user.balance!.amount = balance.new;
    req.session.user = { ...user };

    const successPaid = updatePayment.affected === 1 && updateBalance.affected === 1;
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: successPaid ? 'Order Paid.' : 'Order not Paid.',
      balance: balance.new,
      payment: payment.amount,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};
