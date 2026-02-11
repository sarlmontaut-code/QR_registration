require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
console.log('⏳ Tentative de connexion à MongoDB...');
if (!process.env.MONGODB_URI) {
    console.error('❌ ERREUR: La variable MONGODB_URI n\'est pas définie sur Render !');
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connecté à MongoDB avec succès'))
    .catch(err => {
        console.error('❌ Erreur de connexion MongoDB:', err.message);
        console.log('👉 Vérifiez que vous avez bien ajouté l\'IP 0.0.0.0/0 dans MongoDB Atlas > Network Access');
    });

// Define Client Schema
const clientSchema = new mongoose.Schema({
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    age: Number,
    phone: String,
    registrationDate: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);

app.use(express.json());
app.use(express.static('public'));

// Route for registration
app.post('/register', async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Tentative d'enregistrement :`, req.body);
    try {
        const { lastName, firstName, age, phone } = req.body;
        if (!lastName || !firstName) {
            return res.status(400).send('Données manquantes');
        }

        const newClient = new Client({
            lastName,
            firstName,
            age,
            phone
        });

        await newClient.save();
        console.log(`✅ Succès : ${firstName} ${lastName}`);
        res.status(200).send('Success');
    } catch (error) {
        console.error('❌ ERREUR BACKEND:', error.message);
        res.status(500).send('Error: ' + error.message);
    }
});

// Route to export data to Excel - Renamed for security
const EXPORT_PATH = process.env.SECRET_EXPORT_PATH || '/export-valeurs-clients-75';
app.get(EXPORT_PATH, async (req, res) => {
    try {
        const clients = await Client.find().sort({ registrationDate: -1 });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Clients');

        sheet.columns = [
            { header: 'Nom', key: 'lastName', width: 20 },
            { header: 'Prénom', key: 'firstName', width: 20 },
            { header: 'Âge', key: 'age', width: 10 },
            { header: 'Téléphone', key: 'phone', width: 20 },
            { header: 'Date d\'inscription', key: 'date', width: 25 }
        ];

        clients.forEach(client => {
            sheet.addRow({
                lastName: client.lastName,
                firstName: client.firstName,
                age: client.age,
                phone: client.phone,
                date: client.registrationDate.toLocaleString('fr-FR')
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=clients.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('❌ Erreur export:', error);
        res.status(500).send('Erreur lors de l\'export');
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur port ${PORT}`);
});
