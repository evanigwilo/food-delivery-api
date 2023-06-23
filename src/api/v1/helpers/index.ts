// Express
import { Request, Response } from 'express';
// Typeorm
import { BaseEntity, DataSource, DeleteResult, QueryFailedError, UpdateResult } from 'typeorm';
// Generators & Validators
import { isUUID, validate } from 'class-validator';
// Constants, Helpers & Types
import { ResponseCode } from '../types/enum';
import { OrderType } from '../types';
import {
  DATABASE_DIALECT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DB,
  rootDir,
  fileExtension,
  maxLimit,
  development,
  invalidIdentifier,
} from '../constants';

// database source initialize
export const dataSource = new DataSource({
  type: DATABASE_DIALECT as any,
  host: DATABASE_HOST,
  port: DATABASE_PORT as any,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_DB,
  migrationsRun: true,
  logging: development,
  synchronize: development,
  dropSchema: false,
  entities: [rootDir + '/entity/**/' + fileExtension],
  migrations: [rootDir + '/migration/**/' + fileExtension],
  subscribers: [rootDir + '/subscriber/**/' + fileExtension],
  migrationsTableName: 'migrations',
});

export const { manager: entityManager } = dataSource;

export const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const validateError = async (entity: BaseEntity, res: Response, skipUndefined = false) => {
  const errors = await validate(entity, {
    skipUndefinedProperties: skipUndefined,
  });
  if (errors.length) {
    const { constraints, property } = errors[0];
    for (const key in constraints) {
      // respond with first encountered error
      res.status(400).json({
        code: ResponseCode.INPUT_ERROR,
        message: `${capitalize(property)} - ${constraints[key]}`,
      });
      return true;
    }
  }
  return false;
};

export const uuidError = (id: string, property: string, res: Response) => {
  if (isUUID(id, 'all')) {
    return false;
  } else {
    res.status(400).json({
      code: ResponseCode.INPUT_ERROR,
      message: `${capitalize(property)} - ${invalidIdentifier}`,
    });
    return true;
  }
};

export const databaseError = (error: unknown, res: Response) =>
  res.status(500).json({
    code: ResponseCode.DATABASE_ERROR,
    message: (error as QueryFailedError)?.driverError?.detail || 'Failed to create location.',
  });

export const responseUpdateDelete = (
  property: string,
  action: UpdateResult | DeleteResult,
  type: 'Updated' | 'Deleted',
  res: Response,
) =>
  action.affected === 1
    ? res.status(200).json({
        code: ResponseCode.SUCCESS,
        message: `${property} ${type}.`,
      })
    : res.status(400).json({
        code: ResponseCode.FAILED,
        message: `${property} not found or User is not creator.`,
      });

export const validInteger = (num: string) => /^[0-9]+$/.test(num);

export const limitOffset = (limit: number, offset: number) => ({
  take: Math.min(limit, maxLimit),
  skip: offset,
  order: {
    createdDate: 'DESC',
  } as const,
});

export const validateLimitOffset = (body: Request['body']) => {
  const limit = validInteger(body.limit || '') ? Number(body.limit) : maxLimit;
  const offset = validInteger(body.offset || '') ? Number(body.offset) : 0;
  return { limit, offset };
};

export const isOrder = (order: any) => {
  // check if order is an object type
  const isObject = order !== null && typeof order === 'object';
  if (!isObject) {
    return false;
  }
  // check if order has the valid keys
  const hasKeys = 'foodId' in order && 'count' in order;
  if (!hasKeys) {
    return false;
  }
  const item = order as OrderType;
  // check if order identifier is valid
  if (!isUUID(item.foodId)) {
    return false;
  }
  // check if order count is valid
  if (!validInteger(item.count?.toString() || '') || +item.count < 1) {
    return false;
  }

  // cast count to number
  item.count = +item.count;
  return item;
};

// seconds to milliseconds convert for intervals
export const secsToMs = (secs: number) => secs * 1000;
// milliseconds to seconds convert
export const msToSecs = (ms: number) => Math.floor(ms / 1000);

export const sleep = (secs: number) => new Promise((handler) => setTimeout(handler, secsToMs(secs)));

// postgres database connection helper
export const postgresConnect = async (connected = true, interval = 0) => {
  // reconnect or check connection every 3 secs
  if (interval > 0) {
    await sleep(interval);
  } else {
    interval = 3;
  }
  try {
    if (dataSource.isInitialized) {
      //  Keep alive workaround
      try {
        await entityManager.query('SELECT 1');
      } catch {
        await dataSource.driver.connect();
      }
    } else {
      await dataSource.initialize();
    }
    if (connected) {
      console.log(`Connected to PostgresDB(db:${dataSource.driver.database})`);
    }

    postgresConnect(false, interval);
  } catch (error) {
    console.log('Waiting for PostgresDB');
    postgresConnect(false, interval);
  }
};
