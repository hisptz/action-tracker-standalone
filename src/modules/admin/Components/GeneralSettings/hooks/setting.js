import {useDataStore} from "@dhis2/app-service-datastore";
import {useState} from "react";


export default function useSetting(key = '', {onSaveComplete, onError}) {
    const [error, setError] = useState();
    const {globalSettings} = useDataStore();
    const [saving, setSaving] = useState();

    async function setNewValue(value) {
        if (value !== globalSettings.get(key)) {
            try {
                setSaving(true);
                await globalSettings.set(key, value);
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
            await globalSettings.set(key, undefined);
            setSaving(false);
        } catch (e) {
            setError(e);
            if (onError) {
                onError(e);
            }
        }
    }

    return {saving, setting: globalSettings.get(key), error, setSetting: setNewValue, clearValue}
}

