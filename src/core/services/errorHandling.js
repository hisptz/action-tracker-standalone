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
