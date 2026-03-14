import { serverConfig } from "../config";
import { redisClient } from "../config/redis";
export class CacheRepository{
    
    private async ensureConnected(){
        if(!redisClient.isOpen){
            await redisClient.connect();
        }
    }
    async getNextId():Promise<number>{
        const key = serverConfig.REDIS_COUNTER_KEY;
        await this.ensureConnected();
        const result = await redisClient.incr(key);
        return result;
    }

    async setUrlMapping(shortUrl:string, originalUrl:string){
        const key = `url.${shortUrl}`;
        await this.ensureConnected();
        await redisClient.set(key, originalUrl,{EX:86400});
    }

    async getUrlMapping(shortUrl:string):Promise<string|null>{
        const key = `url.${shortUrl}`;
        await this.ensureConnected();
        const result = await redisClient.get(key);
        return result;
    }

    async deleteUrlMapping(shortUrl:string):Promise<void>{
        const key = `url.${shortUrl}`;
        await this.ensureConnected();
        await redisClient.del(key);
    }
}