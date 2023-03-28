import http from 'http';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import QueryString from 'qs';
import { AuthService, CustomerService, ListQueryBuilder, TransactionalConnection } from '@vendure/core';

@Injectable()
export class CatFetcher {

  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customerService: CustomerService,
    private authService: AuthService

  ){}

  fbAccess(access_token: String): Promise<string> {
    return new Promise((resolve) => {

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://graph.facebook.com/me/?fields=id,name,first_name,last_name,email&access_token='+access_token,
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    });
  }
}