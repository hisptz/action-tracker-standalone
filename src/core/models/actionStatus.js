import _ from 'lodash';

const STATUS_DATA_ELEMENT = '';
const REVIEW_DATE_DATA_ELEMENT = '';
const REMARKS_DATA_ELEMENT = '';

export default class ActionStatus {

    constructor(event = {event: '', dataElements: []}) {
        const {event:eventId, dataElements} = event;
        this.id = eventId;
        this.status = _.find(dataElements, ['dataElement', STATUS_DATA_ELEMENT])?.value;
        this.remarks = _.find(dataElements, ['dataElement', REMARKS_DATA_ELEMENT])?.value;
        this.reviewDate = _.find(dataElements, ['dataElement', REVIEW_DATE_DATA_ELEMENT])?.value;

        //Bind all methods
        this.toJson = this.toJson.bind(this);
        this.toString = this.toString.bind(this);
    }

    toJson(){
        return{
            id: this.id,
            status: this.status,
            remarks: this.remarks,
            reviewDate: this.reviewDate
        }
    }

    toString(){
        return JSON.stringify(this.toJson());
    }

}
