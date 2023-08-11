import { saveAs } from 'file-saver'

export async function downloadFile (type: 'xlsx' | 'json' | 'csv', data: any[], options?: { filename?: string }) {
    if (type === 'json') {
        saveAs(
            new File([JSON.stringify(data)] as any, 'data.json', {
                type: 'json',
            }),
            `${options?.filename ?? 'data'}.json`
        )
    } else if (type === 'xlsx') {
        const excel = await import('xlsx')
        const workbook = excel.utils.book_new()
        const worksheet = excel.utils.json_to_sheet(data)
        excel.utils.book_append_sheet(workbook, worksheet, 'data')
        excel.writeFile(workbook, `${options?.filename ?? 'data'}.xlsx`)
    } else if (type === 'csv') {
        const excel = await import('xlsx')
        const worksheet = excel.utils.json_to_sheet(data)
        const csvData = excel.utils.sheet_to_csv(worksheet)
        saveAs(new File([csvData], 'data.csv', {
            type: 'csv'
        }), `${options?.filename ?? data}.csv`)
    }
}
