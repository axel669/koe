import {writable} from "svelte/store"

const pitch = new writable(2)
const voice = new writable("en-US-Standard-F")
const rate = new writable(1)

window.monika = {
    pitch,
    voice,
    rate,
}

export {
    pitch,
    voice,
    rate,
}
