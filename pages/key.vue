<template>
    <div>
        <b-form-group>
            <b-button v-b-modal="'modal-new-key'" variant="primary"
                >新增</b-button
            >
        </b-form-group>
        <b-modal
            id="modal-new-key"
            title="New Key"
            size="lg"
            scrollable
            hide-footer
        >
            <b-form @submit.prevent="newKey">
                <b-form-group label="Remark">
                    <b-input v-model="modalRemark" required></b-input>
                </b-form-group>
                <b-form-group label="Role">
                    <b-form-select
                        v-model="modalRole"
                        :options="roleOption"
                        required
                    >
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Quantity">
                    <b-input
                        v-model="modalQuantity"
                        type="number"
                        number
                        min="1"
                        max="10"
                        step="1"
                        required
                    >
                    </b-input>
                </b-form-group>
                <b-button
                    type="submit"
                    :disabled="$store.state.busy.loading"
                    variant="primary"
                    >提交</b-button
                >
            </b-form>
            <pre v-if="modalNewKeys">{{ modalNewKeys }}</pre>
        </b-modal>
        <b-form-group>
            <b-form-radio-group v-model="keyFilterChoice" :options="roleOption">
                <b-form-radio value="">ALL</b-form-radio>
            </b-form-radio-group>
        </b-form-group>
        <b-table
            hover
            :items="keys"
            :fields="keyField"
            responsive="md"
            primary-key="ak"
            :filter="keyFilterChoice"
            :filter-included-fields="['role']"
        >
            <template #cell(createTime)="data">{{
                data.item.createTimeString
            }}</template>
            <template #cell(sk)="data"
                ><span v-if="data.item.show">{{ data.item.sk }}</span
                ><span v-else>{{ data.item.sk.slice(0, 6) }}******</span
                ><b-link
                    @click="
                        (data.item.show = !data.item.show),
                            setTimeout(() => {
                                data.item.show = false;
                            }, 3000)
                    "
                    >👀</b-link
                ></template
            >
            <template #cell(delete)="data"
                ><b-button
                    variant="danger"
                    :disabled="$store.state.busy.loading"
                    @click="deleteKey(data.item)"
                    >删除</b-button
                ></template
            >
        </b-table>
    </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import "@nuxtjs/axios";
import { exios } from "~/assets/exios";

@Component({
    layout: "front",
    async asyncData() {
        return {
            keys: (
                await exios({
                    method: "post",
                    url: `/key/find`,
                })
            ).map((key) => {
                key.show = false;
                key.createTimeString = key.createTime;
                key.createTime = Date.parse(key.createTime);
                return key;
            }),
            roleOption: (
                await exios({
                    method: "get",
                    url: `/key/allRoleType`,
                })
            ).map((role) => {
                return {
                    text: role.toUpperCase(),
                    value: role,
                };
            }),
        };
    },
})
export default class extends Vue {
    keyFilterChoice = "";
    modalRemark = null;
    modalRole = null;
    modalQuantity = 1;
    modalNewKeys = null;
    keyField = [
        {
            key: "remark",
            sortable: true,
        },
        {
            key: "ak",
            label: "AccessKey",
        },
        {
            key: "sk",
            label: "SecretKey",
        },
        {
            key: "role",
            sortable: true,
        },
        {
            key: "createTime",
            sortable: true,
        },
        {
            key: "delete",
        },
    ];

    async newKey() {
        const ret = await exios({
            method: "post",
            url: `/key/genAdd`,
            data: {
                role: this.modalRole,
                remark: this.modalRemark,
                quantity: this.modalQuantity,
            },
        });
        this.modalNewKeys = JSON.stringify(ret, undefined, "    ");
    }

    deleteKey(item) {
        this.$bvModal
            .msgBoxConfirm(
                `Are you sure to delete this key? Key's role: ${item.role}`,
                {
                    title: "Please Confirm",
                    okVariant: "danger",
                    okTitle: "YES",
                    cancelTitle: "NO",
                    centered: true,
                }
            )
            .then((value) => {
                if (!value) return;
                exios({
                    method: "post",
                    url: `/key/del`,
                    data: { ak: item.ak },
                });
            });
    }

    setTimeout(...args) {
        window.setTimeout(...args);
    }
}
</script>

<style></style>
