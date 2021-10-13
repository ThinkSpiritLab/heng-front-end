<template>
    <div></div>
</template>
<script>
import { Component, Vue } from "vue-property-decorator";

@Component({
    layout: "front",
    asyncData({ redirect }) {
        redirect(200, "home");
    },
})
export default class extends Vue {}
</script>
