import { createClient } from "redis";
import { serverConfig } from ".";
export const redisClient = createClient({
    url: serverConfig.REDIS_URL
});

redisClient.on('error', (err) =>{
     console.log("Redis Client Error", err)
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

export async function initRedis(){
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        throw error;
    }
}
export async function closeRedis(){
   await redisClient.quit();
}