import _ from 'lodash';

const STATUS_DATA_ELEMENT = 'f8JYVWLC7rE';
const REVIEW_DATE_DATA_ELEMENT = 'nodiP54ocf5';
const REMARKS_DATA_ELEMENT = 'FnengvwgsQv';

export default class ActionStatus {

    constructor(event = {event: '', dataValues: []}) {
        const {event: eventId, dataValues} = event;
        this.id = eventId;
        this.status = _.find(dataValues, ['dataElement', STATUS_DATA_ELEMENT])?.value;
        this.remarks = _.find(dataValues, ['dataElement', REMARKS_DATA_ELEMENT])?.value;
        this.reviewDate = _.find(dataValues, ['dataElement', REVIEW_DATE_DATA_ELEMENT])?.value;

        //Bind all methods
        this.toJson = this.toJson.bind(this);
        this.toString = this.toString.bind(this);
    }

    toJson() {
        return {
            id: this.id,
            status: this.status,
            remarks: this.remarks,
            reviewDate: this.reviewDate
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}
