import _ from 'lodash';
import ActionStatus from "./actionStatus";

const TITLE_DATA_ELEMENT = 'HQxzVwKedKu'
const DESCRIPTION_DATA_ELEMENT = 'GlvCtGIytIz'
const START_DATE_DATA_ELEMENT = 'jFjnkx49Lg3';
const END_DATE_DATA_ELEMENT = 'BYCbHJ46BOr';
const RESPONSIBLE_PERSON_DATA_ELEMENT = 'G3aWsZW2MpV';
const DESIGNATION_DATA_ELEMENT = 'Ax6bWbKn46e';
const ACTION_TO_SOLUTION_LINKAGE = 'Hi3IjyMXzeW';
const STATUS_DATA_ELEMENT = 'f8JYVWLC7rE';


export default class Action {

    constructor(trackedEntityInstance = {
        trackedEntityInstance: '',
        attributes: [],
        enrollments: [{events: []}]
    }) {
        const {trackedEntityInstance: teiId, attributes, enrollments} = trackedEntityInstance;
        this.id = teiId;
        this.title = _.find(attributes, ['attribute', TITLE_DATA_ELEMENT])?.value;
        this.description = _.find(attributes, ['attribute', DESCRIPTION_DATA_ELEMENT])?.value;
        this.startDate = _.find(attributes, ['attribute', START_DATE_DATA_ELEMENT])?.value;
        this.endDate = _.find(attributes, ['attribute', END_DATE_DATA_ELEMENT])?.value;
        this.responsiblePerson = _.find(attributes, ['attribute', RESPONSIBLE_PERSON_DATA_ELEMENT])?.value;
        this.designation = _.find(attributes, ['attribute', DESIGNATION_DATA_ELEMENT])?.value;
        this.actionToSolutionLinkage = _.find(attributes, ['attribute', ACTION_TO_SOLUTION_LINKAGE])?.value;
        this.actionStatusList = _.map(enrollments[0].events, (event) => new ActionStatus(event));
        this.latestStatus = this.getLatestStatus(enrollments[0].events);

        //Bind all methods
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
        this.getLatestStatus = this.getLatestStatus.bind(this)
    }

    getLatestStatus(events){
        return _.find(_.reverse(_.sortBy(events, ['eventDate']))[0]?.dataValues, ['dataElement', STATUS_DATA_ELEMENT])?.value
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            responsiblePerson: this.responsiblePerson,
            designation: this.designation,
            actionToStatusLinkage: this.actionToSolutionLinkage
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }

}
