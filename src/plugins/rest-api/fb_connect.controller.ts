import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { Ctx, ProductService, RequestContext, Permission, Allow, CustomerService, UserService, Logger } from '@vendure/core'; 
import { Request } from 'express';
import { CreateUserDto } from './create-cat.dto';
import { CatFetcher } from './sample-fetcher';

@Controller('fb_connect')
export class FacebookController {

  constructor(
    private catFetcher: CatFetcher
  ){}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Logger.info('data=' + JSON.stringify(createUserDto.username));
    const result = await this.catFetcher.sendOtp("85510527675");
    return result;
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
