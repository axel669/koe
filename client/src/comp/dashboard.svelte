<script>
    import {
        Avatar,
        Button,
        Paper,
        Select,
        TitleBar,

        CircleSpinner as Spinner,
    } from "svelte-doric"
    import { Flex } from "svelte-doric/layout"

    import sort from "@axel669/array-sort"

    import api from "@/comm/api"
    import settings from "@/state/settings"
    import user from "@/state/user"
    import twitch from "@/comm/twitch"

    const overlayURL = `${document.location.origin}/overlay/${$user.userID}/${$settings.rtcID}`

    function copyURL() {
        navigator.clipboard.writeText(overlayURL)
    }

    let redeems = null
    let redeem = null

    const presets = [
        { label: "Axel", value: "axel" },
        { label: "Hachi", value: "hachi" }
    ]
    let preset = $settings.preset ?? "axel"

    async function save() {
        const newSettings = {
            rtcID: $settings.rtcID,
            preset,
            redeem,
        }
        console.log(
            await api.saveSettings(newSettings)
        )
    }

    twitch.rewards($user.userID)
        .then(
            rewards => {
                redeems = rewards.map(
                    r => ({ label: r.title, value: r.id })
                ).sort(
                    sort.map(
                        item => item.label,
                        sort.natural
                    )
                )
                redeem = $settings.redeem ?? redeems[0].value
            }
        )
</script>

<Paper width="min(100%, 720px)" center square>
    <TitleBar sticky slot="title">
        <Avatar image={$user.profileImage} />
        &nbsp;
        {$user.displayName}
    </TitleBar>

    {#if redeems === null}
        <div style="text-align: center">
            <Spinner size={240} />
        </div>
    {:else}
        <Flex>
            <Button color="secondary" variant="outline" on:tap={copyURL}>
                Copy Overlay URL
            </Button>

            <Paper card>
                <Select label="Preset" options={presets} bind:value={preset} />
                <Select label="Redeem" options={redeems} bind:value={redeem} />

                <Button variant="outline" color="secondary" slot="action" on:tap={save}>
                    Save
                </Button>
            </Paper>
        </Flex>
    {/if}
</Paper>
