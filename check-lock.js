const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, 'clients.xlsx');

try {
    const fd = fs.openSync(EXCEL_FILE, 'r+');
    fs.closeSync(fd);
    console.log('✅ Le fichier n\'est pas verrouillé.');
} catch (err) {
    if (err.code === 'EBUSY') {
        console.error('❌ LE FICHIER EST VERROUILLÉ (Probablement ouvert dans Excel).');
    } else {
        console.error('Erreur :', err.code, err.message);
    }
}
