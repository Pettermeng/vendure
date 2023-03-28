export type Scalars = {
    ID: string | number;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
    DateTime: any;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: any;
    /** The `Upload` scalar type represents a file upload. */
    Upload: any;
  };

export type SubmitExampleInput = {
    title: Scalars['String'];
    description: Scalars['String'];
  };

export type MutationSubmitExampleArgs = {
input: SubmitExampleInput;
};

export type UpdateExampleInput = {
    id: Scalars['ID']
    title: Scalars['String'];
    description: Scalars['String'];
  };

export type MutationUpdateExampleArgs = {
    input: UpdateExampleInput;
};

export type MutationDeleteExampleArgs = {
  id: Scalars['ID'];
};

export type SearchExampleArgs = {
  input: SearchExampleInput;
};
    
export type SearchExampleInput = {
  id: Scalars['ID']
  title: Scalars['String'];
  description: Scalars['String'];
};


//Customer
export type SubmitCustomerInput = {
  title: Scalars['String'];
  phoneNumber: Scalars['String'];
};

//Customer Register Custom
export type MutationSubmitCustomerArgs = {
  input: RegisterCustomerInput;
};


export declare type RegisterCustomerInput = {
  emailAddress: Scalars['String'];
  title: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
  password: Scalars['String'];
};


//Customer Update Custom
export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerShopInput;
};

export declare type UpdateCustomerShopInput = {
  title: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
};


//Customer Update Custom
export declare type MutationLoginArgs = {
  username: any;
  password: Scalars['String'];
};