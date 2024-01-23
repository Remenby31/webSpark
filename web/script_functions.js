
function runCode() {
    // Récupère les noms de fichiers sélectionnés dans les listes déroulantes
    var selectedDataFileName = document.getElementById('fileListData').value;
    var selectedAppFileName = document.getElementById('fileListApp').value;

    // Vérifiez si les noms de fichiers sont sélectionnés
    if (!selectedDataFileName || !selectedAppFileName) {
        console.error('Veuillez sélectionner les deux fichiers.');
        return;
    }

    // Construit le corps de la requête avec les noms de fichiers
    var formData = new FormData();
    formData.append('dataFileName', selectedDataFileName);
    formData.append('appFileName', selectedAppFileName);

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

    console.log('[info] Demande d\'exécution avec le nom de fichier de données ' + selectedDataFileName + ' et le nom de fichier d\'application ' + selectedAppFileName + '.');
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