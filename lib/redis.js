import Redis from "ioredis"
import dotenv from 'dotenv'

dotenv.config()

// const redis = new Redis(process.env.UPSTASH_REDIS_URL);
//         redis.on('connect', ()=>{
//             console.log("Redis Connected");
            
//         })
//         redis.on('error', (error) => {
//             console.log("error in connecting to redis server");
            
//         })
const redis = ""
export default redis
//await client.set('foo', 'bar');