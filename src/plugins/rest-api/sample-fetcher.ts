import http from 'http';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import QueryString from 'qs';

@Injectable()
export class CatFetcher {

  sendOtp(phone: String): Promise<string> {
    return new Promise((resolve) => {

        let otpNumber = Math.floor(100000 + Math.random() * 900000);

        let data = QueryString.stringify({
            'to': phone,
            'sender': 'SMS Info',
            'content': 'Here is OTP Number: '+ otpNumber,
            'username': 'ponnimol944@gmail.com',
            'password': 'zI92%K&nTn65sLM%6' 
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://cloudapi.plasgate.com/api/send',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            resolve('done!');
        })
        .catch((error) => {
            console.log(error);
        });

    });
  }

  fetchCat(): Promise<string> {
    return new Promise((resolve) => {
      http.get('http://aws.random.cat/meow', (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(JSON.parse(data).file));
      });
    });
  }
}