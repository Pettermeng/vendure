import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductsController } from './products.controller';

@VendurePlugin({
  imports: [PluginCommonModule],
  controllers: [ProductsController],
})
export class RestPlugin {}
