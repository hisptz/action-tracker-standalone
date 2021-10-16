import {TransferOption} from "@dhis2/analytics/build/cjs/components/TransferOption";
import i18n from "@dhis2/d2-i18n";
import {InputField, SingleSelectField, SingleSelectOption, Tab, TabBar, Transfer,} from "@dhis2/ui";
import {Period} from "@iapps/period-utilities";
import PeriodIcon from "@material-ui/icons/AccessTime";
import {filter, find, head, isEmpty} from "lodash";
import PropTypes from "prop-types";
import React, {useMemo, useState} from "react";
import {CalendarTypes} from "./constants/calendar";
import {PeriodCategories} from "./constants/period";
import './styles/styles.css'

export default function CalendarSpecificPeriodDimension({
                                                            excludedPeriodTypes,
                                                            calendar,
                                                            onSelect,
                                                            selectedPeriods,
                                                        }) {
    const periodInstance = new Period().setCalendar(calendar);
    periodInstance.setPreferences({allowFuturePeriods: true});

    const {_periodType} = periodInstance.get() ?? {};
    const {_periodTypes} = _periodType ?? {};
    const filteredPeriodTypes = filter(_periodTypes, ({id}) => !excludedPeriodTypes.includes(id))
    const relativePeriodTypes = filter(filteredPeriodTypes, ({id}) =>
        id.toLowerCase().match(RegExp("relative".toLowerCase()))
    );
    const fixedPeriodTypes = filter(
        filteredPeriodTypes,
        ({id}) => !id.toLowerCase().match(RegExp("relative".toLowerCase()))
    );

    const [selectedRelativePeriodType, setSelectedRelativePeriodType] = useState(
        head(relativePeriodTypes)?.id
    );
    const [selectedFixedPeriodType, setSelectedFixedPeriodType] = useState(
        head(fixedPeriodTypes)?.id
    );

    const [year, setYear] = useState(2021); //TODO: Fix getting the current year from the period utilities

    const tabs = useMemo(() => {
        const tabs = []
        if (!isEmpty(relativePeriodTypes)) {
            tabs.push(find(Object.values(PeriodCategories), ['key', 'relative']))
        }
        if (!isEmpty(fixedPeriodTypes)) {
            tabs.push(find(Object.values(PeriodCategories), ['key', 'fixed']))
        }

        return tabs
    }, [])

    const [selectedPeriodCategory, setSelectedPeriodCategory] = useState(
        head(tabs)
    );

    const periods = useMemo(() => {
        if (selectedPeriodCategory) {
            if (selectedRelativePeriodType) {
                if (selectedPeriodCategory.key === PeriodCategories.RELATIVE.key) {
                    return new Period()
                        .setCalendar(calendar)
                        .setYear(year)
                        .setType(selectedRelativePeriodType)
                        .get()
                        .list();
                }
            }
            if (selectedFixedPeriodType) {
                if (selectedPeriodCategory.key === PeriodCategories.FIXED.key) {
                    return new Period()
                        .setCalendar(calendar)
                        .setYear(year)
                        .setType(selectedFixedPeriodType)
                        .get()
                        .list();
                }
            }
        }
        return []
    }, [
        selectedPeriodCategory,
        selectedRelativePeriodType,
        selectedFixedPeriodType,
        year,
    ]);

    return (
        <div className="column center align-items-center w-100">
            <Transfer
                selected={selectedPeriods}
                selectedWidth={"400px"}
                optionsWidth={"400px"}
                height={"500px"}
                leftHeader={
                    <div className="column pb-8">
                        <TabBar fixed>
                            {tabs?.map((periodCategory) => (
                                <Tab
                                    dataTest={`${periodCategory.key}-tab`}
                                    onClick={() => {
                                        setSelectedPeriodCategory(periodCategory);
                                    }}
                                    selected={selectedPeriodCategory.key === periodCategory.key}
                                    key={`${periodCategory.key}-tab`}
                                >
                                    {periodCategory.name}
                                </Tab>
                            ))}
                        </TabBar>
                        {selectedPeriodCategory?.key === "relative" ? (
                            <div className="pt-8 pb-8">
                                <SingleSelectField
                                    dense
                                    selected={selectedRelativePeriodType}
                                    onChange={({selected}) =>
                                        setSelectedRelativePeriodType(selected)
                                    }
                                    label={i18n.t("Period Type")}
                                >
                                    {relativePeriodTypes?.map((periodType) => (
                                        <SingleSelectOption
                                            key={periodType?.id}
                                            label={periodType?.name}
                                            value={periodType?.id}
                                        />
                                    ))}
                                </SingleSelectField>
                            </div>
                        ) : (
                            <div className="row space-between align-items-center w-100 pt-8 pb-8">
                                <div className="w-60">
                                    <SingleSelectField
                                        dense
                                        selected={selectedFixedPeriodType}
                                        onChange={({selected}) =>
                                            setSelectedFixedPeriodType(selected)
                                        }
                                        label={i18n.t("Period Type")}
                                    >
                                        {fixedPeriodTypes?.map((periodType) => (
                                            <SingleSelectOption
                                                key={periodType?.id}
                                                label={periodType?.name}
                                                value={periodType?.id}
                                            />
                                        ))}
                                    </SingleSelectField>
                                </div>
                                <div className="w-40">
                                    <InputField
                                        name={"year"}
                                        dense
                                        label={i18n.t("Year")}
                                        type={"number"}
                                        value={year}
                                        onChange={({value}) => setYear(value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                }
                options={[...periods, ...selectedPeriods]?.map((period) => ({
                    label: period.name,
                    value: period,
                }))}
                renderOption={(options) => (
                    <TransferOption
                        icon={<PeriodIcon style={{fontSize: 12}}/>}
                        {...options}
                    />
                )}
                onChange={({selected}) => {
                    onSelect({
                        items: selected,
                    });
                }}
            />
        </div>
    );
}

CalendarSpecificPeriodDimension.propTypes = {
    calendar: PropTypes.oneOf(Object.values(CalendarTypes)).isRequired,
    selectedPeriods: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string)
};
