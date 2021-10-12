import * as crypto from "crypto";
import { Sign } from "heng-sign-js";
import "@nuxtjs/axios";

function encrypt(param) {
    if (param.algorithm === "SHA256") {
        return crypto.createHash("sha256").update(param.data).digest("hex");
    } else if (param.algorithm === "HmacSHA256") {
        if (!param.key) {
            throw new Error("no key provided");
        }
        return crypto
            .createHmac("sha256", param.key)
            .update(param.data)
            .digest("hex");
    }
    return "";
}
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
