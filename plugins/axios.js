export default function ({ $axios }) {
    $axios.onRequest(() => {
        window.$nuxt.$store.commit("busy/set", true);
    });

    $axios.onResponse((e) => {
        if (e.config.method !== "get") {
            window.$nuxt.$bvToast.toast(
                e.data.message ? e.data.message : "操作成功",
                {
                    title: "Info",
                    toaster: "b-toaster-bottom-right",
                    variant: "success",
                }
            );
        }
        window.$nuxt.$store.commit("busy/set", false);
    });

    $axios.onRequestError(() => {
        window.$nuxt.$bvToast.toast("RequestError", {
            title: "RequestError",
            toaster: "b-toaster-bottom-right",
            variant: "danger",
        });
        window.$nuxt.$store.commit("busy/set", false);
    });

    $axios.onResponseError((e) => {
        window.$nuxt.$bvToast.toast(
            e.response && e.response.data && e.response.data.message
                ? e.response.data.message
                : "未知错误",
            {
                title: e.response.data.error ?? e.response.status,
                toaster: "b-toaster-bottom-right",
                variant: "danger",
            }
        );
        window.$nuxt.$store.commit("busy/set", false);
        if (e.config.method !== "get") return Promise.resolve(false);
    });
}
