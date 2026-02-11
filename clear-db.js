require('dotenv').config();
const mongoose = require('mongoose');

async function clearDatabase() {
    if (!process.env.MONGODB_URI) {
        console.error('❌ ERREUR: MONGODB_URI n\'est pas définie dans le fichier .env');
        process.exit(1);
    }

    try {
        console.log('⏳ Connexion à MongoDB pour nettoyage...');
        await mongoose.connect(process.env.MONGODB_URI);

        // On récupère le modèle Client (doit correspondre à celui de server.js)
        const clientSchema = new mongoose.Schema({
            lastName: String,
            firstName: String,
            age: Number,
            phone: String,
            registrationDate: Date
        });
        const Client = mongoose.model('Client', clientSchema);

        const count = await Client.countDocuments();
        if (count === 0) {
            console.log('ℹ️ La liste est déjà vide.');
        } else {
            console.log(`⚠️ Suppression de ${count} client(s)...`);
            await Client.deleteMany({});
            console.log('✅ Base de données vidée avec succès !');
        }

    } catch (error) {
        console.error('❌ Erreur lors du nettoyage :', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

clearDatabase();
