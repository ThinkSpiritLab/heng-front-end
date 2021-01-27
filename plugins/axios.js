export default function ({ $axios }) {
    $axios.onResponse((e) => {
        if (e.config.method !== "get") {
            window.$nuxt.$bvToast.toast(
                e.response ? e.response.data.message : "操作成功",
                {
                    title: "Info",
                    toaster: "b-toaster-bottom-right",
                    variant: "success",
                }
            );
        }
    });

    $axios.onRequestError(() => {
        window.$nuxt.$bvToast.toast("RequestError", {
            title: "RequestError",
            toaster: "b-toaster-bottom-right",
            variant: "danger",
        });
    });

    $axios.onResponseError((e) => {
        window.$nuxt.$bvToast.toast(
            e.response ? e.response.data.message : "未知错误",
            {
                title: e.response.data.error ?? e.response.status,
                toaster: "b-toaster-bottom-right",
                variant: "danger",
            }
        );
        if (e.config.method !== "get") return Promise.resolve(false);
    });
}
