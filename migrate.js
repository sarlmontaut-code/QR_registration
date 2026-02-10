require('dotenv').config();
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, 'clients.xlsx');

const clientSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    age: Number,
    phone: String,
    registrationDate: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);

async function migrate() {
    if (!fs.existsSync(EXCEL_FILE)) {
        console.log('Aucun fichier Excel trouvé pour la migration.');
        process.exit(0);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB pour la migration.');

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_FILE);
        const sheet = workbook.getWorksheet('Clients');

        if (!sheet) {
            console.log('Feuille "Clients" non trouvée.');
            process.exit(0);
        }

        const clients = [];
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            clients.push({
                lastName: row.getCell(1).value,
                firstName: row.getCell(2).value,
                age: row.getCell(3).value,
                phone: row.getCell(4).value,
                registrationDate: new Date(row.getCell(5).value) || new Date()
            });
        });

        if (clients.length > 0) {
            await Client.insertMany(clients);
            console.log(`${clients.length} clients migrés avec succès !`);
        } else {
            console.log('Aucune donnée à migrer.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Erreur migration:', error);
        process.exit(1);
    }
}

migrate();
