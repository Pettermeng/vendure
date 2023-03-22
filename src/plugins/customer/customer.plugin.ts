import { PluginCommonModule, VendurePlugin,Asset, LanguageCode  } from '@vendure/core';

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: config => {
    
    // User Code
    config.customFields.Customer.push(
      {
        name: 'userCode',
        type: 'string',
        label: [
          {
            languageCode: LanguageCode.en,
            value: 'User Code' 
          },
        ],
      },
    );

    // Invite Code
    config.customFields.Customer.push(
      {
        name: 'inviteCode',
        type: 'string',
        label: [
          {
            languageCode: LanguageCode.en,
            value: 'Invite Code' 
          },
        ],
      },
    );

    // User Odoo ID
    config.customFields.Customer.push(
      {
        name: 'odooId',
        type: 'string',
        label: [
          {
            languageCode: LanguageCode.en,
            value: 'Odoo ID' 
          },
        ],
      },
    );

    // Avartar 
    config.customFields.Customer.push(
      {
        name: 'avatar',  // column name in db: avatarId
        type: 'relation',
        entity: Asset,
        // may be omitted if the entity name matches the GraphQL type name,
        // which is true for all built-in entities.
        graphQLType: 'Asset', 
        // Whether to "eagerly" load the relation
        // See https://typeorm.io/#/eager-and-lazy-relations
        eager: false,
        label: [
          {
            languageCode: LanguageCode.en,
            value: 'Avatar' 
          },
        ],
      },
    );
    return config;
  }
})
export class CustomerPlugin {}
