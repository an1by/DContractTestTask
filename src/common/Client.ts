import axios from 'axios';
import { UserRow } from '../types/UserRow';
import { ClientStatus } from '../types/ClientStatus';
import { USER_FIELDS } from '../types/UserField';

export default class Client {
  private readonly axios = axios.create({
    baseURL: 'http://94.103.91.4:5000',
    timeout: 1000,
  });
  private readonly username: string;
  private token?: string | null;

  constructor(username: string) {
    this.username = username;
  }

  private async getTokenThroughAuth(path: string): Promise<string | null> {
    const payload = {
      'username': this.username,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await this.axios.post(`/auth/${path}`, payload, config);
      return response.data['token'];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async auth() {
    this.token = await this.getTokenThroughAuth('registration');
    if (!this.token) {
      this.token = await this.getTokenThroughAuth('login');
    }
    if (!this.token) {
      throw new Error('Ошибка авторизации!');
    }
  }

  async getClientList(limit: number, offset: number): Promise<UserRow[] | null> {
    const options = {
      'headers': {
        'Authorization': this.token,
      },
    };
    try {
      const response = await this.axios.get(`/clients?limit=${limit}&offset=${offset}`, options);
      return response.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getClientStatuses(ids: number[]): Promise<ClientStatus[] | null> {
    const payload = {
      'userIds': ids,
    };
    const options = {
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': this.token,
      },
    };
    try {
      const response = await this.axios.post(`/clients`, payload, options);
      return response.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAllClients(): Promise<UserRow[]> {
    let list: UserRow[] = [];

    const limit = 1000;
    let offset = 0;
    while (true) {
      const responseList = await this.getClientList(limit, offset);
      if (!responseList || responseList.length == 0) {
        break;
      }
      const ids = responseList.map(o => o.id);
      const statuses = await this.getClientStatuses(ids);
      if (!statuses) {
        break;
      }

      let resultList: UserRow[] = [];
      for (let i = 0; i < responseList.length; i++) {
        let user = responseList[i];
        user.status = statuses[i].status;
        resultList.push(user);
      }

      list.push(...resultList);
      console.log(`Gotten: ${JSON.stringify(resultList[limit - 1])}`);
      offset += limit;
    }
    return list;
  }
}