<script>
    import {
        Avatar,
        Button,
        Paper,
        Select,
        TitleBar,
    } from "svelte-doric"
    import { Flex } from "svelte-doric/layout"

    import api from "@/comm/api"
    import settings from "@/state/settings"
    import user from "@/state/user"

    const overlayURL = `${document.location.origin}/overlay/${$user.userID}/${$settings.rtcID}`

    function copyURL() {
        navigator.clipboard.writeText(overlayURL)
    }

    const presets = [
        { label: "Axel", value: "axel" },
        { label: "Hachi", value: "hachi" }
    ]
    let preset = $settings.preset ?? "axel"

    async function save() {
        const newSettings = {
            rtcID: $settings.rtcID,
            preset,
        }
        console.log(
            await api.saveSettings(newSettings)
        )
    }
</script>

<Paper width="min(100%, 720px)" center square>
    <TitleBar sticky slot="title">
        <Avatar image={$user.profileImage} />
        &nbsp;
        {$user.displayName}
    </TitleBar>

    <Flex>
        <Button color="secondary" variant="outline" on:tap={copyURL}>
            Copy Overlay URL
        </Button>

        <Paper card>
            <Select label="Preset" options={presets} bind:value={preset} />

            <Button variant="outline" color="secondary" slot="action" on:tap={save}>
                Save
            </Button>
        </Paper>
    </Flex>
</Paper>
