import { generateConfigFromMetadata } from './config'
import { find, forEach, head, tail } from 'lodash'
import { Program } from '@hisptz/dhis2-utils'

const oldConfig = {
    'options': [
        {
            'code': 'Bottleneck analysis',
            'created': '2021-03-24T05:46:34.891',
            'lastUpdated': '2021-04-20T14:13:54.805',
            'name': 'Bottleneck analysis',
            'id': 'muIDRX5liMX',
            'sortOrder': 1,
            'optionSet': {
                'id': 'tsShlbiHhxN'
            },
            'attributeValues': [],
            'translations': []
        },
        {
            'code': 'Cancelled',
            'created': '2021-04-22T12:50:22.498',
            'lastUpdated': '2021-04-22T12:50:22.585',
            'name': 'Cancelled',
            'id': 'FEz7OK0NVRW',
            'sortOrder': 6,
            'optionSet': {
                'id': 'Y3FLpktyYMC'
            },
            'style': {
                'color': '#d0021b',
                'icon': 'no_outline'
            },
            'attributeValues': [],
            'translations': []
        },
        {
            'code': 'Completed',
            'created': '2021-04-22T13:06:06.292',
            'lastUpdated': '2021-04-22T13:06:06.325',
            'name': 'Completed',
            'id': 'JzKswnTlxSn',
            'sortOrder': 5,
            'optionSet': {
                'id': 'Y3FLpktyYMC'
            },
            'style': {
                'color': '#7ed321',
                'icon': 'yes_positive'
            },
            'attributeValues': [],
            'translations': []
        },
        {
            'code': ' In progress',
            'created': '2021-04-22T13:07:26.200',
            'lastUpdated': '2021-04-22T13:07:26.241',
            'name': 'In progress',
            'id': 'CI07xeRxsZU',
            'sortOrder': 4,
            'optionSet': {
                'id': 'Y3FLpktyYMC'
            },
            'style': {
                'color': '#f5a623',
                'icon': 'high_level_positive'
            },
            'attributeValues': [],
            'translations': []
        },
        {
            'code': 'Not started',
            'created': '2021-04-22T13:08:26.117',
            'lastUpdated': '2021-04-22T13:08:26.148',
            'name': 'Not started',
            'id': 'fLUmGT0p0Sh',
            'sortOrder': 3,
            'optionSet': {
                'id': 'Y3FLpktyYMC'
            },
            'style': {
                'color': '#4a90e2',
                'icon': 'alert_positive'
            },
            'attributeValues': [],
            'translations': []
        },
        {
            'code': 'Root cause analysis',
            'created': '2021-04-21T07:26:48.993',
            'lastUpdated': '2021-04-21T07:26:49.008',
            'name': 'Root cause analysis',
            'id': 'H8dVCYKzpuO',
            'sortOrder': 2,
            'optionSet': {
                'id': 'tsShlbiHhxN'
            },
            'attributeValues': [],
            'translations': []
        }
    ],
    'programs': [
        {
            'lastUpdated': '2021-04-14T07:08:37.430',
            'id': 'unD7wro3qPm',
            'created': '2021-03-11T08:11:09.685',
            'name': 'Action',
            'shortName': 'Action',
            'completeEventsExpiryDays': 0,
            'ignoreOverdueEvents': false,
            'skipOffline': false,
            'featureType': 'NONE',
            'minAttributesRequiredToSearch': 1,
            'displayFrontPageList': true,
            'onlyEnrollOnce': false,
            'programType': 'WITH_REGISTRATION',
            'accessLevel': 'OPEN',
            'version': 19,
            'maxTeiCountToReturn': 0,
            'selectIncidentDatesInFuture': false,
            'displayIncidentDate': true,
            'selectEnrollmentDatesInFuture': false,
            'expiryDays': 0,
            'useFirstStageDuringRegistration': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'trackedEntityType': {
                'id': 'TFYpX5EXmYp'
            },
            'programTrackedEntityAttributes': [
                {
                    'lastUpdated': '2021-04-14T07:08:37.431',
                    'id': 'urdrpu6iNb3',
                    'created': '2021-03-11T08:11:09.606',
                    'name': 'Action Actiontracker_Title',
                    'displayName': 'Action Actiontracker_Title',
                    'mandatory': true,
                    'displayShortName': 'Action Actiontracker_Title',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 1,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'HQxzVwKedKu'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:37.431',
                    'id': 'vtttkk1JVw2',
                    'created': '2021-03-11T08:11:09.606',
                    'name': 'Action Actiontracker_Description',
                    'displayName': 'Action Actiontracker_Description',
                    'mandatory': true,
                    'displayShortName': 'Action Actiontracker_Description',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'LONG_TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 2,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'GlvCtGIytIz'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:37.431',
                    'id': 'JWo3ofhvPsA',
                    'created': '2021-03-11T08:11:09.606',
                    'name': 'Action Actiontracker_Start Date',
                    'displayName': 'Action Actiontracker_Start Date',
                    'mandatory': true,
                    'displayShortName': 'Action Actiontracker_Start Date',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'DATE',
                    'allowFutureDate': true,
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 3,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'jFjnkx49Lg3'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:37.431',
                    'id': 'WRS7ca4ygWa',
                    'created': '2021-03-11T08:11:09.606',
                    'name': 'Action Actiontracker_End Date',
                    'displayName': 'Action Actiontracker_End Date',
                    'mandatory': true,
                    'displayShortName': 'Action Actiontracker_End Date',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'DATE',
                    'allowFutureDate': true,
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 4,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'BYCbHJ46BOr'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:37.431',
                    'id': 'UcdVcucQtri',
                    'created': '2021-03-11T08:11:09.606',
                    'name': 'Action Actiontracker_Responsible Person',
                    'displayName': 'Action Actiontracker_Responsible Person',
                    'mandatory': false,
                    'displayShortName': 'Action Actiontracker_Responsible Person',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 5,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'G3aWsZW2MpV'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:37.431',
                    'id': 'Tj92f4zDeLk',
                    'created': '2021-03-11T08:11:09.606',
                    'name': 'Action Actiontracker_Designation',
                    'displayName': 'Action Actiontracker_Designation',
                    'mandatory': false,
                    'displayShortName': 'Action Actiontracker_Designation',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': false,
                    'displayInList': true,
                    'sortOrder': 6,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'Ax6bWbKn46e'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:37.432',
                    'id': 'prX0q7amAni',
                    'created': '2021-03-11T08:34:44.731',
                    'name': 'Action Actiontracker_Action To Solution Linkage',
                    'displayName': 'Action Actiontracker_Action To Solution Linkage',
                    'mandatory': false,
                    'displayShortName': 'Action Actiontracker_Action To Solution Linkage',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': false,
                    'displayInList': false,
                    'sortOrder': 7,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'trackedEntityAttribute': {
                        'id': 'Hi3IjyMXzeW'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                }
            ],
            'notificationTemplates': [],
            'translations': [],
            'organisationUnits': [],
            'programSections': [],
            'attributeValues': [],
            'programStages': [
                {
                    'lastUpdated': '2021-04-06T12:36:39.815',
                    'id': 'cBiAEANcXAj',
                    'created': '2021-03-11T08:11:09.659',
                    'name': 'Action status',
                    'allowGenerateNextVisit': false,
                    'preGenerateUID': false,
                    'description': 'Action status',
                    'openAfterEnrollment': false,
                    'repeatable': true,
                    'remindCompleted': false,
                    'displayGenerateEventBox': true,
                    'generatedByEnrollmentDate': false,
                    'validationStrategy': 'ON_COMPLETE',
                    'autoGenerateEvent': true,
                    'sortOrder': 1,
                    'hideDueDate': false,
                    'blockEntryForm': false,
                    'enableUserAssignment': false,
                    'minDaysFromStart': 0,
                    'program': {
                        'id': 'unD7wro3qPm'
                    },
                    'lastUpdatedBy': {
                        'displayName': 'Gift Nnko',
                        'id': 'II9InK8WpYg',
                        'username': 'gnnko'
                    },
                    'notificationTemplates': [],
                    'programStageDataElements': [
                        {
                            'lastUpdated': '2021-04-06T12:36:39.472',
                            'id': 'TitEqIE0jCf',
                            'created': '2021-03-11T08:11:09.660',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': true,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 1,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'cBiAEANcXAj'
                            },
                            'dataElement': {
                                'id': 'f8JYVWLC7rE'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-06T12:36:39.473',
                            'id': 'O4DKXYMDpvD',
                            'created': '2021-03-11T08:11:09.660',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': true,
                            'compulsory': true,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 2,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'cBiAEANcXAj'
                            },
                            'dataElement': {
                                'id': 'nodiP54ocf5'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-06T12:36:39.471',
                            'id': 'QKPC4ftcfNQ',
                            'created': '2021-03-11T08:11:09.659',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': false,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 3,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'cBiAEANcXAj'
                            },
                            'dataElement': {
                                'id': 'FnengvwgsQv'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        }
                    ],
                    'translations': [],
                    'attributeValues': [],
                    'programStageSections': [
                        {
                            'id': 'Glo7x5VVsbF'
                        }
                    ]
                },
            ]
        },
        {
            'lastUpdated': '2021-04-14T07:08:56.176',
            'id': 'Uvz0nfKVMQJ',
            'created': '2021-03-11T07:33:07.448',
            'name': 'Bottleneck',
            'shortName': 'Bottleneck',
            'completeEventsExpiryDays': 0,
            'ignoreOverdueEvents': false,
            'skipOffline': false,
            'featureType': 'NONE',
            'minAttributesRequiredToSearch': 1,
            'displayFrontPageList': true,
            'onlyEnrollOnce': false,
            'programType': 'WITH_REGISTRATION',
            'accessLevel': 'OPEN',
            'version': 13,
            'maxTeiCountToReturn': 0,
            'selectIncidentDatesInFuture': false,
            'displayIncidentDate': true,
            'selectEnrollmentDatesInFuture': false,
            'expiryDays': 0,
            'useFirstStageDuringRegistration': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'trackedEntityType': {
                'id': 'jLaBp1GaZQ9'
            },
            'programTrackedEntityAttributes': [
                {
                    'lastUpdated': '2021-04-14T07:08:56.177',
                    'id': 'Cx4ba7NQIGv',
                    'created': '2021-03-11T07:33:07.257',
                    'name': 'Bottleneck Actiontracker_Intervention',
                    'displayName': 'Bottleneck Actiontracker_Intervention',
                    'mandatory': true,
                    'displayShortName': 'Bottleneck Actiontracker_Intervention',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 1,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'Uvz0nfKVMQJ'
                    },
                    'trackedEntityAttribute': {
                        'id': 'jZ6WL4NQtp5'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:56.177',
                    'id': 'hIZebzS6URQ',
                    'created': '2021-03-11T08:06:54.815',
                    'name': 'Bottleneck Actiontracker_Bottleneck',
                    'displayName': 'Bottleneck Actiontracker_Bottleneck',
                    'mandatory': false,
                    'displayShortName': 'Bottleneck Actiontracker_Bottleneck',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 2,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'Uvz0nfKVMQJ'
                    },
                    'trackedEntityAttribute': {
                        'id': 'WLFrBgfl7lU'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:56.177',
                    'id': 'o6TonGBLJkO',
                    'created': '2021-03-11T08:06:54.815',
                    'name': 'Bottleneck Actiontracker_Coverage Indicator',
                    'displayName': 'Bottleneck Actiontracker_Coverage Indicator',
                    'mandatory': false,
                    'displayShortName': 'Bottleneck Actiontracker_Coverage Indicator',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 3,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'Uvz0nfKVMQJ'
                    },
                    'trackedEntityAttribute': {
                        'id': 'imiLbaQKYnA'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-14T07:08:56.177',
                    'id': 'jLKwH4g2RKY',
                    'created': '2021-03-11T08:06:54.815',
                    'name': 'Bottleneck Actiontracker_Indicator',
                    'displayName': 'Bottleneck Actiontracker_Indicator',
                    'mandatory': true,
                    'displayShortName': 'Bottleneck Actiontracker_Indicator',
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'valueType': 'TEXT',
                    'searchable': true,
                    'displayInList': true,
                    'sortOrder': 4,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'program': {
                        'id': 'Uvz0nfKVMQJ'
                    },
                    'trackedEntityAttribute': {
                        'id': 'tVlKbtVfNjc'
                    },
                    'favorites': [],
                    'programTrackedEntityAttributeGroups': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                }
            ],
            'notificationTemplates': [],
            'translations': [],
            'organisationUnits': [],
            'programSections': [],
            'attributeValues': [],
            'programStages': [
                {
                    'lastUpdated': '2021-04-12T12:00:19.974',
                    'id': 'zXB8tWKuwcl',
                    'created': '2021-03-11T07:33:07.378',
                    'name': 'Gap',
                    'allowGenerateNextVisit': false,
                    'preGenerateUID': false,
                    'openAfterEnrollment': false,
                    'repeatable': true,
                    'remindCompleted': false,
                    'displayGenerateEventBox': true,
                    'generatedByEnrollmentDate': false,
                    'validationStrategy': 'ON_COMPLETE',
                    'autoGenerateEvent': true,
                    'sortOrder': 1,
                    'hideDueDate': false,
                    'blockEntryForm': false,
                    'enableUserAssignment': false,
                    'minDaysFromStart': 0,
                    'program': {
                        'id': 'Uvz0nfKVMQJ'
                    },
                    'lastUpdatedBy': {
                        'displayName': 'Gift Nnko',
                        'id': 'II9InK8WpYg',
                        'username': 'gnnko'
                    },
                    'notificationTemplates': [],
                    'programStageDataElements': [
                        {
                            'lastUpdated': '2021-04-12T12:00:19.977',
                            'id': 'KkFk22FtGHL',
                            'created': '2021-03-11T07:33:07.379',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': true,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 1,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'zXB8tWKuwcl'
                            },
                            'dataElement': {
                                'id': 'JbMaVyglSit'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-12T12:00:19.977',
                            'id': 'NufCEDgwXRT',
                            'created': '2021-03-11T08:06:55.029',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': true,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 2,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'zXB8tWKuwcl'
                            },
                            'dataElement': {
                                'id': 'GsbZkewUna5'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-12T12:00:19.976',
                            'id': 'ZgrWLgx1hCm',
                            'created': '2021-03-11T08:06:55.028',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': true,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 3,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'zXB8tWKuwcl'
                            },
                            'dataElement': {
                                'id': 'W50aguV39tU'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-12T12:00:19.978',
                            'id': 'ksiDaorDatg',
                            'created': '2021-03-11T08:06:55.029',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': false,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 4,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'zXB8tWKuwcl'
                            },
                            'dataElement': {
                                'id': 'kBkyDytdOmC'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        }
                    ],
                    'translations': [],
                    'attributeValues': [],
                    'programStageSections': [
                        {
                            'id': 'MCRHv0EnBdB'
                        }
                    ]
                },
                {
                    'lastUpdated': '2021-04-12T12:00:19.978',
                    'id': 'JJaKjcOBapi',
                    'created': '2021-03-11T08:08:28.220',
                    'name': 'Possible Solutions',
                    'allowGenerateNextVisit': false,
                    'preGenerateUID': false,
                    'openAfterEnrollment': false,
                    'repeatable': true,
                    'remindCompleted': false,
                    'displayGenerateEventBox': true,
                    'generatedByEnrollmentDate': false,
                    'validationStrategy': 'ON_COMPLETE',
                    'autoGenerateEvent': true,
                    'sortOrder': 2,
                    'hideDueDate': false,
                    'blockEntryForm': false,
                    'enableUserAssignment': false,
                    'minDaysFromStart': 0,
                    'program': {
                        'id': 'Uvz0nfKVMQJ'
                    },
                    'lastUpdatedBy': {
                        'displayName': 'Gift Nnko',
                        'id': 'II9InK8WpYg',
                        'username': 'gnnko'
                    },
                    'notificationTemplates': [],
                    'programStageDataElements': [
                        {
                            'lastUpdated': '2021-04-12T12:00:19.981',
                            'id': 'd55BZP5pUyR',
                            'created': '2021-03-11T08:08:28.221',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': true,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 1,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'JJaKjcOBapi'
                            },
                            'dataElement': {
                                'id': 'upT2cOT6UfJ'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-12T12:00:19.981',
                            'id': 'Us9SEgB5JOk',
                            'created': '2021-03-11T08:08:28.220',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': false,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 2,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'JJaKjcOBapi'
                            },
                            'dataElement': {
                                'id': 'kBkyDytdOmC'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        },
                        {
                            'lastUpdated': '2021-04-12T12:00:19.980',
                            'id': 'AvWqNwk7aUc',
                            'created': '2021-03-11T08:36:45.920',
                            'displayInReports': true,
                            'skipSynchronization': false,
                            'externalAccess': false,
                            'renderOptionsAsRadio': false,
                            'allowFutureDate': false,
                            'compulsory': false,
                            'allowProvidedElsewhere': false,
                            'sortOrder': 3,
                            'favorite': false,
                            'access': {
                                'read': true,
                                'update': true,
                                'externalize': true,
                                'delete': true,
                                'write': true,
                                'manage': true
                            },
                            'programStage': {
                                'id': 'JJaKjcOBapi'
                            },
                            'dataElement': {
                                'id': 'Y4CIGFwWYJD'
                            },
                            'favorites': [],
                            'translations': [],
                            'userGroupAccesses': [],
                            'attributeValues': [],
                            'userAccesses': []
                        }
                    ],
                    'translations': [],
                    'attributeValues': [],
                    'programStageSections': [
                        {
                            'id': 'YgDeKz3FMT1'
                        }
                    ]
                }
            ]
        }
    ],
    'trackedEntityTypes': [
        {
            'created': '2021-03-11T08:03:38.194',
            'lastUpdated': '2021-04-08T07:00:22.885',
            'name': 'action',
            'id': 'TFYpX5EXmYp',
            'maxTeiCountToReturn': 0,
            'allowAuditLog': false,
            'featureType': 'NONE',
            'minAttributesRequiredToSearch': 1,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'attributeValues': [],
            'trackedEntityTypeAttributes': [],
            'translations': []
        },
        {
            'created': '2021-03-11T07:31:01.886',
            'lastUpdated': '2021-04-08T07:00:08.406',
            'name': 'bottleneck',
            'id': 'jLaBp1GaZQ9',
            'maxTeiCountToReturn': 0,
            'allowAuditLog': false,
            'featureType': 'NONE',
            'minAttributesRequiredToSearch': 1,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'attributeValues': [],
            'trackedEntityTypeAttributes': [],
            'translations': []
        }
    ],
    'optionSets': [
        {
            'code': 'Actiontracker_Action status',
            'created': '2021-03-11T08:40:03.048',
            'lastUpdated': '2021-04-14T06:49:11.830',
            'name': 'Actiontracker_Action status',
            'id': 'Y3FLpktyYMC',
            'version': 9,
            'valueType': 'TEXT',
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'attributeValues': [],
            'translations': [],
            'options': [
                {
                    'id': 'fLUmGT0p0Sh'
                },
                {
                    'id': 'CI07xeRxsZU'
                },
                {
                    'id': 'JzKswnTlxSn'
                },
                {
                    'id': 'FEz7OK0NVRW'
                }
            ]
        },
        {
            'created': '2021-06-07T09:27:39.455',
            'lastUpdated': '2021-06-07T09:28:04.668',
            'name': 'Actiontracker_Method',
            'id': 'tsShlbiHhxN',
            'version': 82,
            'valueType': 'TEXT',
            'lastUpdatedBy': {
                'displayName': 'Auto Tester',
                'id': 'gskMxnpgzZF',
                'username': 'auto-tester'
            },
            'attributeValues': [],
            'translations': [],
            'options': [
                {
                    'id': 'muIDRX5liMX'
                },
                {
                    'id': 'H8dVCYKzpuO'
                }
            ]
        }
    ],
    'programStages': [
        {
            'lastUpdated': '2021-04-06T12:36:39.815',
            'id': 'cBiAEANcXAj',
            'created': '2021-03-11T08:11:09.659',
            'name': 'Action status',
            'allowGenerateNextVisit': false,
            'preGenerateUID': false,
            'description': 'Action status',
            'openAfterEnrollment': false,
            'repeatable': true,
            'remindCompleted': false,
            'displayGenerateEventBox': true,
            'generatedByEnrollmentDate': false,
            'validationStrategy': 'ON_COMPLETE',
            'autoGenerateEvent': true,
            'sortOrder': 1,
            'hideDueDate': false,
            'blockEntryForm': false,
            'enableUserAssignment': false,
            'minDaysFromStart': 0,
            'program': {
                'id': 'unD7wro3qPm'
            },
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'notificationTemplates': [],
            'programStageDataElements': [
                {
                    'lastUpdated': '2021-04-06T12:36:39.472',
                    'id': 'TitEqIE0jCf',
                    'created': '2021-03-11T08:11:09.660',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': true,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 1,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'cBiAEANcXAj'
                    },
                    'dataElement': {
                        'id': 'f8JYVWLC7rE'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-06T12:36:39.473',
                    'id': 'O4DKXYMDpvD',
                    'created': '2021-03-11T08:11:09.660',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': true,
                    'compulsory': true,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 2,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'cBiAEANcXAj'
                    },
                    'dataElement': {
                        'id': 'nodiP54ocf5'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-06T12:36:39.471',
                    'id': 'QKPC4ftcfNQ',
                    'created': '2021-03-11T08:11:09.659',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': false,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 3,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'cBiAEANcXAj'
                    },
                    'dataElement': {
                        'id': 'FnengvwgsQv'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                }
            ],
            'translations': [],
            'attributeValues': [],
            'programStageSections': [
                {
                    'id': 'Glo7x5VVsbF'
                }
            ]
        },
        {
            'lastUpdated': '2021-04-12T12:00:19.974',
            'id': 'zXB8tWKuwcl',
            'created': '2021-03-11T07:33:07.378',
            'name': 'Gap',
            'allowGenerateNextVisit': false,
            'preGenerateUID': false,
            'openAfterEnrollment': false,
            'repeatable': true,
            'remindCompleted': false,
            'displayGenerateEventBox': true,
            'generatedByEnrollmentDate': false,
            'validationStrategy': 'ON_COMPLETE',
            'autoGenerateEvent': true,
            'sortOrder': 1,
            'hideDueDate': false,
            'blockEntryForm': false,
            'enableUserAssignment': false,
            'minDaysFromStart': 0,
            'program': {
                'id': 'Uvz0nfKVMQJ'
            },
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'notificationTemplates': [],
            'programStageDataElements': [
                {
                    'lastUpdated': '2021-04-12T12:00:19.977',
                    'id': 'KkFk22FtGHL',
                    'created': '2021-03-11T07:33:07.379',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': true,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 1,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'zXB8tWKuwcl'
                    },
                    'dataElement': {
                        'id': 'JbMaVyglSit'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-12T12:00:19.977',
                    'id': 'NufCEDgwXRT',
                    'created': '2021-03-11T08:06:55.029',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': true,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 2,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'zXB8tWKuwcl'
                    },
                    'dataElement': {
                        'id': 'GsbZkewUna5'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-12T12:00:19.976',
                    'id': 'ZgrWLgx1hCm',
                    'created': '2021-03-11T08:06:55.028',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': true,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 3,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'zXB8tWKuwcl'
                    },
                    'dataElement': {
                        'id': 'W50aguV39tU'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-12T12:00:19.978',
                    'id': 'ksiDaorDatg',
                    'created': '2021-03-11T08:06:55.029',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': false,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 4,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'zXB8tWKuwcl'
                    },
                    'dataElement': {
                        'id': 'kBkyDytdOmC'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                }
            ],
            'translations': [],
            'attributeValues': [],
            'programStageSections': [
                {
                    'id': 'MCRHv0EnBdB'
                }
            ]
        },
        {
            'lastUpdated': '2021-04-12T12:00:19.978',
            'id': 'JJaKjcOBapi',
            'created': '2021-03-11T08:08:28.220',
            'name': 'Possible Solutions',
            'allowGenerateNextVisit': false,
            'preGenerateUID': false,
            'openAfterEnrollment': false,
            'repeatable': true,
            'remindCompleted': false,
            'displayGenerateEventBox': true,
            'generatedByEnrollmentDate': false,
            'validationStrategy': 'ON_COMPLETE',
            'autoGenerateEvent': true,
            'sortOrder': 2,
            'hideDueDate': false,
            'blockEntryForm': false,
            'enableUserAssignment': false,
            'minDaysFromStart': 0,
            'program': {
                'id': 'Uvz0nfKVMQJ'
            },
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'notificationTemplates': [],
            'programStageDataElements': [
                {
                    'lastUpdated': '2021-04-12T12:00:19.981',
                    'id': 'd55BZP5pUyR',
                    'created': '2021-03-11T08:08:28.221',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': true,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 1,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'JJaKjcOBapi'
                    },
                    'dataElement': {
                        'id': 'upT2cOT6UfJ'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-12T12:00:19.981',
                    'id': 'Us9SEgB5JOk',
                    'created': '2021-03-11T08:08:28.220',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': false,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 2,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'JJaKjcOBapi'
                    },
                    'dataElement': {
                        'id': 'kBkyDytdOmC'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                },
                {
                    'lastUpdated': '2021-04-12T12:00:19.980',
                    'id': 'AvWqNwk7aUc',
                    'created': '2021-03-11T08:36:45.920',
                    'displayInReports': true,
                    'skipSynchronization': false,
                    'externalAccess': false,
                    'renderOptionsAsRadio': false,
                    'allowFutureDate': false,
                    'compulsory': false,
                    'allowProvidedElsewhere': false,
                    'sortOrder': 3,
                    'favorite': false,
                    'access': {
                        'read': true,
                        'update': true,
                        'externalize': true,
                        'delete': true,
                        'write': true,
                        'manage': true
                    },
                    'programStage': {
                        'id': 'JJaKjcOBapi'
                    },
                    'dataElement': {
                        'id': 'Y4CIGFwWYJD'
                    },
                    'favorites': [],
                    'translations': [],
                    'userGroupAccesses': [],
                    'attributeValues': [],
                    'userAccesses': []
                }
            ],
            'translations': [],
            'attributeValues': [],
            'programStageSections': [
                {
                    'id': 'YgDeKz3FMT1'
                }
            ]
        }
    ],
    'dataElements': [
        {
            'lastUpdated': '2021-04-14T06:09:26.430',
            'id': 'f8JYVWLC7rE',
            'created': '2021-03-11T08:00:57.880',
            'name': 'Actiontracker_Action status',
            'shortName': 'Actiontracker_Action status',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'To collect the status of the action time at review date. The filed will have Action status options with color selection that can be configured.',
            'valueType': 'TEXT',
            'formName': 'Action status',
            'zeroIsSignificant': false,
            'optionSet': {
                'id': 'Y3FLpktyYMC'
            },
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.441',
            'id': 'GsbZkewUna5',
            'created': '2021-03-11T07:57:58.131',
            'name': 'Actiontracker_Description',
            'shortName': 'Actiontracker_Description',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'Description of the Gap',
            'valueType': 'LONG_TEXT',
            'formName': 'Description',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.442',
            'id': 'W50aguV39tU',
            'created': '2021-03-11T07:58:13.336',
            'name': 'Actiontracker_Method',
            'shortName': 'Actiontracker_Method',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'To capture the method or procedure used in identifying the gap.',
            'valueType': 'TEXT',
            'formName': 'Method',
            'zeroIsSignificant': false,
            'optionSet': {
                'id': 'tsShlbiHhxN'
            },
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.445',
            'id': 'FnengvwgsQv',
            'created': '2021-03-11T08:02:11.845',
            'name': 'Actiontracker_Remarks / comments',
            'shortName': 'Actiontracker_Remarks / comments',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'Remarks or comments on the action as per the review period.',
            'valueType': 'LONG_TEXT',
            'formName': 'Remarks / comment',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.446',
            'id': 'nodiP54ocf5',
            'created': '2021-03-11T08:01:38.206',
            'name': 'Actiontracker_Review Date',
            'shortName': 'Actiontracker_Review Date',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'To capture the review date of the action execution.',
            'valueType': 'DATE',
            'formName': 'Review Date',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.448',
            'id': 'upT2cOT6UfJ',
            'created': '2021-03-11T07:59:59.155',
            'name': 'Actiontracker_Solution ',
            'shortName': 'Actiontracker_Solution ',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'valueType': 'LONG_TEXT',
            'formName': 'Solution',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.449',
            'id': 'Y4CIGFwWYJD',
            'created': '2021-03-11T08:35:28.975',
            'name': 'Actiontracker_Solution To Action Linkage',
            'shortName': 'Actiontracker_Solution To Action Linkage',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'To link gaps to solutions (Not visible to the user).',
            'valueType': 'TEXT',
            'formName': 'Solution To Action Linkage',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.450',
            'id': 'kBkyDytdOmC',
            'created': '2021-03-11T07:59:37.230',
            'name': 'Actiontracker_Solution To Gap Linkage',
            'shortName': 'Actiontracker_Solution To Gap Linkage',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'To link gaps to solutions (Not visible to the user).',
            'valueType': 'TEXT',
            'formName': 'Solution To Gap Linkage',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        },
        {
            'lastUpdated': '2021-04-14T06:09:26.451',
            'id': 'JbMaVyglSit',
            'created': '2021-03-11T07:30:11.327',
            'name': 'Actiontracker_Title',
            'shortName': 'Actiontracker_Title',
            'aggregationType': 'NONE',
            'domainType': 'TRACKER',
            'description': 'Titlte of the identified Gap',
            'valueType': 'TEXT',
            'formName': 'Title',
            'zeroIsSignificant': false,
            'categoryCombo': {
                'id': 'bjDvmb4bfuf'
            },
            'lastUpdatedBy': {
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin',
                'code': 'admin'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': [],
            'aggregationLevels': []
        }
    ],
    'trackedEntityAttributes': [
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'Hi3IjyMXzeW',
            'created': '2021-03-11T08:32:45.540',
            'name': 'Actiontracker_Action To Solution Linkage',
            'shortName': 'Actiontracker_Action To Solution Linkage',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'Link to the Possible Solution',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Action To Solution Linkage',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'WLFrBgfl7lU',
            'created': '2021-03-11T07:47:36.883',
            'name': 'Actiontracker_Bottleneck',
            'shortName': 'Actiontracker_Bottleneck',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Bottleneck',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'imiLbaQKYnA',
            'created': '2021-03-11T07:48:07.018',
            'name': 'Actiontracker_Coverage Indicator',
            'shortName': 'Actiontracker_Coverage Indicator',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Coverage Indicator',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'GlvCtGIytIz',
            'created': '2021-03-11T07:49:31.357',
            'name': 'Actiontracker_Description',
            'shortName': 'Actiontracker_Description',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'A description for the action item',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'LONG_TEXT',
            'formName': 'Description',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'Ax6bWbKn46e',
            'created': '2021-03-11T07:52:36.013',
            'name': 'Actiontracker_Designation',
            'shortName': 'Actiontracker_Designation',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'Designation title of the responsible person to execute the action',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Designation',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'BYCbHJ46BOr',
            'created': '2021-03-11T07:50:36.798',
            'name': 'Actiontracker_End Date',
            'shortName': 'Actiontracker_End Date',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'End date for the action',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'DATE',
            'formName': 'End Date',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'tVlKbtVfNjc',
            'created': '2021-03-11T07:48:29.634',
            'name': 'Actiontracker_Indicator',
            'shortName': 'Actiontracker_Indicator',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Indicator',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'jZ6WL4NQtp5',
            'created': '2021-03-11T07:29:34.946',
            'name': 'Actiontracker_Intervention',
            'shortName': 'Actiontracker_Intervention',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Intervention',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'G3aWsZW2MpV',
            'created': '2021-03-11T07:52:14.282',
            'name': 'Actiontracker_Responsible Person',
            'shortName': 'Actiontracker_Responsible Person',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'To capture the name of the responsible person to execute the action',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Responsible Person',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'jFjnkx49Lg3',
            'created': '2021-03-11T07:50:03.513',
            'name': 'Actiontracker_Start Date',
            'shortName': 'Actiontracker_Start Date',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'Start date for the action',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'DATE',
            'formName': 'Start Date',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        },
        {
            'lastUpdated': '2021-04-06T12:36:39.173',
            'id': 'HQxzVwKedKu',
            'created': '2021-03-11T07:49:00.386',
            'name': 'Actiontracker_Title',
            'shortName': 'Actiontracker_Title',
            'aggregationType': 'NONE',
            'displayInListNoProgram': false,
            'pattern': '',
            'description': 'Title of the action',
            'skipSynchronization': false,
            'generated': false,
            'displayOnVisitSchedule': false,
            'valueType': 'TEXT',
            'formName': 'Title',
            'confidential': false,
            'orgunitScope': false,
            'unique': false,
            'inherit': false,
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'translations': [],
            'attributeValues': [],
            'legendSets': []
        }
    ],
    'dataElementGroups': [
        {
            'created': '2021-03-11T09:30:29.282',
            'lastUpdated': '2021-04-14T06:09:26.498',
            'name': 'Actiontracker_Action',
            'id': 'QrprHT61XFk',
            'shortName': 'Actiontracker_Action',
            'description': 'Data elements assigned to Action program',
            'lastUpdatedBy': {
                'code': 'admin',
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin'
            },
            'attributeValues': [],
            'translations': [],
            'dataElements': [
                {
                    'id': 'FnengvwgsQv'
                },
                {
                    'id': 'f8JYVWLC7rE'
                },
                {
                    'id': 'nodiP54ocf5'
                }
            ]
        },
        {
            'created': '2021-03-11T09:29:21.212',
            'lastUpdated': '2021-04-14T06:09:26.502',
            'name': 'Actiontracker_Bottleneck',
            'id': 'oGoG8Fa2zPq',
            'shortName': 'Actiontracker_Bottleneck',
            'description': 'Data elements for bottleneck program',
            'lastUpdatedBy': {
                'code': 'admin',
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin'
            },
            'attributeValues': [],
            'translations': [],
            'dataElements': [
                {
                    'id': 'GsbZkewUna5'
                },
                {
                    'id': 'kBkyDytdOmC'
                },
                {
                    'id': 'W50aguV39tU'
                },
                {
                    'id': 'Y4CIGFwWYJD'
                },
                {
                    'id': 'JbMaVyglSit'
                },
                {
                    'id': 'upT2cOT6UfJ'
                }
            ]
        }
    ],
    'programStageSections': [
        {
            'created': '2021-03-11T08:11:09.650',
            'lastUpdated': '2021-04-06T12:36:39.372',
            'name': 'Action Status',
            'id': 'Glo7x5VVsbF',
            'sortOrder': 0,
            'renderType': {
                'MOBILE': {
                    'type': 'LISTING'
                },
                'DESKTOP': {
                    'type': 'LISTING'
                }
            },
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'programStage': {
                'id': 'cBiAEANcXAj'
            },
            'programIndicators': [],
            'translations': [],
            'dataElements': [
                {
                    'id': 'f8JYVWLC7rE'
                },
                {
                    'id': 'nodiP54ocf5'
                },
                {
                    'id': 'FnengvwgsQv'
                }
            ]
        },
        {
            'created': '2021-03-11T07:33:07.363',
            'lastUpdated': '2021-04-06T12:36:39.372',
            'name': 'Gap',
            'id': 'MCRHv0EnBdB',
            'sortOrder': 0,
            'renderType': {
                'MOBILE': {
                    'type': 'LISTING'
                },
                'DESKTOP': {
                    'type': 'LISTING'
                }
            },
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'programStage': {
                'id': 'zXB8tWKuwcl'
            },
            'programIndicators': [],
            'translations': [],
            'dataElements': [
                {
                    'id': 'JbMaVyglSit'
                },
                {
                    'id': 'GsbZkewUna5'
                },
                {
                    'id': 'W50aguV39tU'
                },
                {
                    'id': 'kBkyDytdOmC'
                }
            ]
        },
        {
            'created': '2021-03-11T08:08:28.206',
            'lastUpdated': '2021-04-06T12:36:39.372',
            'name': 'Possible Solutions',
            'id': 'YgDeKz3FMT1',
            'sortOrder': 0,
            'renderType': {
                'MOBILE': {
                    'type': 'LISTING'
                },
                'DESKTOP': {
                    'type': 'LISTING'
                }
            },
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'programStage': {
                'id': 'JJaKjcOBapi'
            },
            'programIndicators': [],
            'translations': [],
            'dataElements': [
                {
                    'id': 'upT2cOT6UfJ'
                },
                {
                    'id': 'Y4CIGFwWYJD'
                },
                {
                    'id': 'kBkyDytdOmC'
                }
            ]
        }
    ],
    'dataElementGroupSets': [
        {
            'created': '2021-03-11T09:31:44.781',
            'lastUpdated': '2021-04-14T06:09:26.522',
            'name': 'Action tracker',
            'shortName': 'Action tracker',
            'id': 'y9sDu6fOUWK',
            'description': 'All dataelements for actiontracker',
            'compulsory': false,
            'dataDimension': true,
            'lastUpdatedBy': {
                'code': 'admin',
                'displayName': 'admin admin',
                'id': 'M5zQapPyTZI',
                'username': 'admin'
            },
            'attributeValues': [],
            'dataElementGroups': [
                {
                    'id': 'QrprHT61XFk'
                },
                {
                    'id': 'oGoG8Fa2zPq'
                }
            ],
            'translations': []
        }
    ],
    'relationshipTypes': [
        {
            'created': '2021-03-11T08:30:13.710',
            'lastUpdated': '2021-04-08T07:02:22.363',
            'name': 'Bottleneck to Action',
            'id': 'XTJrr4c45G7',
            'bidirectional': true,
            'description': 'Bottleneck to Action',
            'toFromName': 'Action to Bottleneck relationship',
            'fromToName': 'Bottleneck to Action relationship',
            'lastUpdatedBy': {
                'displayName': 'Gift Nnko',
                'id': 'II9InK8WpYg',
                'username': 'gnnko'
            },
            'fromConstraint': {
                'relationshipEntity': 'TRACKED_ENTITY_INSTANCE',
                'trackedEntityType': {
                    'id': 'jLaBp1GaZQ9'
                },
                'program': {
                    'id': 'Uvz0nfKVMQJ'
                }
            },
            'toConstraint': {
                'relationshipEntity': 'TRACKED_ENTITY_INSTANCE',
                'trackedEntityType': {
                    'id': 'TFYpX5EXmYp'
                },
                'program': {
                    'id': 'unD7wro3qPm'
                }
            },
            'translations': []
        }
    ]
}
const defaultSettings = {
    'planningOrgUnitLevel': 'c744Xo4Kw6v',
    'planningPeriod': 'Quarterly',
    'trackingPeriod': 'Monthly'
}
describe('Generates accurate config from metadata', () => {
    const programs = oldConfig.programs
    const config = generateConfigFromMetadata({
        programs: programs as unknown as Program[],
        defaultSettings
    })

    it('Should have id and name', () => {
        expect(config.id).not.toBeUndefined()
        expect(config.name).toBe('Bottleneck')
    })

    it('Should have accurate categories', () => {
        const categories = config.categories
        const firstCategory = head(categories)
        expect(categories).toHaveLength(3)
        expect(firstCategory?.id).toBe('Uvz0nfKVMQJ')
        expect(firstCategory?.fields).toHaveLength(programs[1].programTrackedEntityAttributes.length)
        forEach(programs[1].programTrackedEntityAttributes, ({
                                                                 trackedEntityAttribute,
                                                                 mandatory
                                                             }) => {
            const field = find(firstCategory?.fields, { id: trackedEntityAttribute.id })
            expect(field?.mandatory).toBe(mandatory)
            expect(field?.id).toBe(trackedEntityAttribute.id)
        })

        forEach(tail(categories), (category, index) => {
            const programStage = programs[1].programStages[index]
            expect(category.id).toBe(programStage.id)
            expect(category.fields).toHaveLength(programStage.programStageDataElements.length)
            forEach(programStage.programStageDataElements, ({
                                                                dataElement,
                                                                compulsory
                                                            }) => {
                const field = find(category.fields, { id: dataElement.id })
                expect(field?.mandatory).toBe(compulsory)
                expect(field?.id).toBe(dataElement.id)
            })
            expect(category.parent).not.toBeUndefined()
        })

    })

    it('Should have accurate action', () => {

        const action = config.action
        expect(action?.id).toBe('unD7wro3qPm')
        expect(action?.fields).toHaveLength(programs[0].programTrackedEntityAttributes.length)
        forEach(programs[0].programTrackedEntityAttributes, ({
                                                                 trackedEntityAttribute,
                                                                 mandatory
                                                             }) => {
            const field = find(action?.fields, { id: trackedEntityAttribute.id })
            expect(field?.mandatory).toBe(mandatory)
            expect(field?.id).toBe(trackedEntityAttribute.id)
        })

        const statusProgramStage = programs[0].programStages[0]
        expect(action.statusConfig.id).toBe(statusProgramStage.id)
        expect(action.statusConfig.fields).toHaveLength(statusProgramStage.programStageDataElements.length)
        forEach(statusProgramStage.programStageDataElements, ({
                                                                  dataElement,
                                                                  compulsory
                                                              }) => {
            const field = find(action.statusConfig.fields, { id: dataElement.id })
            expect(field?.mandatory).toBe(compulsory)
            expect(field?.id).toBe(dataElement.id)
        })
    })

})
