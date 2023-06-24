// Express
import { Request, Response } from 'express';
// Entities
import Food from '../entity/Food';
// Constants, Helpers & Types
import { ResponseCode } from '../types/enum';
import {
  databaseError,
  entityManager,
  limitOffset,
  responseUpdateDelete,
  uuidError,
  validateError,
  validateLimitOffset,
} from '../helpers';

export const createFood = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { name, menu, price } = body;

  const food = new Food({ name, menu, price, createdBy: user });

  // Validation of input for errors
  const errors = await validateError(food, res);
  if (errors) {
    return;
  }

  try {
    // create the food
    await entityManager.save(food);
    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'Food created successfully.',
      food,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};

export const getFood = async (req: Request, res: Response) => {
  const { foodId } = req.params;

  // check if food id is valid
  if (uuidError(foodId, 'food', res)) {
    return;
  }

  // find food by the id
  const food = await entityManager.findOne(Food, {
    where: { id: foodId },
    relations: {
      createdBy: true,
    },
  });

  if (food) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Food found.',
      food,
    });
  } else {
    return res.status(204).send();
  }
};

export const updateFood = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { foodId } = req.params;

  // check if food id is valid
  if (uuidError(foodId, 'food', res)) {
    return;
  }

  const { name, menu, price } = req.body;

  const food = new Food({ name, menu, price, createdBy: user });

  // Validation of input for errors
  const errors = await validateError(food, res, true);
  if (errors) {
    return;
  }

  try {
    // update food properties
    const updated = await entityManager.update(Food, { id: foodId }, food);

    return responseUpdateDelete('Food', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};

export const deleteFood = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { foodId } = req.params;

  // check if food id is valid
  if (uuidError(foodId, 'food', res)) {
    return;
  }

  // find food by the id
  const deleted = await entityManager.delete(Food, { id: foodId, createdBy: user });

  return responseUpdateDelete('Food', deleted, 'Deleted', res);
};

export const getFoods = async (req: Request, res: Response) => {
  const { body } = req;

  // Validate pagination parameters
  const { limit, offset } = validateLimitOffset(body);

  // find all foods
  const foods = await entityManager.find(Food, {
    relations: {
      createdBy: true,
      menu: {
        restaurant: {
          location: {
            country: true,
          },
        },
      },
    },
    ...limitOffset(limit, offset),
  });

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'All Foods.',
    foods,
    count: foods.length,
    limit,
    offset,
  });
};
