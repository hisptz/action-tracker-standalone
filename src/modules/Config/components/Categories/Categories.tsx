import React from "react";
import i18n from "@dhis2/d2-i18n";
import {Divider} from "@dhis2/ui";
import {useWatch} from "react-hook-form";
import {CategoryArea} from "./components/CategoryArea";

export function Categories() {

    const categories = useWatch({
        name: "categories"
    });

    return (
        <div className="column gap-32">
            <div>
                <h2 className="m-0">{i18n.t("Categories")}</h2>
                <Divider margin="0"/>
            </div>
            <div style={{maxWidth: 800}} className="column gap-32">
                <div className="gap-32 column">
                    {
                        categories?.map((_: any, index: number) => (
                            <CategoryArea key={`${index}-category`} index={index}/>))
                    }
                </div>
            </div>
        </div>
    )
}
