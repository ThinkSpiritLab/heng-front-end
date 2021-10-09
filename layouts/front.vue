<template>
    <div>
        <nuxt />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "@nuxtjs/axios";

@Component({
    head: {
        title: "Admin",
    },
})
export default class extends Vue {}
</script>
