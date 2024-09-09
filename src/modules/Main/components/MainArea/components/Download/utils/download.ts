import { saveAs } from 'file-saver'

export async function downloadFile (type: 'xlsx' | 'json' | 'csv', data: any[], options?: { filename?: string }) {
    const filename = options?.filename ?? 'data'
    if (type === 'json') {
        saveAs(
            new File([JSON.stringify(data)] as any, ``, {
                type: 'json',
            }),
            `${filename}.json`
        )
    } else if (type === 'xlsx') {
        const excel = await import('xlsx')
        const workbook = excel.utils.book_new()
        const worksheet = excel.utils.json_to_sheet(data)
        excel.utils.book_append_sheet(workbook, worksheet, 'data')
        excel.writeFile(workbook, `${filename}.xlsx`)
    } else if (type === 'csv') {
        const excel = await import('xlsx')
        const worksheet = excel.utils.json_to_sheet(data)
        const csvData = excel.utils.sheet_to_csv(worksheet)
        saveAs(new File([csvData], `${filename}.csv`, {
            type: 'csv'
        }), `${filename}.csv`)
    }
}
