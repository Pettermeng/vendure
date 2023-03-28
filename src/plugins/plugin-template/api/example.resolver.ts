import { Inject} from '@nestjs/common';
import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { Permission, Allow, RequestContext, Ctx, Logger, TransactionalConnection,translateDeep, ListQueryBuilder, patchEntity, User, CustomerService, Customer, UserService, AuthenticationMethod, AuthService } from '@vendure/core';
import { loggerCtx, PLUGIN_INIT_OPTIONS } from '../constants';
import { ExampleOptions } from '../example.plugin';
import { Example } from '../entity/example.entity';
import { MutationDeleteExampleArgs, MutationLoginArgs, MutationSubmitCustomerArgs, MutationSubmitExampleArgs, MutationUpdateCustomerArgs, MutationUpdateExampleArgs, SearchExampleArgs } from './generated-type';
import { RegisterCustomerInput } from './generated-type'; 

@Resolver()
export class ExampleResolver {

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private customerService: CustomerService,
        private authService: AuthService

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


  //Create customer custom account
  @Mutation()
  async registerCustomerAccountCustom(
      @Ctx() ctx: RequestContext,
      @Args() { input }: MutationSubmitCustomerArgs,
    ){

      var UserPhone = input.phoneNumber;
      let sql = this.listQueryBuilder
      .build(Customer);

      //@Check Exist with user phone or email
      // sql.where({
      //   phoneNumber:UserPhone
      // }).orWhere({
      //   emailAddress:input.emailAddress
      // });

      //@Check Exist with user email
      sql.where({
        emailAddress:input.emailAddress  
      })

      const user_exist = await sql.getCount();
      
      if(user_exist > 0) {
        const code = 409;
        const message = "User Exist!";
        return {code, message}
      }
      else {
        this.customerService.registerCustomerAccount(ctx, input);
        const code = 200;
        const message = "User Register";
        return {code, message};
      }
  }

  //Custom user login
  @Mutation()
  async customLogin(
      @Ctx() ctx: RequestContext,
      @Args() {username, password}: MutationLoginArgs
    ){
      
      var token = "";
      var code  = "401";
      var message  = "INVALID_CREDENTIALS_ERROR";
      var isLogin: any;
      
      const sql = this.listQueryBuilder.build(Customer);

      if(isNaN(username)){
        sql.where({emailAddress: username});
      }else {
        sql.where({phoneNumber: username});
      }
      
      const customer = await sql.getOne();

      if(customer){
        if(customer.user){
          const userId = customer.user.id ? customer.user.id : "";
          isLogin = await this.authService.verifyUserPassword(ctx, userId, password);
          if(isLogin===true){ 
            var session = await this.authService.createAuthenticatedSessionForUser(ctx, customer.user,"");
            var ses = JSON.parse(JSON.stringify(session));
            token = ses.token ? ses.token : '';
            if(token != '') {
              code = "200";
              message = 'Login Successfully';
            }
            else {
              code = "401";
              message = 'User not verify';
            }
          }
        }
      }
      return {code, message, token};
  }


}