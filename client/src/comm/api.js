import http from "./http.js"

const apiURL = "https://api.axel669.net/hermod"

function get(route, options) {
    return http.get(`${apiURL}${route}`, options)
}
function postJSON(route, data, options) {
    return http.postJSON(`${apiURL}${route}`, data, options)
}

async function login(key) {
    const result = await postJSON(
        "/login",
        { key }
    )

    if (result === true) {
        return
    }
    console.log("Login failed")
}

async function currentUser() {
    return await get("/user")
}
async function loadSettings() {
    return await get("/rtc/settings")
}
async function saveSettings(settings) {
    return await postJSON("/rtc/settings", settings)
}
async function loadOverlaySettings(info) {
    return await postJSON("/overlay/settings", info)
}

export default {
    login,
    currentUser,
    loadSettings,
    saveSettings,
    loadOverlaySettings,
}
