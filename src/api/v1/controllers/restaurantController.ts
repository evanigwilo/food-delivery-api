// Express
import { Request, Response } from 'express';
// Entities
import Restaurant from '../entity/Restaurant';
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

export const createRestaurant = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { name, rating, location } = body;

  const restaurant = new Restaurant({ name, rating, location, createdBy: user });

  // Validation of input for errors
  const errors = await validateError(restaurant, res);
  if (errors) {
    return;
  }

  try {
    // create the restaurant
    await entityManager.save(restaurant);
    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'Restaurant created successfully.',
      restaurant,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  // check if restaurant id is valid
  if (uuidError(restaurantId, 'restaurant', res)) {
    return;
  }

  // find restaurant by the id
  const restaurant = await entityManager.findOne(Restaurant, {
    where: { id: restaurantId },
    relations: {
      createdBy: true,
    },
  });

  if (restaurant) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Restaurant found.',
      restaurant,
    });
  } else {
    return res.status(204).send();
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { restaurantId } = req.params;

  // check if restaurant id is valid
  if (uuidError(restaurantId, 'restaurant', res)) {
    return;
  }

  const { name, rating, location } = req.body;

  const restaurant = new Restaurant({ name, rating, location });

  // Validation of input for errors
  const errors = await validateError(restaurant, res, true);
  if (errors) {
    return;
  }

  try {
    // update restaurant properties
    const updated = await entityManager.update(Restaurant, { id: restaurantId, createdBy: user }, restaurant);

    return responseUpdateDelete('Restaurant', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { restaurantId } = req.params;

  // check if restaurant id is valid
  if (uuidError(restaurantId, 'restaurant', res)) {
    return;
  }

  // find restaurant by the id
  const deleted = await entityManager.delete(Restaurant, { id: restaurantId, createdBy: user });

  return responseUpdateDelete('Restaurant', deleted, 'Deleted', res);
};

export const getRestaurants = async (req: Request, res: Response) => {
  const { body } = req;

  // Validate pagination parameters
  const { limit, offset } = validateLimitOffset(body);

  // find all restaurants
  const restaurants = await entityManager.find(Restaurant, {
    relations: {
      createdBy: true,
      location: {
        country: true,
      },
    },
    ...limitOffset(limit, offset),
  });

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'All Restaurants.',
    restaurants,
    count: restaurants.length,
    limit,
    offset,
  });
};
