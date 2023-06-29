import {Button, IconAdd24} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React, {useMemo} from "react";
import {useConfiguration} from "../../../../../shared/hooks/config";
import {head} from "lodash";
import {useSearchParams} from "react-router-dom";
import {useBoolean} from "usehooks-ts";
import {Form} from "../../../../../shared/components/Form";

export function AddButton({primary}: { primary?: boolean }) {
    const {loading, config} = useConfiguration();
    const {value: hide, setTrue: onClose, setFalse: onOpen} = useBoolean(true)
    const [searchParams] = useSearchParams();

    const initialCategory = useMemo(() => {
        if (config) {
            return head(config.categories) ?? config.action
        }
    }, [config]);
    const planning = useMemo(() => searchParams.get("type") === "planning", [searchParams]);

    if (!planning) {
        return null;
    }

    return (
        <>
            <Form instanceName={`${initialCategory?.name?.toLowerCase()}`} id={initialCategory?.id as string}
                  type="program" hide={hide} onClose={onClose}/>
            <Button
                primary={primary}
                onClick={onOpen}
                disabled={loading}
                loading={loading}
                icon={<IconAdd24/>}>
                {loading ? i18n.t("Please wait...") : `${i18n.t("Add")} ${initialCategory?.name?.toLowerCase()}`}
            </Button>
        </>
    )
}
