const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcel() {
    const workbook = new ExcelJS.Workbook();
    const EXCEL_FILE = path.join(__dirname, 'clients.xlsx');
    try {
        await workbook.xlsx.readFile(EXCEL_FILE);
        const sheet = workbook.getWorksheet('Clients');
        console.log(`Nombre de lignes : ${sheet.actualRowCount}`);
        sheet.eachRow((row, rowNumber) => {
            console.log(`Row ${rowNumber}: ${JSON.stringify(row.values)}`);
        });
    } catch (err) {
        console.error('Erreur lecture :', err);
    }
}

checkExcel();
