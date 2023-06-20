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

    const categoryId = uid();
    return {
        id: uid(),
        name: i18n.t("Basic Activity Template"),
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
                id: categoryId,
                name: i18n.t("Category"),
                fields: [
                    {
                        name: i18n.t("Title"),
                        id: uid(),
                        type: "TEXT",
                        mandatory: true,
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
