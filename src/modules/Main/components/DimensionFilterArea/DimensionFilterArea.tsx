import React from "react";
import {Card} from "@dhis2/ui"
import {DimensionSelection} from "./components/DimensionSelection";
import i18n from '@dhis2/d2-i18n';
import classes from "./DimensionFilterArea.module.css";
import {useDimensions} from "../../../../shared/hooks/dimensions";
import {useBoolean} from "usehooks-ts";
import {compact, head} from "lodash";
import {OrgUnitSelectorModal, PeriodSelectorModal} from "@hisptz/dhis2-ui";
import {OrgUnitSelection} from "@hisptz/dhis2-utils";

export function DimensionFilterArea() {
    const {orgUnit, setOrgUnit, period, setPeriod, loading} = useDimensions();
    const {value: orgUnitHidden, setTrue: hideOrgUnit, setFalse: showOrgUnit} = useBoolean(true);
    const {value: periodHidden, setTrue: hidePeriod, setFalse: showPeriod} = useBoolean(true);

    return (
        <div className={classes['selection-card']}>
            <Card>
                <div className="row space-between align-items-center pl-16 pr-16">
                    <div className="row align-items-center">
                        <OrgUnitSelectorModal
                            position="middle"
                            singleSelection
                            value={{
                                orgUnits: compact([
                                    orgUnit
                                ])
                            }}
                            onClose={hideOrgUnit}
                            hide={orgUnitHidden}
                            onUpdate={({orgUnits}: OrgUnitSelection) => {
                                const value = head(orgUnits)?.id;
                                if (value) {
                                    setOrgUnit(value)
                                    hideOrgUnit()
                                }
                            }}
                        />
                        <DimensionSelection
                            loading={loading}
                            onClick={() => {
                                if (!loading) {
                                    showOrgUnit()
                                }
                            }}
                            selectedItems={compact([orgUnit])}
                            title={i18n.t("Select organisation unit")}
                        />
                        <PeriodSelectorModal
                            singleSelection
                            enablePeriodSelector
                            position="middle"
                            selectedPeriods={compact([period?.id])}
                            onClose={hidePeriod}
                            hide={periodHidden} onUpdate={(periods) => {
                            const value = head(periods);
                            if (value) {
                                if (typeof value === "string") {
                                    setPeriod(value);
                                    hidePeriod()
                                }
                            }
                        }}/>
                        <DimensionSelection
                            onClick={showPeriod}
                            selectedItems={compact([period])}
                            title={i18n.t("Select period")}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}
