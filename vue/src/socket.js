import Vue from "vue"

const socket = new WebSocket("ws://localhost:8085/ongoing")

const emitter = new Vue({
    data() {
        return {
            parsed: []
        }
    },
    methods: {
        send(message) {
            if (1 === socket.readyState)
                socket.send(message)
        }
    }
})

socket.onmessage = function (msg) {
    this.parsed = JSON.parse(msg.data)
    //emitter.$emit("message", msg.data)
    emitter.$emit("message", this.parsed)
}
socket.onerror = function (err) {
    emitter.$emit("error", err)
}


export default emitter