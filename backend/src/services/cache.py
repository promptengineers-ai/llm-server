from typing import Any
import aioredis

from src.config.time import TimeEnums

class CacheService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(CacheService, cls).__new__(cls)
        return cls._instance

    def __init__(self, _url):
        self.url = _url
        self.redis = aioredis.from_url(self.url, encoding="utf-8", decode_responses=True)
        
    async def publish(self, channel: str, message: str):
        return await self.redis.publish(channel, message)
        
    async def incr(self, key: str):
        return await self.redis.incr(key)

    async def set(self, key: str, val: Any):
        return await self.redis.set(key, val)

    async def expire(
        self,
        key: str,
        val: Any,
        ttl: int = TimeEnums.ONE_DAY_OF_SECONDS.value,
    ):
        redis = await self.redis.set(key, val)
        await self.redis.expire(key, ttl)
        return redis

    async def keys(self, key: str):
        return await self.redis.keys(key)

    async def mget(self, keys):
        return await self.redis.mget(keys)

    async def get(self, key: str):
        return await self.redis.get(key)

    async def delete(self, key: str):
        redis = await self.redis.delete(key)
        return redis
    
    async def delete_batch(self, pattern: str):
        keys_deleted = 0
        cursor = '0'
        while cursor != 0:
            cursor, keys = await self.redis.scan(cursor, match=pattern, count=100)
            if keys:
                await self.redis.unlink(*keys)
                keys_deleted += len(keys)
        return keys_deleted

    async def redis_listener(self, channel_name: str):

        async def event_generator():
            async with self.redis.client() as conn:
                # Creating a new pub/sub object
                pubsub = conn.pubsub()
                # Subscribing to the channel
                await pubsub.subscribe(channel_name)
                # Listening for messages
                async for message in pubsub.listen():
                    if message['type'] == 'message':
                        yield f"data: {message['data']}\n\n"
        return event_generator