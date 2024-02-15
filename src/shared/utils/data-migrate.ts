import { Event, TrackedEntity } from '../types/dhis2'
import { LinkageConfig } from '../schemas/config'
import { TrackedEntityInstance } from '@hisptz/dhis2-utils'

export interface DataMigrationConfig {
    parent: TrackedEntity | Event;
    children: TrackedEntityInstance[] | Event[];
    linkageConfig: LinkageConfig;
    childrenAreEvents?: boolean;

}

const oldLinkages = ['prX0q7amAni', 'Y4CIGFwWYJD', 'kBkyDytdOmC', 'Hi3IjyMXzeW']

export function migrateData ({
                                 parent,
                                 children,
                                 linkageConfig,
                                 childrenAreEvents
                             }: DataMigrationConfig): Event[] | TrackedEntity[] {
    if (childrenAreEvents) {
        const linkingDataElement = {
            dataElement: linkageConfig.dataElement,
            value: ((parent as Event).event) ?? (parent as TrackedEntity).trackedEntity
        }
        return (children as Event[]).map((child: Event) => {
            const dataValues = [...child.dataValues].filter((dv) => !oldLinkages.includes(dv.dataElement))
            dataValues.push(linkingDataElement as any)
            return {
                ...child,
                dataValues
            }
        })
    }
    const linkingTeiAttribute = {
        attribute: linkageConfig.trackedEntityAttribute,
        value: ((parent as TrackedEntity).trackedEntity) ?? (parent as Event).event
    }
    return (children as TrackedEntityInstance[]).map((child: any) => {
        const attributes = [...child.attributes].filter((dv) => !oldLinkages.includes(dv.attribute))
        attributes.push(linkingTeiAttribute as any)
        return {
            ...child,
            attributes
        }
    })

}
