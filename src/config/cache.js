import redisClient from "./redis.js"

export const clearNotesCache = async (userId) => {
     await redisClient.del(`note:${userId}`);
}