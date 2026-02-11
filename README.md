# Batch AEP Tool

Batch AEP Tool is an Adobe After Effects script/plugin that allows you to **batch package** and **batch update** `.aep` and `.aepx` project files.

---

## ✨ Features

### 📦 Packager

Batch-packages After Effects project files into organized folders.

- Add multiple `.aep` / `.aepx` files
- Scan entire folders (recursive)
- Optional inclusion of:
  - Adobe Media Encoder temp files
  - Auto-save files
- Automatically:
  - Copies project file
  - Collects and relinks all footage
  - Creates project folder
  - Generates a `(Footage)` subfolder
- Optional custom folder structure
- Optional packaging report
- Works with multiple projects in one batch

---

### 🔄 Updater

Batch-updates older After Effects projects to your current AE version.

- Add multiple `.aep` / `.aepx` files
- Scan folders recursively
- Overwrite original files **or**
- Create new versioned files (`_AE<version>` suffix)
- Optional update report generation
- Suppresses dialog interruptions during batch process

---

## 📂 Packaging Structure

For each project, the tool creates:

```
<ProjectName> folder/
├── ProjectName.aep
└── (Footage)/
```

If **Custom Folders** are enabled, you can define:

- A custom working folder name
- Additional folders created alongside the working folder

---

## 🛠 Installation

1. [Download the latest release's .jsx file](https://github.com/skuntank-dev/BatchAEP-Tool/releases/latest)
2. Install it via **After Effects → File → Scripts → Install Script File... → select the .jsx file**
3. Restart After Effects.
4. Open via **After Effects → File → Scripts → AfterEffects_BatchAEP_Tool_vX.X.X**

---

## 📋 How It Works

### Packager

1. Add `.aep` or `.aepx` files.
2. Select output folder.
3. Choose folder structure options (optional).
4. Click **Package All**.

The script will:
- Copy the project
- Collect all footage into `(Footage)`
- Relink footage inside the new project
- Save and close automatically

---

### Updater

1. Add `.aep` or `.aepx` files.
2. Choose whether to overwrite originals.
3. Click **Update All**.

Projects are opened, saved in the current AE version, and closed automatically.

---

## 📄 Reports

Both tools optionally generate `.txt` reports including:

- Project names
- Output paths
- Footage count
- Missing footage count (Packager)
- Update results (Updater)

---

## ⚙ Requirements

- Adobe After Effects (ScriptUI Panels enabled)
- Compatible with modern AE versions
- Tested in AE 2025+

---

## ⚠ Disclaimer

This script is provided **"as is"**, without warranty of any kind.

Not affiliated with or endorsed by Adobe.

Released under the MIT License:  
https://opensource.org/licenses/MIT

---

## Author

Developed by **skuntank.dev**  

🌐 https://skuntank.dev

📧 skuntank@skuntank.dev
