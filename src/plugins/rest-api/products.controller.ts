import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Ctx, ProductService, RequestContext, Permission, Allow } from '@vendure/core'; 

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  // @Allow(Permission.ReadProduct) 
  @Get() 
  findAll(@Ctx() ctx: RequestContext) {
    return this.productService.findAll(ctx);
  } 

  @Get(":id")
  findOne(@Ctx() ctx: RequestContext, @Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(ctx, id);
  }
}
