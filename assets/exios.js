import * as crypto from "crypto";
import { Sign } from "heng-sign-js";
import "@nuxtjs/axios";

const encrypt = {
    SHA256(data) {
        return crypto.createHash("sha256").update(data).digest("hex");
    },
    HmacSHA256(key, data) {
        return crypto.createHmac("sha256", key).update(data).digest("hex");
    },
};

const sign = new Sign(encrypt);

export function exios(config) {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    if (!auth) {
        window.location.replace("../home/");
        return;
    }
    const ak = auth.ak ?? "";
    const sk = auth.sk ?? "";
    const prefix = auth.prefix ?? "";
    if (typeof config.url === "string") {
        config.url = config.url.replace(/^\/+/g, "");
        config.url = prefix + config.url;
    }
    const sConfig = {
        ...config,
        ak,
        sk,
    };
    const req = sign.sign(sConfig);
    return window.$nuxt.$axios.$request(req);
}
