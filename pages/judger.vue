<template>
    <div v-if="controller && judgers">
        <b-row v-if="controller" class="my-2">
            <b-col md="6">
                <label
                    >控制端负载：<b-badge>{{
                        controller.hardware.cpu.loadavg[0]
                    }}</b-badge>
                    <b-badge>{{ controller.hardware.cpu.loadavg[1] }}</b-badge>
                    <b-badge>{{
                        controller.hardware.cpu.loadavg[2]
                    }}</b-badge></label
                >
                <b-progress
                    show-progress
                    :max="1"
                    :value="controller.hardware.cpu.percentage"
                ></b-progress>
                <label>控制端内存：</label>
                <b-progress
                    show-progress
                    :max="1"
                    :value="controller.hardware.memory.percentage"
                ></b-progress>
            </b-col>
            <b-col md="6">
                <label>任务队列（Pending/Solving）：</label>
                <b-progress show-value :max="controller.task.inDb">
                    <b-progress-bar
                        :value="controller.task.inQueue"
                        variant="info"
                    ></b-progress-bar>
                    <b-progress-bar
                        :value="controller.task.inDb - controller.task.inQueue"
                        variant="primary"
                        animated
                    ></b-progress-bar>
                </b-progress>
                <label>结果返回队列：{{ controller.task.cbQueue }}</label>
            </b-col>
        </b-row>
        <b-form-group>
            <b-form-radio-group v-model="tokenFilterChoice">
                <b-form-radio value="">ALL</b-form-radio>
                <b-form-radio value="online">ONLINE</b-form-radio>
                <b-form-radio value="disabled">DISABLED</b-form-radio>
                <b-form-radio value="closed">CLOSED</b-form-radio>
                <b-form-radio value="unused">UNUSED</b-form-radio>
            </b-form-radio-group>
        </b-form-group>
        <b-table
            hover
            :items="judgers"
            :fields="tableField"
            responsive="md"
            primary-key="wsId"
            :filter="tokenFilterChoice"
            :filter-included-fields="['status']"
        >
            <template #cell(name)="data"
                ><b-link
                    v-b-modal="'modal-judger-info'"
                    @click="modalWsId = data.item.wsId"
                    >{{
                        data.item.info.name || data.item.wsId.split(".")[0]
                    }}</b-link
                ></template
            >
            <template #cell(software)="data">{{
                data.item.info.software || ""
            }}</template>
            <template #cell(createTime)="data">{{
                data.item.info.createTime
            }}</template>
            <template #cell(cpu)="data">
                <b-col
                    v-if="
                        ['online', 'disabled'].includes(data.item.status) &&
                        data.item.report !== undefined
                    "
                    style="width: 20rem"
                >
                    <b-progress
                        :max="1"
                        :value="data.item.report.hardware.cpu.percentage"
                        show-progress
                    ></b-progress>
                </b-col>
                <b-col v-else>{{ data.item.status }}</b-col>
            </template>
            <template #cell(judge)="data">
                <b-col
                    v-if="
                        ['online', 'disabled'].includes(data.item.status) &&
                        data.item.report !== undefined
                    "
                    style="width: 20rem"
                >
                    <task-progress :item="data.item" />
                </b-col>
                <b-col v-else>{{ data.item.status }}</b-col>
            </template>
        </b-table>
        <b-modal
            id="modal-judger-info"
            title="Info"
            size="lg"
            scrollable
            hide-footer
            @show="startModalRefresh"
            @hide="stopModalRefresh"
        >
            <div v-if="modalJudgerItem">
                <div>
                    <div>
                        <label
                            >{{ modalJudgerItem.info.name || "No Name" }}
                            <b-badge
                                v-if="modalJudgerItem.status === 'online'"
                                variant="success"
                                >{{ modalJudgerItem.status }}</b-badge
                            >
                            <b-badge v-else variant="danger">{{
                                modalJudgerItem.status
                            }}</b-badge>
                        </label>
                    </div>
                    <div>
                        <label
                            >软件版本：<b-badge variant="primary">{{
                                modalJudgerItem.info.software
                            }}</b-badge></label
                        >
                    </div>
                    <div>
                        <label
                            >上线时间：{{
                                modalJudgerItem.info.createTime
                            }}</label
                        >
                    </div>
                    <div>
                        <label
                            >可承载任务数：<b-badge variant="primary"></b-badge
                            >{{ modalJudgerItem.info.maxTaskCount }}</label
                        >
                    </div>
                </div>
                <div v-if="modalJudgerItem.report">
                    <div>
                        <label>
                            <b-badge>CPU</b-badge>
                            <b-badge>{{
                                modalJudgerItem.report.hardware.cpu.loadavg[0]
                            }}</b-badge>
                            <b-badge>{{
                                modalJudgerItem.report.hardware.cpu.loadavg[1]
                            }}</b-badge>
                            <b-badge>{{
                                modalJudgerItem.report.hardware.cpu.loadavg[2]
                            }}</b-badge>
                        </label>
                        <b-progress
                            :value="
                                modalJudgerItem.report.hardware.cpu.percentage
                            "
                            :max="1"
                            show-progress
                            class="my-1"
                        ></b-progress>
                    </div>
                    <div>
                        <label>
                            <b-badge>Memory</b-badge>
                        </label>
                        <b-progress
                            :value="
                                modalJudgerItem.report.hardware.memory
                                    .percentage
                            "
                            :max="1"
                            show-progress
                            class="my-1"
                        ></b-progress>
                    </div>
                    <div>
                        <label>
                            <b-badge>Judge</b-badge>
                        </label>
                        <task-progress :item="modalJudgerItem" />
                    </div>
                    <div>
                        <label
                            >任务（finished/total）：{{
                                modalJudgerItem.report.judge.finished
                            }}/{{ modalJudgerItem.report.judge.total }}</label
                        >
                    </div>
                </div>
                <div>
                    <b-button
                        v-b-toggle.collapse-details
                        variant="primary"
                        class="mb-2"
                        >Details</b-button
                    >
                    <b-button
                        v-if="modalJudgerItem.status === 'online'"
                        variant="danger"
                        class="mb-2"
                        :disabled="$store.state.busy.loading"
                        @click="exit"
                        >Exit</b-button
                    >
                    <b-button
                        v-if="
                            ['online', 'disabled'].includes(
                                modalJudgerItem.status
                            )
                        "
                        variant="danger"
                        class="mb-2"
                        :disabled="$store.state.busy.loading"
                        @click="close"
                        >Close</b-button
                    >
                    <b-collapse id="collapse-details" class="mt-2">
                        <b-card no-body>
                            <pre>{{
                                JSON.stringify(
                                    modalJudgerItem,
                                    undefined,
                                    "    "
                                )
                            }}</pre>
                        </b-card>
                    </b-collapse>
                </div>
                <b-list-group v-if="modalJudgerItem.log.length">
                    <b-list-group-item
                        v-for="log in modalJudgerItem.log"
                        :key="log"
                        >{{ log }}</b-list-group-item
                    >
                </b-list-group>
                <p v-else>No Log</p>
            </div>
            <loading v-else />
        </b-modal>
    </div>
    <loading v-else />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import "@nuxtjs/axios";
import { exios } from "~/assets/exios";
import Loading from "~/components/Loading.vue";
import TaskProgress from "~/components/TaskProgress.vue";

@Component({
    components: { Loading, TaskProgress },
    layout: "front",
})
export default class extends Vue {
    controller = null;
    judgers = null;
    modalWsId = null;
    mainTimer = null;
    modalTimer = null;
    modalJudgerItem = null;
    tokenFilterChoice = "";
    tableField = [
        {
            key: "name",
            label: "Name",
            sortable: true,
        },
        {
            key: "software",
            label: "Software",
            sortable: true,
        },
        {
            key: "createTime",
            label: "CreateTime",
            sortable: true,
        },
        {
            key: "cpu",
            label: "CPU",
            sortable: true,
        },
        {
            key: "judge",
            label: "Judge",
        },
    ];

    mounted() {
        const fn = async () => {
            const ret = await exios({
                method: "GET",
                url: "/judger/systemStatus",
            });

            this.controller = ret.controller;
            this.judgers = ret.judgers.map((item) => {
                item.cpu = ["online", "disabled"].includes(item.status)
                    ? item.report.hardware.cpu.percentage
                    : 0;
                item.createTime = Date.parse(item.info.createTime);
                return item;
            });
        };
        fn();
        this.mainTimer = setInterval(fn, 3000);
    }

    beforeDestroy() {
        clearInterval(this.mainTimer);
        clearInterval(this.modalTimer);
    }

    startModalRefresh() {
        this.stopModalRefresh();
        const fn = async () => {
            this.modalJudgerItem = await exios({
                method: "GET",
                url: `/judger/${this.modalWsId}/info`,
            });
            this.modalJudgerItem.wsId = this.modalWsId;
        };
        fn();
        this.modalTimer = setInterval(fn, 3000);
    }

    stopModalRefresh() {
        clearInterval(this.modalTimer);
        this.modalJudgerItem = undefined;
    }

    exit() {
        this.$bvModal
            .msgBoxConfirm(`Are you sure to exit this judger?`, {
                title: "Please Confirm",
                okVariant: "danger",
                okTitle: "YES",
                cancelTitle: "NO",
                centered: true,
            })
            .then((value) => {
                if (!value) return;
                exios({
                    method: "post",
                    url: `/judger/${this.modalWsId}/exit`,
                });
            });
    }

    close() {
        this.$bvModal
            .msgBoxConfirm(`Are you sure to disconnect this judger?`, {
                title: "Please Confirm",
                okVariant: "danger",
                okTitle: "YES",
                cancelTitle: "NO",
                centered: true,
            })
            .then((value) => {
                if (!value) return;
                exios({
                    method: "post",
                    url: `/judger/${this.modalWsId}/close`,
                });
            });
    }
}
</script>

<style></style>
