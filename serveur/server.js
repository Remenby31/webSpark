const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

// Activez CORS pour toutes les requêtes
app.use(cors());

app.use(fileUpload());

app.post('/uploadData', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Traitement du fichier de données
    // On enregistre le fichier dans /data
    let dataFile = req.files.dataFile;
    dataFile.mv('../data/' + 'data.' + dataFile.name.split('.').pop());

    res.json({ message: 'Fichier de données reçu.' });

});

app.post('/uploadApp', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Traitement du fichier de données
    // On enregistre le fichier dans /app
    let appFile = req.files.appFile;
    appFile.mv('../app/' + 'app.java');

    res.json({ message: 'Fichier de données reçu.' });

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.post('/run', (req, res) => {
    // Exécution du code
    // On exécute le code Java dans /app
    // On exécute le code Java dans /data
    // On enregistre le fichier dans /app
    res.json({ message: 'Code exécuté.' });
});

app.get('/getOutput', (req, res) => {
    const outputFilePath = path.join(__dirname, '../output/output.txt');

    fs.readFile(outputFilePath, 'utf8', (err, data) => {
        if (err) {
            // Le fichier n'existe pas ou une autre erreur s'est produite
            res.status(404).send('Erreur: Le fichier n\'existe pas');
        } else {
            // Le fichier existe, renvoyer son contenu
            res.send(data);
        }
    });
});