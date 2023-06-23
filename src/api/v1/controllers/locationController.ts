// Express
import { Request, Response } from 'express';
// Entities
import Location from '../entity/Location';
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

export const createLocation = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { address, country, phone } = body;

  const location = new Location({ address, country, phone, createdBy: user });

  // Validation of input for errors
  const errors = await validateError(location, res);
  if (errors) {
    return;
  }

  try {
    // create the location
    await entityManager.save(location);
    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'Location created successfully.',
      location,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};

export const getLocation = async (req: Request, res: Response) => {
  const { locationId } = req.params;

  // check if location id is valid
  if (uuidError(locationId, 'location', res)) {
    return;
  }

  // find location by the id
  const location = await entityManager.findOne(Location, {
    where: { id: locationId },
    relations: {
      createdBy: true,
    },
  });

  if (location) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Location found.',
      location,
    });
  } else {
    return res.status(204).send();
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { locationId } = req.params;

  // check if location id is valid
  if (uuidError(locationId, 'location', res)) {
    return;
  }

  const { address, country, phone } = req.body;

  const location = new Location({ address, country, phone });

  // Validation of input for errors
  const errors = await validateError(location, res, true);
  if (errors) {
    return;
  }

  try {
    // update location properties
    const updated = await entityManager.update(Location, { id: locationId, createdBy: user }, location);

    return responseUpdateDelete('Location', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { locationId } = req.params;

  // check if location id is valid
  if (uuidError(locationId, 'location', res)) {
    return;
  }

  // find location by the id
  const deleted = await entityManager.delete(Location, { id: locationId, createdBy: user });

  return responseUpdateDelete('Location', deleted, 'Deleted', res);
};

export const getLocations = async (req: Request, res: Response) => {
  const { body } = req;

  // Validate pagination parameters
  const { limit, offset } = validateLimitOffset(body);

  // find all locations
  const locations = await entityManager.find(Location, {
    relations: {
      createdBy: true,
      country: true,
    },
    ...limitOffset(limit, offset),
  });

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'All Locations.',
    locations,
    count: locations.length,
    limit,
    offset,
  });
};
