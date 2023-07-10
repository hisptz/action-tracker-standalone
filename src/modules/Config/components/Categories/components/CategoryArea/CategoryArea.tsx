import React from "react";
import {useWatch} from "react-hook-form";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import i18n from '@dhis2/d2-i18n';
import {CategoryFields} from "./CategoryFields";

export interface CategoryAreaProps {
    index: number;
}

export function CategoryArea({index}: CategoryAreaProps) {
    const namespace = `categories.${index}`

    const title = useWatch({
        name: `${namespace}.name`
    });

    return (
        <div className="column gap-16">
            <div className="row space-between gap-16">
                <h3 className="m-0">{title}</h3>
            </div>
            <div className="column gap-16">
                <RHFTextInputField required validations={{required: i18n.t("Name is required")}}
                                   name={`${namespace}.name`} label={i18n.t("Name")}/>
                <div className="column gap-8">
                    <span>{i18n.t("Fields")}</span>
                    <CategoryFields namespace={namespace}/>
                </div>
            </div>
        </div>
    )
}
