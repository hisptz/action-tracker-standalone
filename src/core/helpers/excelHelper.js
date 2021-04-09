import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
export async function exportAsExcelFile(json, excelFileName) {
    return new Promise((resolve, reject) => {
      try {
        let worksheet = XLSX.utils.json_to_sheet(json);
    
        const workbook = {
          Sheets: { data: worksheet },
          SheetNames: ['data'],
        };
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        resolve();
        saveAsExcelFile(excelBuffer, excelFileName);
      } catch (error) {
          console.log(error);
        reject(error);
      }
    });
  }
function saveAsExcelFile(buffer, fileName) {
    try {
      const data = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
      );
    } catch (e) {
      throw e;
    }
  }