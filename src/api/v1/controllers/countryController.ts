// Express
import { Request, Response } from 'express';
// Entities
import Country from '../entity/Country';
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

export const createCountry = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  // trim input
  body.name = body?.name?.trim();
  body.code = body?.code?.trim();
  body.emoji = body?.emoji?.trim();

  const { name, code, emoji } = req.body;

  const country = new Country({ name, code, emoji, createdBy: user });

  // Validation of input for errors
  const errors = await validateError(country, res);
  if (errors) {
    return;
  }

  try {
    // create the country
    await entityManager.save(country);
    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'Country created successfully.',
      country,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};

export const getCountry = async (req: Request, res: Response) => {
  const { countryId } = req.params;

  // check if country id is valid
  if (uuidError(countryId, 'country', res)) {
    return;
  }

  // find country by the id
  const country = await entityManager.findOne(Country, {
    where: { id: countryId },
    relations: {
      createdBy: true,
    },
  });

  if (country) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Country found.',
      country,
    });
  } else {
    return res.status(204).send();
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { countryId } = req.params;

  // check if country id is valid
  if (uuidError(countryId, 'country', res)) {
    return;
  }

  const { name, code, emoji } = req.body;

  const country = new Country({ name, code, emoji });

  // Validation of input for errors
  const errors = await validateError(country, res, true);
  if (errors) {
    return;
  }

  try {
    // update country properties
    const updated = await entityManager.update(Country, { id: countryId, createdBy: user }, country);

    return responseUpdateDelete('Country', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};

export const deleteCountry = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { countryId } = req.params;

  // check if country id is valid
  if (uuidError(countryId, 'country', res)) {
    return;
  }

  // find country by the id
  const deleted = await entityManager.delete(Country, { id: countryId, createdBy: user });

  return responseUpdateDelete('Country', deleted, 'Deleted', res);
};

export const getCountries = async (req: Request, res: Response) => {
  const { body } = req;

  // Validate pagination parameters
  const { limit, offset } = validateLimitOffset(body);

  // find all countries
  const countries = await entityManager.find(Country, {
    relations: {
      createdBy: true,
    },
    ...limitOffset(limit, offset),
  });

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'All Countries.',
    countries,
    count: countries.length,
    limit,
    offset,
  });
};
