import _ from "lodash";
import PossibleSolution from "./possibleSolution";


const TITLE_DATA_ELEMENT = 'JbMaVyglSit';
const DESCRIPTION_DATA_ELEMENT = 'GsbZkewUna5';
const METHOD_DATA_ELEMENT = 'W50aguV39tU';
const SOLUTION_LINK_DATA_ELEMENT = 'kBkyDytdOmC';

export default class Gap {

    constructor(event = {event: '', dataValues: []}, possibleSolutionEvents = []) {
        const {event: eventId,dataValues} = event;
        this.id = eventId;
        this.title = _.find(dataValues, ['dataElement', TITLE_DATA_ELEMENT])?.value;
        this.description = _.find(dataValues, ['dataElement', DESCRIPTION_DATA_ELEMENT])?.value;
        this.method = _.find(dataValues, ['dataElement', METHOD_DATA_ELEMENT])?.value;
        this.solutionLinkage = _.find(dataValues, ['dataElement', SOLUTION_LINK_DATA_ELEMENT])?.value;
        this.possibleSolutions = _.map(possibleSolutionEvents, (solution) => new PossibleSolution(solution));

        this.toString = this.toString.bind(this);
        this.toJson = this.toJson.bind(this);

    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            method: this.method,
            possibleSolutions: this.possibleSolutions
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }

}
