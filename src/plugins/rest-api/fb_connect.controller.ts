import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { Ctx, ProductService, RequestContext, Permission, Allow, CustomerService, UserService, Logger, TransactionalConnection, ListQueryBuilder, AuthService, Customer, User, AuthenticationMethod, NativeAuthenticationMethod } from '@vendure/core'; 
import { Request } from 'express';
import { CreateUserDto } from './create-register.dto';
import { CatFetcher } from './social-fetcher';

@Controller('fb_connect')
export class FacebookController {

  constructor(
    private catFetcher: CatFetcher,
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private authService: AuthService
  ){}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Ctx() ctx: RequestContext) {
    var access_token = createUserDto.access_token;

    var token = "";
    var code  = "401";
    var message  = "INVALID_CREDENTIALS_ERROR";
    var fbId, name, fName, lName;
    if(access_token != '') {
      const result = await this.catFetcher.fbAccess(access_token);
      const response = JSON.parse(JSON.stringify(result));
      fbId  = response.id;
      name  = response.name;
      fName = response.first_name;
      lName = response.last_name;
  
      //Query Check User Exist
      const sql = this.listQueryBuilder.build(NativeAuthenticationMethod).where({identifier: fbId});
      const userExist = await sql.getOne(); 
  
      const sqlUser = this.listQueryBuilder.build(User).where({identifier: fbId});
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
        userObj.identifier = fbId;
        userObj.verified = true;
        const userdata = await this.connection.getRepository(ctx, User).save(userObj);
  
        //  Insert Customer
        var customerObj = new Customer;
        customerObj.firstName    = fName;
        customerObj.lastName     = lName;
        customerObj.emailAddress = '';
        customerObj.user = userdata;
        await this.connection.getRepository(ctx, Customer).save(customerObj);
  
        // Insert Auth Method
        var authObj = new NativeAuthenticationMethod;
        authObj.identifier = fbId;
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

  @Get()
  findAll(@Ctx() request: Request): string {
    return 'This action returns all cats';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

}
