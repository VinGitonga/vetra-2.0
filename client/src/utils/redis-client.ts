import { Client } from "redis-om";
import type { Client as RedisClientType } from "redis-om";
import { redis_url } from "@/../env";

class RedisClient {
  client: RedisClientType;

  constructor() {
    this.client = new Client();
  }

  async initClient() {
    if (this.client.isOpen()) {
      return this.client;
    }
    await this.client.open(redis_url);
    return this.client;
  }

  async closeClient() {
    await this.client.close();
  }
}

export default RedisClient;
