import React from "react"
import i18n from '@dhis2/d2-i18n'

export function Welcome() {
    return (
        <div className="w-100 h-100 column center">
            <h1>{i18n.t("Welcome to the standalone action tracker")}</h1>
        </div>
    )
}
