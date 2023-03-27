import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductsController } from './products.controller';
import { FacebookController } from './fb_connect.controller';
import { CatFetcher } from './sample-fetcher';

@VendurePlugin({
  imports: [PluginCommonModule],
  providers:[CatFetcher],
  controllers: [ProductsController ,FacebookController],
})
export class RestPlugin {}
