import React, { useMemo, useState } from "react";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import { useFormContext, useWatch } from "react-hook-form";
import { PeriodTypeCategory, PeriodUtility } from "@hisptz/dhis2-utils";
import { useUpdateEffect } from "usehooks-ts";
import { type Config } from "../../../../../shared/schemas/config";
import { InputField } from "@dhis2/ui";
import { generateFixedPeriods } from "@dhis2/multi-calendar-dates";
import { useCalendar } from "../../../../../shared/hooks/calendar";

const namespace = `general.period`;

export function TrackingConfig() {
	const { setValue } = useFormContext();
	const [planning, tracking] = useWatch({
		name: [`${namespace}.planning`, `${namespace}.tracking`],
	});

	const trackingPeriods = useMemo(() => {
		const periodUtility = new PeriodUtility()
			.setYear(new Date().getFullYear())
			.setCategory(PeriodTypeCategory.FIXED)
			.setPreference({ allowFuturePeriods: true });
		const planningPeriodType = periodUtility.getPeriodType(planning);
		if (!planningPeriodType) {
			return [];
		}
		return periodUtility.periodTypes
			.filter(
				({ config }) =>
					(config.rank as number) <
						(planningPeriodType.config.rank as number) ||
					config.id === planningPeriodType.config.id,
			)
			?.map(({ config }) => ({
				label: config.name,
				value: config.id,
			}));
	}, [planning]);

	useUpdateEffect(() => {
		if (planning) {
			const periodUtility = new PeriodUtility()
				.setYear(new Date().getFullYear())
				.setCategory(PeriodTypeCategory.FIXED);
			const planningPeriodType = periodUtility.getPeriodType(planning);
			const trackingPeriodType = periodUtility.getPeriodType(tracking);
			if (planningPeriodType && trackingPeriodType) {
				if (
					(planningPeriodType?.config.rank as number) <
					(trackingPeriodType.config.rank as number)
				) {
					setValue(`${namespace}.tracking`, undefined);
				}
			}
		}
	}, [planning]);

	return (
		<div id="tracking-frequency-field-container">
			<RHFSingleSelectField
				required
				validations={{
					required: {
						value: true,
						message: i18n.t("Tracking frequency is required"),
					},
				}}
				label={i18n.t("Tracking frequency")}
				options={trackingPeriods}
				name={`${namespace}.tracking`}
			/>
		</div>
	);
}

export function DefaultPeriod() {
	const [year, setYear] = useState(new Date().getFullYear());
	const { setValue } = useFormContext<Config>();
	const calendar = useCalendar();

	const [planning, defaultPeriod] = useWatch({
		name: [`${namespace}.planning`, `${namespace}.defaultPeriod`],
	});

	const periods = useMemo(() => {
		if (!planning) return [];
		const periods = generateFixedPeriods({
			calendar,
			periodType: planning,
			year,
		});
		return (
			periods.map(({ name, id }) => ({
				label: name,
				value: id,
			})) ?? []
		);
	}, [planning, year]);

	useUpdateEffect(() => {
		if (planning) {
			const periods = generateFixedPeriods({
				calendar,
				periodType: planning,
				year,
			});
			if (periods) {
				if (periods.find(({ id }) => id === defaultPeriod)) {
					setValue(`${namespace}.defaultPeriod`, undefined);
				}
			}
		}
	}, [planning]);

	return (
		<div className="row gap-16 space-between">
			<div id="default-period-field-container" className="flex-1">
				<RHFSingleSelectField
					label={i18n.t("Default period")}
					options={periods}
					name={`${namespace}.defaultPeriod`}
				/>
			</div>
			<InputField
				dataTest="default-period-year-selector"
				name="year"
				min={`2000`}
				label={i18n.t("Year")}
				value={year.toString()}
				onChange={({ value }: { value?: string; name?: string }) => {
					if (value) {
						setYear(parseInt(value));
					}
				}}
				type="number"
			/>
		</div>
	);
}

export function PeriodConfig() {
	const periodTypes = useMemo(() => {
		const periodUtility = new PeriodUtility()
			.setPreference({ allowFuturePeriods: true })
			.setYear(new Date().getFullYear())
			.setCategory(PeriodTypeCategory.FIXED);
		return periodUtility.periodTypes?.map(({ config }) => ({
			label: config.name,
			value: config.id,
		}));
	}, []);

	return (
		<div className="column gap-16">
			<div id="planning-frequency-field-container">
				<RHFSingleSelectField
					required
					validations={{
						required: {
							value: true,
							message: i18n.t("Planning frequency is required"),
						},
					}}
					label={i18n.t("Planning frequency")}
					options={periodTypes}
					name={`${namespace}.planning`}
				/>
			</div>
			<TrackingConfig />
			<DefaultPeriod />
		</div>
	);
}
