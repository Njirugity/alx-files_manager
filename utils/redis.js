import { createClient } from "redis";
import { promisify } from 'util'
class RedisClient{
    constructor(){
        this.client = createClient();
        this.isConnected = true;
        this.client.on('error', (err) => {
        console.error('Redis client failed to connect:', err.message || err.toString());
        this.isConnected = false;
        });
        this.client.on('connect', () => {
        this.isConnected = true;
        });
    }

    isAlive(){
        return this.isConnected
    }
    async get(key) {
        const getAsync = promisify(this.client.get).bind(this.client);
        try {
        const value = await getAsync(key);
        return value;
        } catch (err) {
        return (`Failed to get ${key}: ${err.messsage}`);
        }
    }
    async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    try {
      await setAsync(key, value, 'EX', duration);
    } catch (err) {
      throw new Error(`Failed to set ${key}: ${err.messsage}`);
    }
  }

    async del(key) {
        const delAsync = promisify(this.client.del).bind(this.client);
        try {
        await delAsync(key);
        } catch (err) {
        console.log(`Failed to delete ${key}: ${err.messsage}`);
        }
    }

}

const redisClient = new RedisClient();
export default redisClient;