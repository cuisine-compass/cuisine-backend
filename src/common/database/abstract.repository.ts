import {
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateIndexesOptions } from 'mongodb';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    fieldsToPopulate: string[] = [],
    selectFields?: string[],
    nestedPopulateFields: string[] = [],
  ): Promise<any> {
    const query = this.model
      .findOne(filterQuery, {}, { lean: true })
      .select(selectFields)
      .sort({ createdAt: -1 });
    fieldsToPopulate.forEach((field) => query.populate(field));
    nestedPopulateFields.forEach((field) => query.populate(field));

    return query.exec();
    // if (!document) throw new NotFoundException('Resource could not be found');
  }

  async aggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline);
  }

  async find(
    FilterQuery: FilterQuery<TDocument>,
    fieldsToPopulate: string[] = [],
    selectFields: string[] = [],
    sortResponse: boolean = true,
  ): Promise<any> {
    const query = this.model
      .find(FilterQuery, {}, { lean: true })
      .select(selectFields)
      .sort({ createdAt: sortResponse ? -1 : 1 });
    fieldsToPopulate.forEach((field) => query.populate(field));
    return query.exec();
    // if (!document) throw new NotFoundException('Resource could not be found');
  }

  async findWithLimit(
    FilterQuery: FilterQuery<TDocument>,
    fieldsToPopulate: string[] = [],
    selectFields: string[] = [],
    sortResponse: boolean = true,
    limit: number,
    skip: number,
  ): Promise<any> {
    const query = this.model
      .find(FilterQuery, {}, { lean: true })
      .select(selectFields)
      .sort({ createdAt: sortResponse ? -1 : 1 })
      .limit(limit)
      .skip(skip);
    fieldsToPopulate.forEach((field) => query.populate(field));
    return query.exec();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
      runValidators: true,
    });
    if (!document) {
      this.logger.warn('no matching resource found', filterQuery);
      throw new NotFoundException('Resource could not be found');
    }
    return document;
  }

  async updateMany(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    return this.model.updateMany(filterQuery, update, {
      lean: true,
      new: true,
    });
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOneAndDelete(filterQuery, {
      lean: true,
    });
    if (!document) {
      this.logger.warn('no matching resource found', filterQuery);
      throw new NotFoundException('Resource could not be found');
    }
    return document;
  }

  async createIndex(options: CreateIndexesOptions) {
    return this.model.createIndexes(options);
  }

  async count(filterQuery: FilterQuery<TDocument>) {
    return this.model.countDocuments(filterQuery);
  }

  async validateUniqueEntry(
    filterQuery: FilterQuery<TDocument>,
    errorMessage: string,
  ) {
    const doc = await this.model.findOne(filterQuery);
    if (doc) throw new UnprocessableEntityException(errorMessage);
    return;
  }
}
