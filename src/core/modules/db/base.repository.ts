import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginationDto } from '@/core/types/pagination.dto';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  FindOneOptions,
  ObjectLiteral,
} from 'typeorm';
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly entity: new (entity: DeepPartial<T>) => T,
  ) {}

  protected get entityName(): string {
    return this.entity.name;
  }

  protected handleServerError(operation: string, error: unknown): never {
    throw new InternalServerErrorException(
      `Failed to ${operation} ${this.entityName}`,
      {
        cause: error,
      },
    );
  }

  protected handleClientError(operation: string, error: unknown): never {
    throw new BadRequestException(`Failed to ${operation} ${this.entityName}`, {
      cause: error,
    });
  }

  private isKeyOfT(key: unknown): key is keyof T {
    if (
      typeof key !== 'string' &&
      typeof key !== 'number' &&
      typeof key !== 'symbol'
    ) {
      return false;
    }

    const metadata = this.entityManager.connection.getMetadata(this.entity);
    return metadata.columns.some((column) => column.propertyName === key);
  }

  private applyPagination(
    options: FindManyOptions<T>,
    paginationDto?: PaginationDto,
  ): void {
    if (!paginationDto) return;

    if (paginationDto.limit) {
      options.take = paginationDto.limit;
    }

    if (paginationDto.skip) {
      options.skip = paginationDto.skip;
    }

    if (
      paginationDto.sortBy &&
      this.isKeyOfT(paginationDto.sortBy) &&
      paginationDto.order
    ) {
      options.order = {
        [paginationDto.sortBy]: paginationDto.order,
      } as FindOptionsOrder<T>;
    }
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.entityManager.findOne(this.entity, options);
    } catch (error) {
      this.handleServerError('find', error);
    }
  }

  async find(
    options: FindManyOptions<T>,
    paginationDto?: PaginationDto,
  ): Promise<[T[], number]> {
    try {
      this.applyPagination(options, paginationDto);

      const items = await this.entityManager.find(this.entity, options);
      const total = await this.count(options);

      return [items, total];
    } catch (error) {
      this.handleServerError('find collection of', error);
    }
  }

  async findWithoutPagination(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entityManager.find(this.entity, options);
    } catch (error) {
      this.handleServerError('find collection of', error);
    }
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.entityManager.count(this.entity, options);
    } catch (error) {
      this.handleServerError('count', error);
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.entityManager.create(this.entity, data);
      return await this.entityManager.save(entity);
    } catch (error) {
      this.handleClientError('create', error);
    }
  }

  async createMany(data: QueryDeepPartialEntity<T>[]): Promise<number> {
    try {
      const insertResult = await this.entityManager
        .getRepository(this.entity)
        .createQueryBuilder()
        .insert()
        .values(data)
        .execute();
      return insertResult.identifiers.length;
    } catch (error) {
      this.handleClientError('create multiple', error);
    }
  }

  async update(
    criteria: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    try {
      const entity = await this.findOne({ where: criteria });

      if (!entity) {
        return null;
      }

      Object.assign(entity, partialEntity);

      return await this.entityManager.save(entity);
    } catch (error) {
      this.handleClientError('update', error);
    }
  }

  async updateMany(
    updates: Array<{
      criteria: FindOptionsWhere<T>;
      data: QueryDeepPartialEntity<T>;
    }>,
  ): Promise<number> {
    if (updates.length === 0) {
      return 0;
    }

    const queryBuilder = this.entityManager
      .getRepository(this.entity)
      .createQueryBuilder();
    let totalAffected = 0;

    await queryBuilder.connection.transaction(async (transactionManager) => {
      const promises = updates.map(({ criteria, data }) => {
        return transactionManager
          .createQueryBuilder()
          .update(this.entity)
          .set(data)
          .where(criteria)
          .execute();
      });

      const results = await Promise.all(promises);
      totalAffected = results.reduce(
        (sum, result) => sum + (result.affected || 0),
        0,
      );
    });

    return totalAffected;
  }

  async delete(criteria: FindOptionsWhere<T>): Promise<T | null> {
    try {
      const entity = await this.findOne({ where: criteria });
      if (!entity) {
        return null;
      }

      await this.entityManager.remove(entity);
      return entity;
    } catch (error) {
      this.handleServerError('delete', error);
    }
  }

  async deleteMany(criteria: FindOptionsWhere<T>): Promise<boolean> {
    try {
      const result = await this.entityManager.delete(this.entity, criteria);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      this.handleServerError('delete multiple', error);
    }
  }
}
