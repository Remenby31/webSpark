// Variables globales result
var result = null;
var executed = false;


document.getElementById('dataFile').addEventListener('change', function(e) {
    e.preventDefault();
    if (this.files && this.files[0]) {
        var dataFile = this.files[0];
        var formData = new FormData();
        formData.append('dataFile', dataFile);

        console.log('[info] Envoi du fichier de données ' + dataFile.name + ' au serveur.');

        fetch('http://localhost:3000/uploadData', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        // On met à jour la liste des fichiers de données
        updateAllLists();
    }
});

document.getElementById('refresh-button-data').addEventListener('click', function() {
    updateAllLists();
});

document.getElementById('refresh-button-app').addEventListener('click', function() {
    updateAllLists();
});

document.getElementById('appFile').addEventListener('change', function(e) {
    e.preventDefault();
    if (this.files && this.files[0]) {
        var appFile = this.files[0];
        var formData = new FormData();
        formData.append('appFile', appFile);

        console.log('[info] Envoi du fichier d\'application ' + appFile.name + ' au serveur.');

        fetch('http://localhost:3000/uploadApp', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        // On met à jour la liste des fichiers de données
        updateAllLists();
    }

    
});



function runCode() {
    // Récupère les valeurs sélectionnées dans les listes déroulantes
    var selectedDataFile = document.getElementById('fileListData').value;
    var selectedAppFile = document.getElementById('fileListApp').value;

    // Construit le corps de la requête avec les fichiers sélectionnés
    var formData = new FormData();
    formData.append('dataFile', selectedDataFile);
    formData.append('appFile', selectedAppFile);

    // Envoie la requête au serveur
    fetch('http://localhost:3000/run', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    console.log('[info] Demande d\'éxécution avec le fichier de données ' + selectedDataFile + ' et le fichier d\'application ' + selectedAppFile + '.');

    // On vérifie le résultat toutes les 2 secondes jusqu'à ce que result ne soit plus null
    var interval = setInterval(function() {
        checkOutput();
        // Supposons que `result` est défini quelque part dans votre code.
        // Vous devez définir une condition d'arrêt correcte basée sur votre implémentation spécifique.
        if (result != null) {
            clearInterval(interval);
        }
    }, 2000);

    console.log('[info] Output récupéré.');
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

function updateAllLists() {
    updateFileListData();
    updateFileListApp();
    console.log('[info] Listes mises à jour.');
}

function updateFileListData() {
    fetch('http://localhost:3000/get-files-data')
        .then(response => response.json())
        .then(files => {
            const select = document.getElementById('fileListData');
            select.innerHTML = '';
            files.forEach(file => {
                const option = document.createElement('option');
                option.textContent = file;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

function updateFileListApp() {
    fetch('http://localhost:3000/get-files-app')
        .then(response => response.json())
        .then(files => {
            const select = document.getElementById('fileListApp');
            select.innerHTML = '';
            files.forEach(file => {
                const option = document.createElement('option');
                option.textContent = file;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

// Appel initial pour remplir la liste au chargement de la page

window.onload = updateAllLists();