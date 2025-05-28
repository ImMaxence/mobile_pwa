# 📦 Pipeline de Versioning

Ce repository contient une pipeline de versioning. Ce document vous explique en détail le fonctionnement de cette pipeline : du choix de la version à la création de tags et de releases GitHub, ainsi que l'intégration des commits dans les notes de version.

---

## 👥 Création et Maintenance

Cette pipeline a été créée par **Mateo** et est maintenue par **Mateo** ainsi que **Federico** de l'équipe **Cloud Cyber Security APIHive**. Cette collaboration garantit une gestion centralisée et une maintenance continue, assurant ainsi la stabilité et la sécurité.

---

## 🚀 Fonctionnement de la Pipeline

Cette pipeline est déclenchée automatiquement une fois la Pull Request fusionnée avec succès sur la branche `main`. Le processus de versioning est géré par un fichier spécifique dans le dossier `versioning` nommé `choix_version_type`. Il est essentiel que ce fichier contienne le type de version que vous souhaitez incrémenter :

- `major` (Changements majeurs)
- `minor` (Nouvelles fonctionnalités rétrocompatibles)
- `patch` (Corrections de bugs et mises à jour mineures)

### ✏️ Choix du Type de Version

Avant de lancer la pipeline, vous devez vous assurer que le fichier `versioning/choix_version_type` existe et qu'il est correctement rempli. Ce fichier détermine le type de version à incrémenter :

- **major** : Pour les changements majeurs et potentiellement incompatibles avec la version précédente.
- **minor** : Pour des fonctionnalités nouvelles mais rétrocompatibles.
- **patch** : Pour des corrections de bugs et des mises à jour mineures.

La pipeline validera que la valeur de `choix_version_type` est l'une de ces trois options. Si le fichier est absent ou incorrectement rempli, la pipeline échouera.

### 🔄 Mise à Jour de la Version

Une fois le type de version choisi, la pipeline récupère la version actuelle depuis le fichier `package.json`, puis incrémente la version en fonction de votre sélection (`major`, `minor` ou `patch`). La nouvelle version est ensuite mise à jour dans le fichier `package.json` et committée automatiquement.

### 🏷️ Création de Tag et Release GitHub

Après la mise à jour de la version, la pipeline crée un nouveau **tag Git** sous la forme `v<nouvelle_version>` (par exemple `v1.2.3`). Ce tag est ensuite **poussé sur GitHub**.

En parallèle, une **release GitHub** est également créée avec ce nouveau tag. Les notes de release sont générées automatiquement et incluent tous les commits depuis le précédent tag. Cela permet de retracer tous les changements apportés depuis la dernière version publiée.

### 📝 Notes de Version Personnalisables

Les notes de release par défaut incluent tous les commits effectués depuis le précédent tag sous forme de liste. Toutefois, vous pouvez modifier ces notes manuellement avant de finaliser la release GitHub si vous le souhaitez.

---

## 📄 Exemple de Fichier `choix_version_type`

Le fichier `versioning/choix_version_type` doit ressembler à ceci :

```sh
# VERSION_TYPE=major
VERSION_TYPE=minor
# VERSION_TYPE=patch
```

Dans cet exemple, le type de version choisi est `minor`.

### ✅ Validation

Lors de l'exécution de la pipeline, si le fichier `choix_version_type` est absent ou mal configuré, une erreur sera affichée indiquant qu'il est nécessaire de corriger le fichier avant de relancer la pipeline.

---

## 🔄 Résumé du Processus

1. **Choisir le type de version** dans le fichier `choix_version_type`.
2. **Pousser** vos modifications sur la branche `develop`.
3. **Créer une Pull Request** pour fusionner vos modifications de la branche `develop` sur la branche `main`.
4. La pipeline **met à jour la version**, **committe** les changements, **crée un tag**, et **génère une release GitHub**.
5. Les **notes de version** sont générées automatiquement à partir des commits, mais peuvent être modifiées si nécessaire.

---

## 📌 Points à Noter

### 🔍 Validation du fichier `choix_version_type`

- Une seule ligne doit être décommentée.
- Le fichier doit être présent dans le dossier `versioning`.

### 🌲 Branche `main`

- Ne faites jamais de commits directs sur `main`. Utilisez toujours une Pull Request depuis `develop`.

### ❌ Échec de la Pipeline

- Vérifiez le fichier `choix_version_type`.
- Assurez-vous que la valeur est correcte (`major`, `minor`, ou `patch`).

### ⚠️ Autres Points Importants

- **Conformité des Commits** : Assurez-vous que les messages de commit sont clairs et suivent les bonnes pratiques. Cela facilitera la génération des notes de version.
- **Mise à jour du fichier `package.json`** : Toute mise à jour du fichier `package.json` doit être revue et validée avant d'être fusionnée sur `main`.

---

## 🛠️ Résolution des Problèmes

### ❗ La Pipeline échoue

- **Erreur : fichier ************************`choix_version_type`************************ introuvable** : Vérifiez que le fichier est bien présent dans le dossier `versioning`.
- **Erreur : valeur incorrecte dans `choix_version_type`** : Une seule ligne doit être décommentée avec une valeur valide (`major`, `minor`, ou `patch`).

### 🔄 Version Incorrecte

- Assurez-vous que le numéro de version dans `package.json` correspond à vos attentes avant de lancer la Pull Request.
- Vérifiez que la ligne appropriée est décommentée dans le fichier `versioning/choix_version_type`.

### 🔧 Erreur Pull Request

- Assurez-vous que votre branche `develop` est à jour avec la branche `main` avant de créer une Pull Request.

---

Merci de suivre ces étapes pour maintenir un versioning propre et cohérent dans le repository. Si vous avez des questions, n'hésitez pas à contacter le pôle cloud - cybersécurité d'APIHive.

