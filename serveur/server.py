from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)


# Configuration pour le téléchargement de fichiers
UPLOAD_FOLDER_DATA = '../data'
UPLOAD_FOLDER_APP = '../app'
OUTPUT_FOLDER = '../output'
ALLOWED_EXTENSIONS = set(['txt', 'csv', 'png', 'jpg', 'jpeg', 'gif', 'java', 'csv'])

app.config['UPLOAD_FOLDER_DATA'] = UPLOAD_FOLDER_DATA
app.config['UPLOAD_FOLDER_APP'] = UPLOAD_FOLDER_APP

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# === Upload ===

@app.route('/uploadData', methods=['POST'])
def upload_data():
    if 'dataFile' not in request.files:
        return jsonify(message='No files were uploaded.'), 400

    file = request.files['dataFile']

    if file.filename == '':
        return jsonify(message='No selected file'), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER_DATA'], filename))
        return jsonify(message='Fichier de données reçu.')
    
    

    

@app.route('/uploadApp', methods=['POST'])
def upload_app():
    if 'appFile' not in request.files:
        return jsonify(message='No files were uploaded.'), 400

    file = request.files['appFile']

    if file.filename == '':
        return jsonify(message='No selected file'), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER_APP'], filename))
        return jsonify(message='Fichier d\'application reçu.')

# === Run ===

@app.route('/run', methods=['POST'])
def run_code():
    # Extraire les noms des fichiers
    data_file_name = request.form.get('dataFileName')
    app_file_name = request.form.get('appFileName')

    if not data_file_name or not app_file_name:
        return jsonify(message="Noms de fichiers manquants."), 400
    
    print("Enregistrement des fichiers sur hdfs...")
    # TODO: Enregistrer les fichier sur hdfs
    #os.system('hdfs dfs -put ../data/' + filename + ' /data')
    #os.system('hdfs dfs -put ../app/' + filename + ' /app')
    
    #TODO:Clean output folder
    print("Nettoyage du dossier de sortie...")
    #os.system('hdfs dfs -rm /output/output.txt')

    #TODO: Lancer le code java
    print("Compilation du code...")
    #os.system('javac ../app/' + app_file_name)
    print("Exécution du code...")
    #os.system('java -cp ../app/ ' + app_file_name + ' ' + data_file_name)

    return jsonify(message='Code exécuté avec les noms de fichiers ' + data_file_name + ' et ' + app_file_name + '.')

# === Get ===

@app.route('/getOutput', methods=['GET'])
def get_output():
    try:
        #Version avec hdfs
        """
        os.system('hdfs dfs -get /output/output.txt ../output')
        with open(os.path.join(OUTPUT_FOLDER, 'output.txt'), 'r') as f:
            data = f.read()
            return data
        """
        #Version sans hdfs
        with open(os.path.join(OUTPUT_FOLDER, 'output.txt'), 'r') as f:
            data = f.read()
            return data
    except IOError:
        return 'Erreur: Le fichier n\'existe pas', 404

@app.route('/get-files-data', methods=['GET'])
def get_files_data():
    directory = '../data'
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    return jsonify(files)

@app.route('/get-files-app', methods=['GET'])
def get_files_app():
    directory = '../app'
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    return jsonify(files)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
