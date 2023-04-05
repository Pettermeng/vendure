import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductsController } from './products.controller';
import { FacebookController } from './fb_connect.controller';
import { CatFetcher } from './social-fetcher';
import { GoogleController } from './google_connect.controller';
import { AppleController } from './apple_connect.controller';
import { LinkFbController } from './link_fb_account.controller';
import { LinkGoogleController } from './link_google_account.controller';
import { LinkAppleIDController } from './link_apple_id_account.controller';

@VendurePlugin({
  imports: [PluginCommonModule],
  providers:[CatFetcher],
  controllers: [ProductsController ,FacebookController ,GoogleController ,AppleController ,LinkFbController ,LinkGoogleController ,LinkAppleIDController],
})
export class RestPlugin {}
