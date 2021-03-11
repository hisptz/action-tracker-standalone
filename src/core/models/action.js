import _ from 'lodash';
import ActionStatus from "./actionStatus";

const TITLE_DATA_ELEMENT = ''
const DESCRIPTION_DATA_ELEMENT = ''
const START_DATE_DATA_ELEMENT = '';
const END_DATE_DATA_ELEMENT = '';
const RESPONSIBLE_PERSON_DATA_ELEMENT = '';
const DESIGNATION_DATA_ELEMENT = '';

class Action {

    constructor(trackedEntityInstance = {
        trackedEntityInstance: '',
        attributes: [],
        enrollments: [{events: []}]
    }) {
        const {trackedEntityInstance: teiId, attributes, enrollments} = trackedEntityInstance;
        this.id = teiId;
        this.title = _.find(attributes, ['dataElement', TITLE_DATA_ELEMENT]).value;
        this.description = _.find(attributes, ['dataElement', DESCRIPTION_DATA_ELEMENT]).value;
        this.startDate = _.find(attributes, ['dataElement', START_DATE_DATA_ELEMENT]).value;
        this.endDate = _.find(attributes, ['dataElement', END_DATE_DATA_ELEMENT]).value;
        this.responsiblePerson = _.find(attributes, ['dataElement', RESPONSIBLE_PERSON_DATA_ELEMENT]).value;
        this.designation = _.find(attributes, ['dataElement', DESIGNATION_DATA_ELEMENT]).value;
        this.actionStatusList = _.map(enrollments[0].events, (event) => new ActionStatus(event))

        //Bind all methods
        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            responsiblePerson: this.responsiblePerson,
            designation: this.designation
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }

}
