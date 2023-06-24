// Express
import { Request, Response } from 'express';
// Entities
import Menu from '../entity/Menu';
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

export const createMenu = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { name, restaurant } = body;

  const menu = new Menu({ name, restaurant, createdBy: user });

  // Validation of input for errors
  const errors = await validateError(menu, res);
  if (errors) {
    return;
  }

  try {
    // create the menu
    await entityManager.save(menu);
    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'Menu created successfully.',
      menu,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};

export const getMenu = async (req: Request, res: Response) => {
  const { menuId } = req.params;

  // check if menu id is valid
  if (uuidError(menuId, 'menu', res)) {
    return;
  }

  // find menu by the id
  const menu = await entityManager.findOne(Menu, {
    where: { id: menuId },
    relations: {
      createdBy: true,
    },
  });

  if (menu) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Menu found.',
      menu,
    });
  } else {
    return res.status(204).send();
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { menuId } = req.params;

  // check if menu id is valid
  if (uuidError(menuId, 'menu', res)) {
    return;
  }

  const { name, restaurant } = req.body;

  const menu = new Menu({ name, restaurant });

  // Validation of input for errors
  const errors = await validateError(menu, res, true);
  if (errors) {
    return;
  }

  try {
    // update menu properties
    const updated = await entityManager.update(Menu, { id: menuId, createdBy: user }, menu);
    return responseUpdateDelete('Menu', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  // authenticated user
  const { user } = req;

  const { menuId } = req.params;

  // check if menu id is valid
  if (uuidError(menuId, 'menu', res)) {
    return;
  }

  // find menu by the id
  const deleted = await entityManager.delete(Menu, { id: menuId, createdBy: user });
  return responseUpdateDelete('Menu', deleted, 'Deleted', res);
};

export const getMenus = async (req: Request, res: Response) => {
  const { body } = req;

  // Validate pagination parameters
  const { limit, offset } = validateLimitOffset(body);

  // find all menus
  const menus = await entityManager.find(Menu, {
    relations: {
      createdBy: true,
      restaurant: {
        location: {
          country: true,
        },
      },
    },
    ...limitOffset(limit, offset),
  });

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'All Menus.',
    menus,
    count: menus.length,
    limit,
    offset,
  });
};
