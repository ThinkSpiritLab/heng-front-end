<template>
    <div>
        <b-table hover :items="logs" :fields="logField" responsive="md">
            <template #cell(payload)="data">
                <b-button
                    v-b-modal="'modal-log-detail'"
                    variant="primary"
                    @click="modalPayload = data.item.payload"
                    >Detail</b-button
                >
            </template>
        </b-table>
        <b-modal
            id="modal-log-detail"
            title="Detail"
            size="lg"
            scrollable
            hide-footer
        >
            <pre>{{ modalPayloadFormatted }}</pre>
        </b-modal>
        <pagination-nav :pages="100" />
    </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import "@nuxtjs/axios";
import { exios } from "~/assets/exios";
import paginationNav from "~/components/PaginationNav.vue";

@Component({
    components: { paginationNav },
    layout: "front",
    watchQuery: ["page"],
    async asyncData({ route }) {
        return {
            logs: await exios({
                method: "get",
                url: "/key/log",
                params: { page: route.query.page ?? 1 },
            }),
        };
    },
})
export default class extends Vue {
    modalPayload = "{}";
    logField = [
        {
            key: "entry",
        },
        {
            key: "createTime",
            sortable: true,
        },
        {
            key: "payload",
        },
    ];

    get modalPayloadFormatted() {
        return JSON.stringify(JSON.parse(this.modalPayload), undefined, "    ");
    }
}
</script>

<style></style>
