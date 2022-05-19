import fetch, { Response } from "node-fetch"
import { S3 } from "@aws-sdk/client-s3"

const s3 = new S3()
const apiKeyFile = await s3.getObject({
    Bucket: "fulla-subsystem",
    Key: "hermod",
})
const apiKey = await (new Response(apiKeyFile.Body).text())

const typeMap = {
    "bits": "channel.cheer",
    "redeem": "channel.channel_points_custom_reward_redemption.add"
}

export async function handler(event) {
    const secret = event.stageVariables.twitch_secret
    const { type } = JSON.parse(event.body)

    const payload = {
        "type": typeMap[type],
        "version": "1",
        "condition": {
            "broadcaster_user_id": "64263610"
        },
        "transport": {
            "method": "webhook",
            "callback": "https://api.axel669.net/hermod/rtc/send",
            "secret": secret
        }
    }

    const res = await fetch(
        "https://api.twitch.tv/helix/eventsub/subscriptions",
        {
            method: "POST",
            headers: {
                "Client-Id": "mrz3t77h5octc2glld7a2qaw8vuo7q",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        }
    )

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            success: true,
            code: res.status
        })
    }
}
