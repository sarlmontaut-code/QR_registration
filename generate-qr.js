const QRCode = require('qrcode');
const path = require('path');

// To let the user's phone access the server, you need a public URL.
// If you use ngrok, replace this with your ngrok URL (ex: https://abc-123.ngrok.io)
// For local testing on the same Wi-Fi, you can use your local IP (ex: http://192.168.1.50:3000)
const URL_TO_ENCODE = process.argv[2] || 'http://localhost:3000';
const OUTPUT_FILE = path.join(__dirname, 'registration-qr-code.png');

QRCode.toFile(OUTPUT_FILE, URL_TO_ENCODE, {
    color: {
        dark: '#2563eb',  // Blue
        light: '#ffffff'  // White background
    },
    width: 500
}, function (err) {
    if (err) throw err;
    console.log(`✅ QR Code généré avec succès !`);
    console.log(`🔗 Lien vers le formulaire : ${URL_TO_ENCODE}`);
    console.log(`📁 Image sauvegardée dans : ${OUTPUT_FILE}`);
});
