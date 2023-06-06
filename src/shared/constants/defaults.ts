import {Config} from "../schemas/config";
import {PeriodTypeEnum, TrackedEntityType, uid} from "@hisptz/dhis2-utils";


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
        },
        {
            id: "pK995DXvyET",
            name: EntityTypes.ACTION
        }
    ]
}

export function generateBasicTemplate({orgUnitLevel}: {
    orgUnitLevel: string,
}): Config {
    return {
        id: uid(),
        name: "Basic Activity Template",
        general: {
            orgUnit: {
                planning: orgUnitLevel
            },
            period: {
                planning: PeriodTypeEnum.MONTHLY,
                tracking: PeriodTypeEnum.DAILY
            }
        },
        categories: [
            {
                id: uid(),
                name: "Category",
                fields: [
                    {
                        name: "Title",
                        id: uid(),
                        type: "TEXT",
                        mandatory: true,
                    },
                    {
                        name: "About",
                        id: uid(),
                        type: "LONG_TEXT",
                        mandatory: false,
                    },
                ]
            }
        ],
        action: {
            id: uid(),
            name: "Activity",
            fields: [
                {
                    name: "Name",
                    type: "TEXT",
                    mandatory: true,
                    id: uid(),
                },
                {
                    name: "Description",
                    type: "LONG_TEXT",
                    mandatory: true,
                    id: uid(),
                },
                {
                    name: "Start Date",
                    type: "DATE",
                    mandatory: true,
                    id: uid(),
                },
                {
                    name: "End Date",
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
