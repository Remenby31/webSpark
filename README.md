# Projet Infrastructures pour le Big Data

## 1) Infrastructure d’hébergement
- **Objectif**: Implanter une infrastructure capable d'héberger des machines virtuelles pour exécuter des applications Big Data.
- **Fonctionnalités clés**:
  - Déploiement de l'infrastructure avec un nombre fixe de machines virtuelles.
  - Possibilité d'extension en ajoutant des machines virtuelles selon les besoins.
  - Scripts pour le déploiement et le démontage automatique de l'infrastructure.

## 2) Déploiement de Spark sur votre cluster de VMs
- **Tâche principale**: Installer et configurer Spark sur un cluster de VMs, intégrant HDFS comme système de fichiers.
- **Configuration**: Mode cluster avec plusieurs datanodes pour une gestion efficace des données.

## 3) Interface de votre BDaaS
- **But**: Développer un portail web pour faciliter l'accès et l'utilisation du service BDaaS.
- **Fonctionnalités de l'interface**:
  1. **Chargement de données**: Permettre aux utilisateurs de télécharger des données vers HDFS via l'interface, en spécifiant un chemin.
  2. **Téléchargement de programmes Big Data**: Offrir la possibilité d'uploader des programmes (ex. un fichier JAR pour Java) pour les utiliser dans des jobs ultérieurs.
  3. **Exécution d'applications Big Data**: Permettre aux utilisateurs de sélectionner le programme souhaité, de spécifier les fichiers d'entrée/sortie dans HDFS, et de télécharger les résultats en dehors de HDFS.