import _ from 'lodash';
import Indicator from "./indicator";


export default class ActionTrackerData {
    constructor(indicatorsTrackedEntityInstances = [{}]) {
        this.indicators = _.map(indicatorsTrackedEntityInstances, (indicator) => new Indicator(indicator));
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
    }

    setIndicatorTrackedEntityInstances(indicatorsTrackedEntityInstances = [{}]) {
        this.indicators = _.map(indicatorsTrackedEntityInstances, (indicator) => new Indicator(indicator));
    }

    toJson() {
        return {indicators: this.indicators}
    }

    toString() {
        return this.toJson();
    }

}
