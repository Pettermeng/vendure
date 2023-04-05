import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { Ctx, ProductService, RequestContext, Permission, Allow, CustomerService, UserService, Logger, TransactionalConnection, ListQueryBuilder, AuthService, Customer, User, AuthenticationMethod, NativeAuthenticationMethod } from '@vendure/core'; 
import { Request } from 'express';
import { AppleLoginDto, CreateUserDto } from './create-register.dto';
import { CatFetcher } from './social-fetcher';

@Controller('link_apple_id_account')
export class LinkAppleIDController {
    
    constructor(
        private catFetcher: CatFetcher,
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private authService: AuthService
    ){}

    @Post()
    async createUser(@Body() createUserDto: AppleLoginDto, @Ctx() ctx: RequestContext) {
        
      var token = "";
      var code  = "401";
      var message  = "INVALID_CREDENTIALS_ERROR";

      var displayName, email, userName, indentifier;
      indentifier = createUserDto.identifier;
      email       = createUserDto.email;      

      if(indentifier != '' && displayName != '' && email != '' && userName != '') {    
          //Query Check User Exist on Auth
          const sql = this.listQueryBuilder.build(NativeAuthenticationMethod).where({identifier: email});
          const userExist = await sql.getOne(); 
    
          //Query Check User Exist on User for create Auth
          const sqlUser = this.listQueryBuilder.build(User).where({identifier: indentifier});
          const userData = await sqlUser.getOne(); 
          
          if(userExist != null && userData) {
              // Insert Auth Method
              var authObj = new NativeAuthenticationMethod;
              authObj.identifier = email;
              authObj.user = userData;

              await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(authObj);
              var session = await this.authService.createAuthenticatedSessionForUser(ctx, userData,"");
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
              return {code, message, token};
          }
          else {
              code = "400";
              message = "User not exist";
              token = "";
              return {code, message, token};
          }
      }
      else {
        code = "400";
        message = "Bad request";
        token = "";
        return {code, message, token};
      }  
    }    
}