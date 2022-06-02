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

    window.api = api

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
        await api.query({
            "success:koe.update": newSettings,
        })
        // console.log(
        //     await api.saveSettings(newSettings)
        // )
    }

    // const imageList = api.main({
    //     "imageList:images.list": {}
    // }).then(res => res.imageList.value)

    async function fileStuff(event) {
        const files = event.target.files

        // console.log(files)

        const {type, name} = files[0]
        const [ext] = name.split(".").slice(-1)

        const buffer = await new Promise(
            resolve => {
                const reader = new FileReader()
                reader.addEventListener(
                    "load",
                    () => resolve(reader.result)
                )
                reader.readAsDataURL(files[0])
            }
        )
        const [, data] = buffer.split(",")

        console.log(
            await api.main({
                "file:upload": {
                    type,
                    ext,
                    data,
                }
            })
        )
        // const extension = files[0]
        event.target.value = ""

        // console.log(
        //     buffer.match(/data:(?<type>.+?)(;base64)?,(?<data>.+)/).groups
        // )
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

<style>
    div.image-thing {
        width: 100%;
        height: 320px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: var(--image);
    }
</style>

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

            <!-- <input type="file" value="" on:change={fileStuff} /> -->

            <!-- {#await imageList}
                <div>Loading images?</div>
            {:then images}
                {#each images as image}
                    <div class="image-thing" style="--image: url('https://image.axel669.net/{image}');" />
                {/each}
            {/await} -->
        </Flex>
    {/if}
</Paper>
