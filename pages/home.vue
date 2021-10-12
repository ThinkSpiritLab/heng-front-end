<template>
    <div>
        <b-row>
            <b-col class="mx-auto" md="6">
                <b-card style="margin: auto">
                    <b-card-body>
                        <b-form class="text-center">
                            <b-form-group>
                                <b-form-radio-group
                                    v-model="loadChoice"
                                    :options="loadOption"
                                >
                                </b-form-radio-group>
                            </b-form-group>
                        </b-form>
                        <b-form
                            v-if="loadChoice === 0"
                            class="text-center"
                            @submit.prevent="load"
                        >
                            <b-form-group label="AccessKey">
                                <b-input
                                    v-model="ak"
                                    required
                                    :state="state"
                                ></b-input>
                            </b-form-group>
                            <b-form-group label="SecretKey">
                                <b-input
                                    v-model="sk"
                                    type="password"
                                    required
                                    :state="state"
                                ></b-input>
                            </b-form-group>
                            <b-form-group label="Prefix">
                                <b-input
                                    v-model="prefix"
                                    required
                                    :state="state"
                                ></b-input>
                            </b-form-group>
                            <b-form-group>
                                <b-button type="submit" variant="primary"
                                    >导入<span v-if="state"
                                        >成功</span
                                    ></b-button
                                >
                                <b-button
                                    v-if="state"
                                    variant="primary"
                                    @click="fileDownload"
                                    >导出到文件</b-button
                                >
                                <b-button type="reset">重置</b-button>
                                <b-button variant="success" @click="logout"
                                    >注销</b-button
                                >
                            </b-form-group>
                        </b-form>
                        <b-form
                            v-else
                            class="text-center"
                            @submit.prevent="fileLoad"
                        >
                            <b-form-group>
                                <b-form-file
                                    v-model="file"
                                    placeholder="Choose a file or drop it here..."
                                    drop-placeholder="Drop file here..."
                                    accept=".json"
                                    required
                                ></b-form-file>
                            </b-form-group>
                            <b-form-group>
                                <b-button type="submit" variant="primary"
                                    >导入</b-button
                                >
                                <b-button type="reset">重置</b-button>
                                <b-button variant="success" @click="logout"
                                    >注销</b-button
                                >
                            </b-form-group>
                        </b-form>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import "@nuxtjs/axios";

@Component({
    layout: "front",
})
export default class extends Vue {
    loadChoice = 1;
    ak = null;
    sk = null;
    prefix = null;
    file = null;
    state = null;
    loadOption = [
        { text: "直接输入", value: 0 },
        { text: "文件导入", value: 1 },
    ];

    load() {
        sessionStorage.setItem(
            "auth",
            JSON.stringify({
                ak: this.ak,
                sk: this.sk,
                prefix: this.prefix,
            })
        );
        this.state = true;
    }

    logout() {
        sessionStorage.removeItem("auth");
        window.history.go(0);
    }

    async fileLoad() {
        const data = JSON.parse(
            await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
                reader.readAsText(this.file);
            })
        );
        this.ak = data.ak ?? "";
        this.sk = data.sk ?? "";
        this.prefix = data.prefix ?? "";
        this.loadChoice = 0;
        this.load();
        window.location.replace("../judger/");
    }

    fileDownload() {
        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," +
                encodeURIComponent(
                    JSON.stringify({
                        ak: this.ak,
                        sk: this.sk,
                        prefix: this.prefix,
                    })
                )
        );
        element.setAttribute("download", "auth.json");

        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
</script>

<style></style>
