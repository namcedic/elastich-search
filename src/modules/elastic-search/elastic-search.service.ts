import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticSearchService {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    const username = this.configService.get('elastic.username');
    const password = this.configService.get('elastic.password');
    const host = this.configService.get('elastic.host');
    const port = this.configService.get('elastic.port');

    console.log('data', username, password, host, port);

    this.client = new Client({
      node: `http://${host}:${port}`,
      auth: {
        username,
        password,
      },
    });
  }

  getClient(): Client {
    return this.client;
  }

  async getItem(index: string, id: string) {
    return await this.client.search({
      index,
      query: {
        match: {
          id,
        },
      },
    });
  }
}
