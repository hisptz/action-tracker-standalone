import * as _ from "lodash";
import Bottleneck from "./bottleneck";


export default class ActionTrackerData {
    constructor(indicatorsTrackedEntityInstances = [{}]) {
        this.indicators = _.map(indicatorsTrackedEntityInstances, (indicator) => new Bottleneck(indicator));
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
    }

    setIndicatorTrackedEntityInstances(indicatorsTrackedEntityInstances = [{}]) {
        this.indicators = _.map(indicatorsTrackedEntityInstances, (indicator) => new Bottleneck(indicator));
    }

    toJson() {
        return {indicators: this.indicators}
    }

    toString() {
        return this.toJson();
    }

}
