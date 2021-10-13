<template>
    <b-container fluid="md">
        <b-nav id="admin-navbar" tabs fill align="center">
            <b-nav-item to="../home/" active-class="active">Home</b-nav-item>
            <b-nav-item to="../judger/" active-class="active"
                >Judger</b-nav-item
            >
            <b-nav-item to="../key/" active-class="active">Key</b-nav-item>
            <b-nav-item to="../log/" active-class="active">Log</b-nav-item>
            <b-nav-item @click="$router.go(0)">Fresh</b-nav-item>
            <b-nav-item @click="logout">Logout</b-nav-item>
        </b-nav>
        <div class="w-100"></div>
        <b-row class="m-2">
            <b-col cols="12">
                <nuxt />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component({
    head: {
        title: "Admin",
    },
})
export default class extends Vue {
    logout() {
        sessionStorage.removeItem("auth");
        window.history.go(0);
    }
}
</script>
