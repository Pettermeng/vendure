import { VendureEntity } from '@vendure/core';
import {Column, Entity} from 'typeorm';
import { DeepPartial } from '@vendure/common/lib/shared-types';

@Entity()
export class Example extends VendureEntity {

    constructor(input?: DeepPartial<Example>) {
        super(input);
      }
    
      @Column()
      title: string;
      
      @Column()
      description: string;
}


// //Customer
// @Entity()
// export class Customer extends VendureEntity {

//     constructor(input?: DeepPartial<Customer>) {
//         super(input);
//     }
  
//     @Column()
//     title: string;
// }