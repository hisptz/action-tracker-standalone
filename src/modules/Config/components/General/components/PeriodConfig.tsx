import React, {useMemo, useState} from "react";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import i18n from '@dhis2/d2-i18n';
import {useFormContext, useWatch} from "react-hook-form";
import {PeriodTypeCategory, PeriodUtility} from "@hisptz/dhis2-utils";
import {useUpdateEffect} from "usehooks-ts";
import {Config} from "../../../../../shared/schemas/config";
import {InputField} from "@dhis2/ui"

const namespace = `general.period`;

export function TrackingConfig() {
    const {setValue} = useFormContext()
    const [planning, tracking] = useWatch({
        name: [`${namespace}.planning`, `${namespace}.tracking`],
    });

    const trackingPeriods = useMemo(() => {
        const periodUtility = new PeriodUtility().setYear(new Date().getFullYear()).setCategory(PeriodTypeCategory.FIXED);
        const planningPeriodType = periodUtility.getPeriodType(planning);
        if (!planningPeriodType) {
            return []
        }
        return periodUtility.periodTypes.filter(({config}) => ((config.rank as number) < (planningPeriodType.config.rank as number) || config.rank === planningPeriodType.config.rank))?.map(({config}) => ({
            label: config.name,
            value: config.id
        }))
    }, [planning]);

    useUpdateEffect(() => {
        if (planning) {
            const periodUtility = new PeriodUtility().setYear(new Date().getFullYear()).setCategory(PeriodTypeCategory.FIXED);
            const planningPeriodType = periodUtility.getPeriodType(planning);
            const trackingPeriodType = periodUtility.getPeriodType(tracking);
            if (planningPeriodType && trackingPeriodType) {
                if ((planningPeriodType?.config.rank as number) < (trackingPeriodType.config.rank as number)) {
                    setValue(`${namespace}.tracking`, undefined)
                }
            }
        }
    }, [planning])

    return (
        <RHFSingleSelectField
            required
            validations={{
                required: {
                    value: true,
                    message: i18n.t("Tracking frequency is required")
                }
            }}
            label={i18n.t("Tracking frequency")}
            options={trackingPeriods}
            name={`${namespace}.tracking`}
        />
    )
}

export function DefaultPeriod() {
    const [year, setYear] = useState(new Date().getFullYear())
    const {setValue} = useFormContext<Config>()

    const [planning, defaultPeriod] = useWatch({
        name: [`${namespace}.planning`, `${namespace}.defaultPeriod`],
    })

    const periods = useMemo(() => {
        if (!planning) return [];
        const periodUtility = new PeriodUtility().setYear(year).setCategory(PeriodTypeCategory.FIXED);
        const periodType = periodUtility.getPeriodType(planning);
        return periodType?.periods.map(({name, id}) => ({
            label: name,
            value: id
        })) ?? []
    }, [planning, year])

    useUpdateEffect(() => {
        if (planning) {
            const periodUtility = new PeriodUtility().setYear(new Date().getFullYear()).setCategory(PeriodTypeCategory.FIXED);
            const periodType = periodUtility.getPeriodType(planning);
            if (periodType) {
                if (!periodType.periods.find(({id}) => id === defaultPeriod)) {
                    setValue(`${namespace}.defaultPeriod`, undefined)
                }
            }
        }
    }, [planning])

    return (
        <div className="row gap-16 space-between">
            <div className="flex-1">
                <RHFSingleSelectField
                    label={i18n.t("Default period")}
                    options={periods}
                    name={`${namespace}.default`}
                />
            </div>
            <InputField
                name="year"
                min={`2000`}
                max={(new Date().getFullYear() + 1).toString()}
                label={i18n.t("Year")}
                value={year.toString()}
                onChange={({value}: { value: string }) => setYear(parseInt(value))} type="number"
            />
        </div>
    )

}

export function PeriodConfig() {
    const periodTypes = useMemo(() => {
        const periodUtility = new PeriodUtility().setYear(new Date().getFullYear()).setCategory(PeriodTypeCategory.FIXED);
        return periodUtility.periodTypes?.map(({config}) => ({label: config.name, value: config.id}))
    }, []);

    return (
        <div className="column gap-16">
            <RHFSingleSelectField
                required
                validations={{
                    required: {
                        value: true,
                        message: i18n.t("Planning frequency is required")
                    }
                }}
                label={i18n.t("Planning frequency")}
                options={periodTypes}
                name={`${namespace}.planning`}
            />
            <TrackingConfig/>
            <DefaultPeriod/>
        </div>
    )

}
