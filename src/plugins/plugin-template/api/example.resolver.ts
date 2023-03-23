import { Inject} from '@nestjs/common';
import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { Permission, Allow, RequestContext, Ctx, Logger, TransactionalConnection,translateDeep, ListQueryBuilder, patchEntity, User, CustomerService } from '@vendure/core';
import { loggerCtx, PLUGIN_INIT_OPTIONS } from '../constants';
import { ExampleOptions } from '../example.plugin';
import { Example } from '../entity/example.entity';
import { MutationDeleteExampleArgs, MutationSubmitCustomerArgs, MutationSubmitExampleArgs, MutationUpdateExampleArgs, SearchExampleArgs } from './generated-type';
import { RegisterCustomerInput } from './generated-type'; 

@Resolver()
export class ExampleResolver {

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private customerService: CustomerService
    ){}


  // Get Example
  @Query()
  @Allow(Permission.Public)
  async exampleQuery(
    @Ctx() ctx: RequestContext,
    @Args() { input }: SearchExampleArgs,
  ){
    let sql = this.listQueryBuilder
    .build(Example);

    if(input.id){
      sql.where({id:input.id});
    }
    if(input.title){
      sql.where({title:input.title});
    }
    return sql.getManyAndCount()
        .then(([items, totalItems]) => ({
            items,
            totalItems
        }));
  }

  // Insert Example
  @Mutation()
  async insertExample(
      @Ctx() ctx: RequestContext,
      @Args() { input }: MutationSubmitExampleArgs,
    ){
      const example = new Example(input);
      return this.connection.getRepository(ctx, Example).save(example);
  }

  // Update Example
  @Mutation()
  async updateExample(
    @Ctx() ctx: RequestContext,
    @Args() { input }: MutationUpdateExampleArgs,
  ){
    const example = await this.connection.getEntityOrThrow(ctx, Example, input.id);
    const updatedExample = patchEntity(example, input);
    return await this.connection.getRepository(ctx, Example).save(updatedExample);
    // Logger.info(JSON.stringify(update));

  }

  // Delete
  @Mutation()
  async deleteExample(
    @Ctx() ctx: RequestContext,
    @Args(){ id } : MutationDeleteExampleArgs
  ){
    const example = await this.connection.getEntityOrThrow(ctx, Example, id);
    await this.connection.getRepository(ctx, Example).remove(example);

    const code = 200;
    const message = "Delete Success!";

    return {code, message};
  }


  //Customer
  @Mutation()
  async registerCustomerAccountCustom(
      @Ctx() ctx: RequestContext,
      @Args() { input }: MutationSubmitCustomerArgs,
    ){
     // const customer = new Customer(input);
      var UserPhone = input.phoneNumber;
      
      // if(UserPhone == '012565323') {
      //   console.log('User Exist');
      // }
      // else {
      //   return this.connection.getRepository(ctx, Customer).save(customer);
      // }

      this.customerService.registerCustomerAccount(ctx, input);

      return 'Success';
      // return this.connection.getRepository(ctx, Example).save(example);
  }
}