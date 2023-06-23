// Typeorm
import { MigrationInterface, QueryRunner } from 'typeorm';
// Faker
import { faker } from '@faker-js/faker';
// Entities
import User from '../entity/User';
import Country from '../entity/Country';
import Location from '../entity/Location';
import Restaurant from '../entity/Restaurant';
import Menu from '../entity/Menu';
import Food from '../entity/Food';
// Constants, Helpers & Types
import { countries } from '../constants';
import { dataSource } from '../helpers';

const uniqueId = () => faker.helpers.unique(faker.datatype.uuid);

export class SampleData1687392000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // synchronize to create schema and relations
    await dataSource.synchronize();

    // create sample users
    const users = ['john', 'mark'].map(
      (user) =>
        new User({
          // id: uniqueId()
          username: user,
          email: `${user}@delivery.com`,
          password: '123456',
        }),
    );
    await queryRunner.manager.save(users);

    const john = users[0];
    const mark = users[1];

    // create sample countries
    const sampleCountries = countries.map((country) => ({
      ...country,
      id: uniqueId(),
      createdBy: john,
    }));
    await queryRunner.manager.createQueryBuilder().insert().into(Country).values(sampleCountries).orIgnore().execute();

    const country = sampleCountries[0];
    // create sample locations
    const sampleLocations = Array.from({ length: 5 }).map(
      () =>
        new Location({
          id: uniqueId(),
          country: { id: country.id },
          address: faker.helpers.unique(faker.address.streetAddress),
          phone: faker.helpers.unique(faker.phone.number),
          createdBy: mark,
        }),
    );
    await queryRunner.manager.save(sampleLocations);

    // create sample restaurants
    const sampleRestaurants = Array.from({ length: 5 }).map(
      (_, index) =>
        new Restaurant({
          id: uniqueId(),
          location: { id: sampleLocations[index].id },
          name: faker.helpers.unique(faker.company.name),
          rating: faker.datatype.number({ min: 1, max: 10 }),
          createdBy: mark,
        }),
    );
    await queryRunner.manager.save(sampleRestaurants);

    // create sample menus
    const sampleMenus = Array.from({ length: 5 }).map(
      () =>
        new Menu({
          id: uniqueId(),
          restaurant: { id: sampleRestaurants[0].id },
          name: faker.helpers.unique(faker.commerce.productAdjective),
          createdBy: mark,
        }),
    );
    await queryRunner.manager.save(sampleMenus);

    // create sample foods
    const sampleFoods = Array.from({ length: 5 }).map(
      () =>
        new Food({
          id: uniqueId(),
          menu: { id: sampleMenus[0].id },
          price: faker.datatype.number({ min: 10, max: 100 }),
          name: faker.helpers.unique(faker.commerce.productName),
          createdBy: mark,
        }),
    );
    await queryRunner.manager.save(sampleFoods);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
