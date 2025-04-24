import { Client } from '@elastic/elasticsearch';
import config from '../config';

let client: Client;

export function initElasticsearchClient(): void {
  client = new Client({
    node: config.eshost,
    ...(config.esuser && config.espassword ? {
      auth: {
        username: config.esuser,
        password: config.espassword,
      },
    } : {}),
  });
}

export function getElasticClient(): Client {
  if (!client) {
    throw new Error('Elasticsearch client not initialized!');
  }
  return client;
}
