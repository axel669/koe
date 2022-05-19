import redisConnection from "/opt/redis-connection/index.mjs"

export async function handler(event) {
    const info = JSON.parse(event.body)

    const redis = await redisConnection(
        event.stageVariables.redisURL,
        event.stageVariables.redisPassword
    )

    const stored = await redis.get(`${info.userID}:rtc-settings`)
    if (stored === null) {
        return {}
    }

    const settings = JSON.parse(stored)
    if (settings.rtcID !== info.roomID) {
        return {}
    }

    return settings
}
