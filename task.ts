import crypto, { randomBytes } from "crypto";
import axios, { AxiosResponse } from "axios";

setInterval(() => {
    const r: { taskId: string; wsId: string }[] = [];
    axios
        .get("http://127.0.0.1:8080/v1/judger/alltoken")
        .then((e: AxiosResponse) => {
            for (const wsId of e.data.online) {
                r.push({
                    taskId: crypto.randomBytes(4).toString("hex"),
                    wsId,
                });
            }
            axios.post("http://127.0.0.1:8080/v1/judger/task", {
                body: Array.from(r),
            });
        });
}, 50);
