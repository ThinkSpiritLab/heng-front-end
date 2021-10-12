<template>
    <b-progress :max="item.info.maxTaskCount" show-value>
        <b-progress-bar
            :value="item.report.judge.pending"
            variant="info"
        ></b-progress-bar>
        <b-progress-bar
            :value="item.report.judge.preparing.compiling"
            variant="warning"
            animated
        ></b-progress-bar>
        <b-progress-bar
            :value="item.report.judge.judging"
            variant="primary"
            animated
        ></b-progress-bar>
    </b-progress>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class extends Vue {
    @Prop({ required: true }) item;
}
</script>
