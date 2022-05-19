<script>
    import {
        AppStyle,
        Baseline as baseline,

        HexagonSpinner as Spinner,

        Button,
        Select,
    } from "svelte-doric"
    import { TronTheme as theme } from "svelte-doric/theme"

    import Login from "@/comp/login.svelte"
    import Overlay from "@/comp/overlay.svelte"
    import Dashboard from "@/comp/dashboard.svelte"

    import user from "@/state/user"
    import { play, speaking } from "./sq.tea"

    let redeemList = null
// ./twitch.exe event trigger cheer -f 64263610 -t 64263610 -F https://api.axel669.net/hermod/rtc/send -s "need a longer secret"
    async function redeems() {
        play("Every day, I imagine a future where I can be with you")
    }
</script>

<style>
    load-area {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }
</style>

<AppStyle {baseline} {theme} />

{#if $user === null}
    <load-area>
        <Spinner size={120} />
    </load-area>
{:else}
    {#if $user === false}
        <Login />
    {:else if $user.roomID !== undefined}
        <Overlay />
    {:else}
        <Dashboard />
    {/if}
{/if}
