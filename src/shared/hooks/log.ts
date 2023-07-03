import {useSavedObject} from "@dhis2/app-service-datastore";
import {useCallback} from "react";

export interface Log {
    timestamp?: string;
    message: string;
    details?: any;
    stack?: string;
}

export function useDefaultLog(level: "info" | "error") {
    const [logs, {update}]: any = useSavedObject(level);

    return useCallback(async (log: Log) => {
        await update({
            logs: [...(logs?.logs ?? []), {...log, timestamp: log.timestamp ?? new Date().toISOString()}]
        })
    }, [logs]);
}

export function useLog() {
    const info = useDefaultLog('info') as (log: Log) => void;
    const error = useDefaultLog('error') as (log: Log) => void;

    return {
        info,
        error
    }
}
