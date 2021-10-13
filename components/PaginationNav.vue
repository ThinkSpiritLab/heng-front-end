<template>
    <b-pagination-nav
        v-if="pages > 1"
        v-model="page"
        :link-gen="linkGen"
        :number-of-pages="pages"
        use-router
        align="center"
    ></b-pagination-nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class extends Vue {
    @Prop({ required: true }) pages!: number;
    page: number | null = null;

    mounted() {
        this.page = parseInt(
            (this.$route.query.page && this.$route.query.page[0]) ?? "1"
        );
    }

    linkGen(pageNum: number) {
        return {
            path: this.$route.fullPath,
            query: {
                page: pageNum - 1 ? pageNum : undefined,
            },
        };
    }
}
</script>
