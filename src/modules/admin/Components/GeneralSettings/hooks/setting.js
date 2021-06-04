import {useSetting} from "@dhis2/app-service-datastore";
import {useState} from "react";


export default function useSATSetting(key = '', {onSaveComplete, onError}) {
    const [error, setError] = useState();
    const [value, {set}] = useSetting(key, {global: true})
    const [saving, setSaving] = useState();

    async function setNewValue(newValue) {
        if (newValue !== value) {
            try {
                setSaving(true);
                await set(newValue);
                setSaving(false);
                if (onSaveComplete) {
                    onSaveComplete();
                }
            } catch (e) {
                setError(e);
                if (onError) {
                    onError(e);
                }
            }
        }
    }

    async function clearValue(){
        try {
            setSaving(true);
            await set(undefined);
            setSaving(false);
        } catch (e) {
            setError(e);
            if (onError) {
                onError(e);
            }
        }
    }

    return {saving, setting: value, error, setSetting: setNewValue, clearValue}
}

