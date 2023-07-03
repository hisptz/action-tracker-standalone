import {Config} from "../schemas/config";
import {PeriodTypeEnum, TrackedEntityType, uid} from "@hisptz/dhis2-utils";
import i18n from '@dhis2/d2-i18n';

export enum EntityTypes {
    CATEGORIZATION = "Categorization",
    ACTION = "Action"
}

export interface InitialMetadata {
    trackedEntityTypes: TrackedEntityType[]
}

export const initialMetadata: InitialMetadata = {
    trackedEntityTypes: [
        {
            id: "iteW21Ngr9c",
            name: EntityTypes.CATEGORIZATION,
            publicAccess: 'rw------'
        },
        {
            id: "pK995DXvyET",
            name: EntityTypes.ACTION,
            publicAccess: 'rw------'
        }
    ]
}

export function generateBasicTemplate({orgUnitLevel}: {
    orgUnitLevel: string,
}): Config {

    const categoryId = uid();
    const actionId = uid();
    const categoryToActivityId = uid();
    return {
        id: uid(),
        name: i18n.t("Basic Activity Template"),
        general: {
            orgUnit: {
                planning: orgUnitLevel,
            },
            period: {
                planning: PeriodTypeEnum.MONTHLY,
                tracking: PeriodTypeEnum.DAILY
            }
        },
        categories: [
            {
                id: categoryId,
                name: i18n.t("Category"),
                child: {
                    id: categoryToActivityId,
                    to: actionId,
                    type: "programStage"
                },
                fields: [
                    {
                        name: i18n.t("Title"),
                        id: uid(),
                        type: "TEXT",
                        mandatory: true,
                        header: true
                    },
                    {
                        name: i18n.t("About"),
                        id: uid(),
                        type: "LONG_TEXT",
                        mandatory: false,
                    },
                ]
            }
        ],
        action: {
            id: uid(),
            name: i18n.t("Activity"),
            parent: {
                from: categoryId,
                id: uid(),
                type: 'program',
                name: i18n.t("Category")
            },
            fields: [
                {
                    name: i18n.t("Name"),
                    type: "TEXT",
                    mandatory: true,
                    id: uid(),
                },
                {
                    name: i18n.t("Description"),
                    type: "LONG_TEXT",
                    mandatory: true,
                    id: uid(),
                },
                {
                    name: i18n.t("Start Date"),
                    type: "DATE",
                    mandatory: true,
                    id: uid(),
                },
                {
                    name: i18n.t("End Date"),
                    type: "DATE",
                    mandatory: true,
                    id: uid(),
                },
            ],
            statusConfig: {
                name: "Status",
                id: uid(),
                fields: [
                    {
                        name: "Status",
                        type: "TEXT",
                        mandatory: true,
                        id: uid(),
                    }
                ],
            }
        }
    }
}

export function generateLegacyTemplate(): Config {

    const bottleneckToGap = uid();
    const gapToSolution = uid();
    const solutionToAction = uid();

    return {
        id: uid(),
        name: i18n.t("Legacy  Activity Template"),
        general: {
            orgUnit: {
                planning: "1",
            },
            period: {
                planning: PeriodTypeEnum.YEARLY,
                tracking: PeriodTypeEnum.QUARTERLY
            }
        },
        categories: [
            {
                id: "Uvz0nfKVMQJ",
                name: i18n.t("Bottleneck"),
                fields: [
                    {
                        name: i18n.t("Intervention"),
                        id: "jZ6WL4NQtp5",
                        type: "TEXT",
                        header: true
                    },
                    {
                        name: i18n.t("Bottleneck"),
                        id: "WLFrBgfl7lU",
                        type: "TEXT"
                    },
                    {
                        name: i18n.t("Coverage Indicator"),
                        id: "imiLbaQKYnA",
                        type: "TEXT"
                    },
                    {
                        name: i18n.t("Indicator"),
                        id: "tVlKbtVfNjc",
                        type: "TEXT"
                    }
                ],
                child: {
                    to: "zXB8tWKuwcl",
                    type: "programStage",
                    id: bottleneckToGap
                }
            },
            {
                id: "zXB8tWKuwcl",
                name: i18n.t("Gap"),
                fields: [
                    {
                        id: "JbMaVyglSit",
                        name: i18n.t("Title"),
                        mandatory: true,
                        type: "TEXT",
                        showAsColumn: true
                    },
                    {
                        id: "GsbZkewUna5",
                        name: i18n.t("Description"),
                        mandatory: true,
                        type: "TEXT",
                    },
                    {
                        id: "W50aguV39tU",
                        name: i18n.t("Method"),
                        mandatory: true,
                        type: "TEXT"
                    },

                ],
                parent: {
                    name: "Bottleneck to Gap",
                    from: "Uvz0nfKVMQJ",
                    type: "program",
                    id: bottleneckToGap
                },
                child: {
                    to: "JJaKjcOBapi",
                    type: "programStage",
                    id: gapToSolution
                }
            },
            {
                id: "JJaKjcOBapi",
                name: i18n.t("Possible Solutions"),
                fields: [
                    {
                        id: "upT2cOT6UfJ",
                        name: i18n.t("Solution"),
                        mandatory: true,
                        type: "LONG_TEXT",
                        showAsColumn: true
                    },
                ],
                parent: {
                    name: "Gap to Solution",
                    from: "zXB8tWKuwcl",
                    type: "programStage",
                    id: gapToSolution
                },
                child: {
                    to: "unD7wro3qPm",
                    type: "program",
                    id: solutionToAction
                }
            },
        ],
        action: {
            id: "unD7wro3qPm",
            name: i18n.t("Action"),
            fields: [
                {
                    id: "HQxzVwKedKu",
                    name: i18n.t("Title"),
                    type: "TEXT",
                    showAsColumn: true
                },
                {
                    id: "GlvCtGIytIz",
                    name: i18n.t("Description"),
                    type: "LONG_TEXT"
                },
                {
                    id: "jFjnkx49Lg3",
                    name: i18n.t("Start Date"),
                    type: "DATE",
                    showAsColumn: true

                },
                {
                    id: "BYCbHJ46BOr",
                    name: i18n.t("End Date"),
                    type: "DATE",
                    showAsColumn: true
                },
                {
                    id: "G3aWsZW2MpV",
                    name: i18n.t("Responsible Person"),
                    type: "TEXT",
                    showAsColumn: true
                },
                {
                    id: "Ax6bWbKn46e",
                    name: i18n.t("Designation"),
                    type: "TEXT"
                },
            ],
            parent: {
                from: "JJaKjcOBapi",
                type: "programStage",
                name: "Solution to Action",
                id: solutionToAction
            },
            statusConfig: {
                name: i18n.t("Action Status"),
                fields: [
                    {
                        name: i18n.t("Action Status"),
                        type: "DATE",
                        id: "f8JYVWLC7rE"
                    },
                    {
                        name: i18n.t("Review Date"),
                        type: "DATE",
                        id: "nodiP54ocf5"
                    },
                    {
                        name: i18n.t("Remarks / Comment"),
                        type: "LONG_TEXT",
                        id: "FnengvwgsQv"
                    },
                ],
                id: "cBiAEANcXAj"
            },

        }
    }
}



