import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { Ctx, ProductService, RequestContext, Permission, Allow, CustomerService, UserService, Logger, TransactionalConnection, ListQueryBuilder, AuthService, Customer, User, AuthenticationMethod, NativeAuthenticationMethod } from '@vendure/core'; 
import { Request } from 'express';
import { AppleLoginDto, CreateUserDto } from './create-register.dto';
import { CatFetcher } from './social-fetcher';

@Controller('apple_connect')

export class AppleController {

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

      var displayName, email, userName;
      displayName = createUserDto.display_name;
      email       = createUserDto.email;
      userName    = createUserDto.user_name;
      
      if(email != '') {
        //Query Check User Exist
        const sql = this.listQueryBuilder.build(NativeAuthenticationMethod).where({identifier: email});
        const userExist = await sql.getOne(); 

        const sqlUser = this.listQueryBuilder.build(User).where({identifier: email});
        const userData = await sqlUser.getOne(); 
        
        if(userExist && userData){
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
            // Insert User 
            var userObj = new User;
            userObj.identifier = email;
            userObj.verified = true;
            const userdata = await this.connection.getRepository(ctx, User).save(userObj);
      
            //  Insert Customer
            var customerObj = new Customer;
            customerObj.firstName    = displayName;
            customerObj.lastName     = userName;
            customerObj.emailAddress = email;
            customerObj.user = userdata;
            await this.connection.getRepository(ctx, Customer).save(customerObj);
      
            // Insert Auth Method
            var authObj = new NativeAuthenticationMethod;
            authObj.identifier = email;
            await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(authObj);
      
            var session = await this.authService.createAuthenticatedSessionForUser(ctx, userdata,"");
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
      }
      else {
        code = "400";
        message = "Bad Request";
        token = "";
        return {code, message, token};
      }
    }  
}