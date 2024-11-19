<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useSignalK } from '@/composables/useSignalK'
import ErrorHandler from '@/components/ErrorHandlerComponent/ErrorHandler.vue'

const props = defineProps<{
    path: string
    name: string
}>()

const enabled = ref(false)
const error = ref<Error | null>(null)
const signalK = useSignalK()

const handleToggle = async (event: Event) => {
    const target = event.target as HTMLElement
    target.blur()

    try {
        await axios({
            method: "PUT",
            url: `http://${location.host}/signalk/v1/api/vessels/self/${props.path.replace(/\./g, '/')}`,
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkphbWVzTWNHaW5uZXNzIiwiaWF0IjoxNzI0MTE5NjgzfQ.2li_BlgX_4EaIi9XFGXG8JUwKe3-ThlJBMUdVViS4G8",
                "Content-Type": "application/json"
            },
            data: {
                value: !enabled.value
            }
        })
    } catch (err) {
        error.value = err as Error
        console.error("Error making PUT request:", err)
    }
}

const handleSignalKMessage = (message: any) => {
    const value = message.updates?.[0]?.values?.[0]?.value
    if (value !== undefined) {
        enabled.value = value
    }
}

onMounted(() => {
    signalK.connect()
    signalK.subscribe({
        path: props.path,
        period: 500
    })
    signalK.addMessageHandler(handleSignalKMessage)
})

onUnmounted(() => {
    signalK.removeMessageHandler(handleSignalKMessage)
    signalK.disconnect()
})
</script>

<template>
    <ErrorHandler :fallback="(err) => `Error: ${err.message}`">
        <div class="toggle-switch">
            <span :class="['metal', 'radial', enabled ? 'on' : '']" @click="handleToggle">
                <span :style="{ color: enabled ? 'green' : 'red' }">&nbsp;</span>
            </span>
            <div>{{ name }}</div>
            <div v-if="error" class="error-message">
                {{ error.message }}
            </div>
        </div>
    </ErrorHandler>
</template>

<style lang="scss" scoped>
.toggle-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    font-size: 18px;
    color: #fff;
    padding: 4px;

    .error-message {
        color: red;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    }

    .switchBtn {
        border-radius: 4px;
        height: 70px;
        width: 70px;
        background: rgb(161, 161, 161);
        background: radial-gradient(circle,
                rgba(161, 161, 161, 1) 0%,
                rgba(187, 187, 187, 1) 45%,
                rgba(0, 212, 255, 1) 45%,
                rgba(0, 212, 255, 1) 55%,
                rgb(176, 176, 176) 55%,
                rgb(176, 176, 176) 60%,
                rgb(205, 205, 205) 65%,
                rgba(42, 42, 42, 0.25) 70%,
                rgba(42, 42, 42, 0) 70%);

        -webkit-transition: background 1s ease;
        -moz-transition: background 1s ease;
        -o-transition: background 1s ease;
        transition: background 1s ease;

        &.on {
            background: rgb(161, 161, 161);
            background: radial-gradient(circle,
                    rgba(161, 161, 161, 1) 0%,
                    rgba(187, 187, 187, 1) 45%,
                    rgb(0, 255, 42) 45%,
                    rgb(0, 255, 145) 55%,
                    rgb(176, 176, 176) 55%,
                    rgb(176, 176, 176) 60%,
                    rgb(205, 205, 205) 65%,
                    rgba(42, 42, 42, 0.25) 70%,
                    rgba(42, 42, 42, 0) 70%);

            transition: background 3s ease;
        }
    }

    &.enabled {
        // @extend .btn-success;

    }
}

.enabled {
    background-color: #4CAF50;
    border-right: 10px solid #4CAF50;
}


/* Metal ------------------------- */

.metal {
    position: relative;
    margin: 5px auto;
    outline: none;

    font: bold 6em/2em "Helvetica Neue", Arial, Helvetica, Geneva, sans-serif;
    text-align: center;
    color: hsla(0, 0%, 20%, 1);
    text-shadow: hsla(0, 0%, 40%, .5) 0 -1px 0, hsla(0, 0%, 100%, .6) 0 2px 1px;

    background-color: hsl(0, 0%, 90%);
    box-shadow: inset hsla(0, 0%, 15%, 1) 0 0px 0px 4px,
        /* border */
        inset hsla(0, 0%, 15%, .8) 0 -1px 5px 4px,
        /* soft SD */
        inset hsla(0, 0%, 0%, .25) 0 -1px 0px 7px,
        /* bottom SD */
        inset hsla(0, 0%, 100%, .7) 0 2px 1px 7px,
        /* top HL */

        hsla(0, 0%, 0%, .15) 0 -5px 6px 4px,
        /* outer SD */
        hsla(0, 0%, 100%, .5) 0 0px 6px 4px;
    /* outer HL */

    transition: color .2s;
}



/* Radial ------------------------- */

.radial.metal {
    width: 70px;
    height: 70px;
    line-height: 80px;
    border-radius: 40px;
    background-image: -webkit-radial-gradient(50% 0%, 8% 50%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
        -webkit-radial-gradient(50% 100%, 12% 50%, hsla(0, 0%, 100%, .6) 0%, hsla(0, 0%, 100%, 0) 100%),
        -webkit-radial-gradient(0% 50%, 50% 7%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
        -webkit-radial-gradient(100% 50%, 50% 5%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),

        -webkit-repeating-radial-gradient(50% 50%, 100% 100%, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 3%, hsla(0, 0%, 0%, .1) 3.5%),
        -webkit-repeating-radial-gradient(50% 50%, 100% 100%, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0) 6%, hsla(0, 0%, 100%, .1) 7.5%),
        -webkit-repeating-radial-gradient(50% 50%, 100% 100%, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0) 1.2%, hsla(0, 0%, 100%, .2) 2.2%),

        -webkit-radial-gradient(50% 50%, 200% 50%, hsla(0, 0%, 90%, 1) 5%, hsla(0, 0%, 85%, 1) 30%, hsla(0, 0%, 60%, 1) 100%);
}


.metal.radial:before,
.metal.radial:after {
    content: "";
    top: 0;
    left: 0;
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: inherit;

    /* fake conical gradients */
    background-image: -webkit-radial-gradient(50% 0%, 10% 50%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
        -webkit-radial-gradient(50% 100%, 10% 50%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
        -webkit-radial-gradient(0% 50%, 50% 10%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
        -webkit-radial-gradient(100% 50%, 50% 06%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%);
}

.metal.radial:before {
    transform: rotate(65deg);
}

.metal.radial:after {
    transform: rotate(-65deg);
}

.metal.radial.on {
    box-shadow: inset hsla(137, 100%, 75%, 1) 0 0px 0px 4px,
        /* border */
        inset hsla(0, 0%, 15%, .8) 0 -1px 5px 4px,
        /* soft SD */
        inset hsla(0, 0%, 0%, .25) 0 -1px 0px 7px,
        /* bottom SD */
        inset hsla(0, 0%, 100%, .7) 0 2px 1px 7px,
        /* top HL */

        hsla(0, 0%, 0%, .15) 0 -5px 6px 4px,
        /* outer SD */
        hsla(0, 0%, 100%, .5) 0 0px 6px 4px;
    /* outer HL */
}
</style>