<template>
    <b-container>
        <b-button class="my-2" variant="primary" @click="$router.go(0)">
            Fresh
        </b-button>
        <b-card no-body>
            <b-tabs pills card>
                <b-tab title="Online" active>
                    <b-table
                        striped
                        hover
                        :items="online"
                        :fields="onlineFiled"
                        responsive="md"
                    >
                        <template #cell(token)="data">
                            <b-link :id="`popover-online-${data.item.token}`">
                                {{ data.item.token }}
                            </b-link>
                            <b-popover
                                :target="`popover-online-${data.item.token}`"
                                title="Log"
                                triggers="hover"
                                @show="getJudgerLog(data)"
                            >
                                <b-list-group>
                                    <b-list-group-item
                                        v-for="log in data.item.log"
                                        :key="log"
                                    >
                                        {{ log }}
                                    </b-list-group-item>
                                </b-list-group>
                            </b-popover>
                        </template>
                        <template #cell(dist)="data">
                            <b-button
                                variant="primary"
                                @click.prevent="distTask(data)"
                            >
                                分配任务
                            </b-button>
                        </template>
                        <template #cell(exit)="data">
                            <b-button
                                variant="primary"
                                @click.prevent="exit(data)"
                            >
                                退出
                            </b-button>
                        </template>
                        <template #cell(close)="data">
                            <b-button
                                variant="primary"
                                @click.prevent="close(data)"
                            >
                                强制断开
                            </b-button>
                        </template>
                    </b-table>
                </b-tab>
                <b-tab title="Disabled">
                    <b-table
                        striped
                        hover
                        :items="disabled"
                        :fields="onlineFiled"
                    >
                        <template #cell(token)="data">
                            <b-link :id="`popover-disabled-${data.item.token}`">
                                {{ data.item.token }}
                            </b-link>
                            <b-popover
                                :target="`popover-disabled-${data.item.token}`"
                                title="Log"
                                triggers="hover"
                                @show="getJudgerLog(data)"
                            >
                                <b-list-group>
                                    <b-list-group-item
                                        v-for="log in data.item.log"
                                        :key="log"
                                    >
                                        {{ log }}
                                    </b-list-group-item>
                                </b-list-group>
                            </b-popover>
                        </template>
                        <template #cell(dist)="data">
                            <b-button
                                variant="primary"
                                @click.prevent="distTask(data)"
                            >
                                分配任务
                            </b-button>
                        </template>
                        <template #cell(exit)="data">
                            <b-button
                                variant="primary"
                                @click.prevent="exit(data)"
                            >
                                退出
                            </b-button>
                        </template>
                        <template #cell(close)="data">
                            <b-button
                                variant="primary"
                                @click.prevent="close(data)"
                            >
                                强制断开
                            </b-button>
                        </template>
                    </b-table>
                </b-tab>
                <b-tab title="Closed">
                    <b-table
                        striped
                        hover
                        :items="closed"
                        :fields="closedField"
                    >
                        <template #cell(token)="data">
                            <b-link :id="`popover-closed-${data.item.token}`">
                                {{ data.item.token }}
                            </b-link>
                            <b-popover
                                :target="`popover-closed-${data.item.token}`"
                                title="Log"
                                triggers="hover"
                                @show="getJudgerLog(data)"
                            >
                                <b-list-group>
                                    <b-list-group-item
                                        v-for="log in data.item.log"
                                        :key="log"
                                    >
                                        {{ log }}
                                    </b-list-group-item>
                                </b-list-group>
                            </b-popover>
                        </template>
                    </b-table>
                </b-tab>
            </b-tabs>
        </b-card>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "@nuxtjs/axios";
@Component({
    layout: "front",
    watchQuery: ["page"],
    async asyncData({ $axios }) {
        const ret = await $axios.$get("/judger/alltoken");
        for (const status in ret) {
            ret[status] = ret[status].map((token: any) => {
                return { token, log: [] };
            });
        }
        return ret;
    },
})
export default class extends Vue {
    onlineFiled = [
        "token",
        {
            key: "dist",
            label: "Distribute Task",
        },
        {
            key: "exit",
            label: "Exit",
        },
        {
            key: "close",
            label: "Close",
        },
    ];

    closedField = ["token"];

    allLog: { [key: string]: string[] } = {};

    distTask(data: any) {
        this.$axios.$post(
            `/judger/task/${data.item.token}/${Math.random()
                .toString(35)
                .slice(2)}`
        );
    }

    exit(data: any) {
        this.$axios.$post(`/judger/exit/${data.item.token}`);
    }

    close(data: any) {
        this.$axios.$post(`/judger/close/${data.item.token}`);
    }

    async getJudgerLog(data: any) {
        if (data.item.log.length === 0) {
            data.item.log = await this.$axios.$get(
                `/judger/log/${data.item.token}`
            );
        }
    }
}
</script>

<style></style>
