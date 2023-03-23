import { Customer, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { shopSchema } from "./api/api-extensions";
import { ExampleResolver } from "./api/example.resolver";

import { PLUGIN_INIT_OPTIONS } from "./constants";
import { Example } from "./entity/example.entity";

export interface ExampleOptions {
  enabled: boolean;
}

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: PLUGIN_INIT_OPTIONS,
      useFactory: () => ExamplePlugin.options,
    },
  ],
  shopApiExtensions: {
    resolvers: [ExampleResolver],
    schema: shopSchema
  },
  entities:[Example]
})
export class ExamplePlugin {
  static options: ExampleOptions;

  static init(options: ExampleOptions) {
    this.options = options;
    return ExamplePlugin;
  }
}
