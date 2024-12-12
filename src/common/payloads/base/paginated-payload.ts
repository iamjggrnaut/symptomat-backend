import { Field, ObjectType } from '@nestjs/graphql';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Pagination } from 'nestjs-typeorm-paginate';

import { BasePayload } from './base-payload';

@ObjectType()
class PaginationMeta implements IPaginationMeta {
  @Field(() => Number)
  itemCount: number;

  @Field(() => Number)
  totalItems: number;

  @Field(() => Number)
  itemsPerPage: number;

  @Field(() => Number)
  totalPages: number;

  @Field(() => Number)
  currentPage: number;

  constructor(props: IPaginationMeta) {
    Object.assign(this, props);
  }
}

@ObjectType()
export abstract class PaginatedPayload extends BasePayload {
  public static buildPayload<ItemClassType>(ItemClassOrRef: ItemClassType, name: string) {
    type Item = ItemClassType extends new (...args: any[]) => any ? InstanceType<ItemClassType> : ItemClassType;

    @ObjectType(name)
    class Payload extends BasePayload {
      @Field(() => [ItemClassOrRef])
      public items: Item[];

      @Field(() => PaginationMeta)
      public meta: PaginationMeta;

      constructor(items: Item[], meta: IPaginationMeta) {
        super();
        this.items = items;
        this.meta = new PaginationMeta(meta);
      }

      static create<InputItem>(itemFactory: (item: InputItem) => Item, paginated: Pagination<InputItem>) {
        return new Payload(paginated.items.map(itemFactory), paginated.meta);
      }
    }

    return Payload;
  }
}
