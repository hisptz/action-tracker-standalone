export function generateImportSummaryErrors(importSummary = {}) {
    const status = importSummary?.response?.status;
    const importSummaries = importSummary?.response?.importSummaries;
    if (status === 'SUCCESS') {
        return [];
    } else if (status === 'ERROR') {
        const errors = [];
        for (const summary of importSummaries) {
            if (summary.status === 'ERROR') {
                errors.push(summary?.description)
            }
        }
        return errors;
    }

}

export function onErrorHandler(error, show) {
    const errors = generateImportSummaryErrors(error?.details);
    errors.forEach(error => show({message: error, type: {error: true}}))
}

export function onCompleteHandler(importSummary, show, {message, onUpdate, onClose}) {
    const errors = generateImportSummaryErrors(importSummary);
    if (_.isEmpty(errors)) {
        show({message, type: {success: true}})
        onClose && onUpdate();
        onUpdate && onClose();
    } else {
        errors.forEach(error => show({message: error, type: {error: true}}))
    }
}
