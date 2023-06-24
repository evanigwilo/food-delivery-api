// Express
import { Request, Response } from 'express';
// Typeorm
import { ILike } from 'typeorm';
// Generators & Validators
import argon2 from 'argon2';
import { isEmail } from 'class-validator';
// Entities
import User from '../entity/User';
// Constants, Helpers & Types
import { ResponseCode } from '../types/enum';
import { databaseError, entityManager, validateError } from '../helpers';
import { SESSION_ID } from '../constants';

export const authenticate = async (req: Request, res: Response) => {
  const { user } = req;
  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'User authenticated.',
    user,
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const user = new User({ username, email, password });

  // Validation of input for errors
  const errors = await validateError(user, res);
  if (errors) {
    return;
  }

  // check if user with the provided credential already exists
  const find = await entityManager.findOne(User, {
    where: [
      {
        username: ILike(user.username),
      },
      {
        email: ILike(user.email),
      },
    ],
  });

  if (find) {
    return res.status(400).json({
      code: ResponseCode.FORBIDDEN,
      message: 'Username or Email already exist.',
    });
  }

  try {
    // create the user
    await entityManager.save(user);
    // save user session
    req.session.user = { ...user };

    return res.status(201).json({
      code: ResponseCode.SUCCESS,
      message: 'User created successfully.',
      user,
    });
  } catch (error) {
    return databaseError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  const { identity, password } = req.body;

  // check if account exist
  /*
  const user = await entityManager.findOne(User, {
    where: {
      [isEmail(identity) ? 'email' : 'username']: ILike(identity),
    },
    relations: {
      balance: true,
    },
  });
  */
  const user = await entityManager
    .createQueryBuilder(User, 'user')
    .select(['user.password', 'user']) // includes password in query result
    .leftJoinAndSelect('user.balance', 'balance')
    .where(`user.${isEmail(identity) ? 'email' : 'username'} ILIKE :identity`, { identity })
    .getOne();

  if (!user) {
    return res.status(400).json({
      code: ResponseCode.INPUT_ERROR,
      message: "Username or Email doesn't exist.",
    });
  }
  // verify hashed password
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    return res.status(400).json({
      code: ResponseCode.INPUT_ERROR,
      message: 'Incorrect password.',
    });
  }

  // save user session
  req.session.user = { ...user };

  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: 'User login successfully.',
    user,
  });
};

export const logout = async (req: Request, res: Response) => {
  let status = true;

  // clear cookie and close session
  res.clearCookie(SESSION_ID);
  req.session.destroy((err) => {
    status = Boolean(err);
  });

  return res.status(204).send();
};
