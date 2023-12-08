// Variables globales result
var result = null;
var executed = false;

document.getElementById('dataUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var dataFile = document.getElementById('dataFile').files[0];
    var formData = new FormData();
    formData.append('dataFile', dataFile);

    fetch('http://localhost:3000/uploadData', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('appUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var appFile = document.getElementById('appFile').files[0];
    var formData = new FormData();
    formData.append('appFile', appFile);

    fetch('http://localhost:3000/uploadApp', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});

function runCode() {
    fetch('http://localhost:3000/run', {
        method: 'POST'
        // Vous pouvez ajouter des headers ou un corps à la requête si nécessaire
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        executed = true;
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));


    // On check output toutes les 2 secondes jusqua ce que result ne soit plus null
    var interval = setInterval(function() {
        checkOutput();
        if (result != null) {
            clearInterval(interval);
        }
    }, 2000);

}

// Ajout d'un écouteur d'événements pour le bouton d'exécution
document.getElementById('runForm').addEventListener('submit', function(e) {
    e.preventDefault();
    runCode();
});

function checkOutput() {
    fetch('http://localhost:3000/getOutput')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Lire le corps de la réponse une seule fois
    })
    .then(text => {
        document.getElementById('outputResult').innerText = text;
    })
    .catch(error => {
        if (!executed) {
            document.getElementById('outputResult').innerText = 'Vous devez exécuter le code avant de pouvoir voir le résultat.';
        } else {
            document.getElementById('outputResult').innerText = 'Chargement en cours...';
        }
    });
}

function downloadOutput() {
    fetch('http://localhost:3000/getOutput')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob(); // Convertit la réponse en Blob
    })
    .then(blob => {
        // Crée un lien et déclenche le téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'output.txt'; // Nom du fichier à télécharger
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    })
    .catch(error => {
        console.error('Download failed:', error);
    });
}




