import { writable } from "svelte/store"

import api from "@/comm/api"
import twitch from "@/comm/twitch"
import { Err } from "@/comm/safe"

import settings from "@/state/settings"

const url = new URL(document.location.href.toString().replace("#", "?"))
const login = async () => {
    // const url = new URL(document.location.href.toString().replace("#", "?"))

    if (url.searchParams.has("access_token") === false) {
        return
    }

    const idToken = url.searchParams.get("id_token")
    const accessToken = url.searchParams.get("access_token")

    history.replaceState(null, document.title, location.origin)

    await api.login(accessToken)
}

const user = writable(
    null,
    async (set) => {
        await login()

        if (url.pathname !== "/") {
            const [, , userID, roomID] = url.pathname.split("/")
            set({ userID, roomID })
            return
        }

        const user = await api.currentUser()
        if (Err(user)) {
            set(false)
            return
        }

        twitch.init(user)
        const twitchUserInfo = await twitch.userInfo(user.userID)
        if (Err(twitchUserInfo)) {
            set(false)
            return
        }

        const {koeSettings} = await api.query({
            "koeSettings:koe.load": {}
        })
        if (Err(koeSettings)) {
            set(false)
            return
        }
        settings.set(koeSettings)

        user.profileImage = twitchUserInfo.profile_image_url
        set(user)
    }
)

const win = (name) =>
    (obj) => {
        window[name] = obj
        return obj
    }

export default user
