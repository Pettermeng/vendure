import { Inject} from '@nestjs/common';
import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { Permission, Allow, RequestContext, Ctx, Logger, TransactionalConnection,translateDeep, ListQueryBuilder } from '@vendure/core';
import { loggerCtx, PLUGIN_INIT_OPTIONS } from '../constants';
import { ExampleOptions } from '../example.plugin';
import { Example } from '../entity/example.entity';
import { MutationSubmitExampleArgs } from './generated-type';

@Resolver()
export class ExampleResolver {

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder
    ){}

  @Query()
  @Allow(Permission.Public)
  async exampleQuery(
    @Ctx() ctx: RequestContext,
  ){



    return this.listQueryBuilder
        .build(Example)
        .getManyAndCount()
        .then(([items, totalItems]) => ({
            items,
            totalItems
        }));
  }

  @Mutation()
  async insertExample(
      @Ctx() ctx: RequestContext,
      @Args() { input }: MutationSubmitExampleArgs,
    ){
      const example = new Example(input);

      
      return this.connection.getRepository(ctx, Example).save(example);
  }

  @Mutation()
  async updateExample(
    @Ctx() ctx: RequestContext,
    @Args() { input }: MutationSubmitExampleArgs,
  ){

  }
}