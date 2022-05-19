<script>
    import user from "@/state/user"
    import api from "@/comm/api"

    import { play, speaking } from "@/sq.tea"

    var pusher = new Pusher(
        "899b707ba67ecd6e8aa3",
        { cluster: "us3" }
    )

    const channel = pusher.subscribe($user.roomID)
    // const targetID = "3eaf48cf-26cf-450a-a64b-95ce250e58b3"
    channel.bind(
        "redeem",
        function (data) {
            const id = data.message.event.reward.id

            if (id !== settings.redeem) {
                return
            }

            play(data.message.event.user_input, settings.preset)
        }
    )
    channel.bind(
        "bits",
        function (data) {
            const { message } = data
            play(message.event.message, settings.preset)
        }
    )
    channel.bind(
        "settings",
        function(data) {
            settings = data
        }
    )

    let settings = null

    api.loadOverlaySettings($user)
        .then(
            data => settings = data
        )
</script>

<style>
    chat-avatar {
        display: block;
        position: absolute;
        top: 10%;
        left: 10%;
        right: 10%;
        bottom: 10%;

        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;

        opacity: 0.6;
    }
    chat-avatar.speaking {
        opacity: 1;
        animation-name: test;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }

    .axel {
        background-image: url(/monika_mouthclosed.png);
    }
    .axel.speaking {
        background-image: url(/monika_talking.gif);
    }

    .hachi {
        background-image: url(/quiet.png);
    }
    .hachi.speaking {
        background-image: url(/chat_talking.gif);
    }

    @keyframes test {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(10deg);
        }
        75% {
            transform: rotate(-10deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }
</style>

{#if settings !== null}
    <chat-avatar class:speaking={$speaking} class={settings.preset} />
{/if}
