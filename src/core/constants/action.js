export default class ActionConstants {
    static PROGRAM_ID = 'unD7wro3qPm';
    static ACTION_TRACKED_ENTITY_TYPE = 'TFYpX5EXmYp'
    static TITLE_ATTRIBUTE = 'HQxzVwKedKu'
    static DESCRIPTION_ATTRIBUTE = 'GlvCtGIytIz'
    static START_DATE_ATTRIBUTE = 'jFjnkx49Lg3';
    static END_DATE_ATTRIBUTE = 'BYCbHJ46BOr';
    static RESPONSIBLE_PERSON_ATTRIBUTE = 'G3aWsZW2MpV';
    static DESIGNATION_ATTRIBUTE = 'Ax6bWbKn46e';
    static ACTION_TO_SOLUTION_LINKAGE = 'Hi3IjyMXzeW';
    static STATUS_ATTRIBUTE = 'f8JYVWLC7rE';
    static BOTTLENECK_ACTION_RELATIONSHIP_TYPE = 'XTJrr4c45G7';
    static ACTION_QUERY_FIELDS = [
        'trackedEntityInstance',
        'attributes[attribute,value]',
        'enrollments[events[trackedEntityInstance,eventDate,programStage,event,dataValues[dataElement,value]]]',
        'relationships[relationship,from[trackedEntityInstance[trackedEntityInstance]]]'
    ];
}
