import Pusher from "pusher"

import hermodUser from "/opt/hermod-get-user/index.mjs"
import redisConnection from "/opt/redis-connection/index.mjs"

export async function handler(event) {
    const settings = event.body
    const message = JSON.parse(settings)
    const user = hermodUser(event)
    const redis = await redisConnection(
        event.stageVariables.redisURL,
        event.stageVariables.redisPassword
    )

    const key = `${user.userID}:rtc-settings`
    await redis.set(key, settings)

    const pusher = new Pusher({
        appId: "1217767",
        key: "899b707ba67ecd6e8aa3",
        secret: event.stageVariables.pusher_secret,
        cluster: "us3",
        useTLS: true
    })

    await pusher.trigger(
        message.rtcID,
        "settings",
        message
    )

    return { success: true }
}
