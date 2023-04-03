import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { Ctx, ProductService, RequestContext, Permission, Allow, CustomerService, UserService, Logger, TransactionalConnection, ListQueryBuilder, AuthService, Customer, User, AuthenticationMethod, NativeAuthenticationMethod } from '@vendure/core'; 
import { Request } from 'express';
import { CreateUserDto } from './create-register.dto';
import { CatFetcher } from './social-fetcher';

@Controller('link_fb_account')
export class LinkFbController {

    constructor(
        private catFetcher: CatFetcher,
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private authService: AuthService
    ){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto, @Ctx() ctx: RequestContext) {
        var indentifier  = createUserDto.identifier;
        var access_token = createUserDto.access_token;
        var token = "";
        var code  = "401";
        var message  = "INVALID_CREDENTIALS_ERROR";
        var fbId, name, fName, lName;

        if(indentifier != '' && access_token != '') {
            const result = await this.catFetcher.fbAccess(access_token);
            const response = JSON.parse(JSON.stringify(result));
            fbId  = response.id;
            name  = response.name;
            fName = response.first_name;
            lName = response.last_name;
        
            //Query Check User Exist on Auth
            const sql = this.listQueryBuilder.build(NativeAuthenticationMethod).where({identifier: fbId});
            const userExist = await sql.getOne(); 

            //Query Check User Exist on User for create Auth
            const sqlUser = this.listQueryBuilder.build(User).where({identifier: indentifier});
            const userData = await sqlUser.getOne(); 

            if(userExist && userData) {
                // Insert Auth Method
                var authObj = new NativeAuthenticationMethod;
                authObj.identifier = fbId;
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
            message = "Bad Request";
            token = "";
            return {code, message, token};
        }

    }    

}