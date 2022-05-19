import hermodUser from "/opt/hermod-get-user/index.mjs"
import redisConnection from "/opt/redis-connection/index.mjs"

import { v4 } from "uuid"

export async function handler(event) {
    const user = hermodUser(event)
    const redis = await redisConnection(
        event.stageVariables.redisURL,
        event.stageVariables.redisPassword
    )

    const key = `${user.userID}:rtc-settings`
    const settings = await redis.get(key)

    if (settings !== null) {
        return JSON.parse(settings)
    }

    const defSettings = {
        rtcID: v4()
    }

    await redis.set(
        key,
        JSON.stringify(defSettings)
    )
    return defSettings
}
