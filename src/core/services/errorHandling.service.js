export function generateImportSummaryErrors(importSummary = {}) {
    if (importSummary.response) {
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
    } else {
        const {status, httpStatus} = importSummary || {};
        if (status === 'ERROR') {
            return [httpStatus];
        }
    }

}

export function generateMetadataSummaryErrors(importSummary = {}) {
    if (importSummary.response) {
        const {status, errorReports, httpStatus} = importSummary?.response || {};
        if (status === 'ERROR') {
            if (errorReports) {
                return _.map(errorReports, ({message}) => message);
            } else {
                return [httpStatus];
            }
        } else {
            return [];
        }
    } else {
        const {status, httpStatus} = importSummary;
        if (status === 'ERROR') {
            return [httpStatus];
        }
    }
}

export function onErrorHandler(error, show) {
    const errors = generateImportSummaryErrors(error?.details) || [];
    errors.forEach(error => show({message: error, type: {error: true}}))
}

export function onMetadataErrorHandler(error, show) {
    const errors = generateMetadataSummaryErrors(error?.details);
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

export function onMetadataCompleteHandler(importSummary, show, {message, onUpdate, onClose}) {
    const errors = generateMetadataSummaryErrors(importSummary) || [];
    if (_.isEmpty(errors)) {
        show({message, type: {success: true}})
        onClose && onUpdate();
        onUpdate && onClose();
    } else {
        errors.forEach(error => show({message: error, type: {error: true}}))
    }
}


export function generateErrorAlert(show, error) {
    error && show({message: error?.message || error?.toString(), type: {critical: true}})
}