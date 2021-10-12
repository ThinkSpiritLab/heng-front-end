export const state = () => ({
    loading: false,
});
export const mutations = {
    set(st: any, loading: boolean) {
        st.loading = loading;
    },
};
