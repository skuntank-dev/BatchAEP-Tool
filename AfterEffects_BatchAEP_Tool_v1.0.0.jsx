/*
Batch AEP Tool
Developed by skuntank.dev
https://skuntank.dev/

Released under the MIT License.
https://opensource.org/licenses/MIT

This script is provided "as is", without warranty.
Not affiliated with or endorsed by Adobe.
*/

var pluginVersion = "Version 1.0.0";
var hideCredits = false;
var internal = false;

if (!internal)
    {
        var internalInstruction1 = ""
        var internalInstruction2 = ""
        var internalInstruction3 = ""
    }
    else
    {
        var internalInstruction1 = "- Send to output root directly puts the XXX.aep's XXX folder into the root of the defined output "
        var internalInstruction2 = "folder, no additional folders created"
        var internalInstruction3 = "- Default structure is 01_Working File, 02_Final Output"
    }

function BatchAEPTool() {
    var currentAEVersion = parseInt(app.version, 10); // e.g., 25 for AE 2025

    var aepPackagerFiles = [];
    var aepUpdaterFiles = [];

    var win = new Window("palette", "Batch AEP Tool", undefined, { resizeable: true });
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // Create Tabs
    var tabPanel = win.add("tabbedpanel");
    tabPanel.preferredSize = [750, 600];
    tabPanel.alignChildren = ["fill", "fill"];

    var packagerTab = tabPanel.add("tab", undefined, "Packager");
    var updaterTab = tabPanel.add("tab", undefined, "Updater");

    // -----------------------
    // Packager Tab
    // -----------------------
    (function setupPackager(tab) {
        tab.orientation = "row";
        tab.alignChildren = ["fill", "top"];
        tab.spacing = 20;

        // LEFT PANEL
        var leftPanel = tab.add("panel", undefined, "Packager");
        leftPanel.orientation = "column";
        leftPanel.alignChildren = ["fill", "top"];
        leftPanel.spacing = 10;
        leftPanel.margins = 16;
        leftPanel.preferredSize = [400, 600];

        var importBtn = leftPanel.add("button", undefined, "Add .AEP/.AEPX file(s)");
        var scanFolderBtn = leftPanel.add("button", undefined, "Scan folder");
        var includeTempFilesCheckbox = leftPanel.add(
    "checkbox",
    undefined,
    "Don't ignore AME and auto-save files"
);
includeTempFilesCheckbox.value = false;

        leftPanel.add("statictext", undefined, "Files to package:");
        var fileList = leftPanel.add("listbox", undefined, [], { multiselect: false });
        fileList.preferredSize = [350, 150];

        var removeBtn = leftPanel.add("button", undefined, "Remove Selected File");
        var clearBtn = leftPanel.add("button", undefined, "Clear List");

        leftPanel.add("panel", undefined, undefined, { borderStyle: "sunken" }).preferredSize = [350, 2];

        var browseFolderBtn = leftPanel.add("button", undefined, "Browse for Output Folder");
        leftPanel.add("statictext", undefined, "Output folder path:");
        var outputFolderInput = leftPanel.add("edittext", undefined, "", { multiline: false });
        outputFolderInput.preferredSize = [350, 20];

        var reportCheckbox = leftPanel.add("checkbox", undefined, "Generate Report");
        var sendToRootCheckbox;

        if (internal) {
            sendToRootCheckbox = leftPanel.add(
                "checkbox",
                undefined,
                "Send to output root (Skip folder structure)"
            );
        } else {
            // dummy object to avoid null checks everywhere
            sendToRootCheckbox = {
                value: true,
                enabled: false
            };
        }

        var customFoldersCheckbox = leftPanel.add("checkbox", undefined, "Custom folders");

        var customFoldersPanel = leftPanel.add("panel", undefined, "Custom Folders");
        customFoldersPanel.orientation = "column";
        customFoldersPanel.alignChildren = ["fill", "top"];
        customFoldersPanel.margins = 10;
        customFoldersPanel.preferredSize = [350, 180];
        customFoldersPanel.visible = false;

        customFoldersPanel.add("statictext", undefined, "01_Working File customisation:");
        var workingFolderText = customFoldersPanel.add("edittext", undefined, "01_Working File", { multiline: false });
        workingFolderText.preferredSize = [350, 20];

        customFoldersPanel.add("statictext", undefined, "Additional custom folders:");
        var customFolderListBox = customFoldersPanel.add("listbox", undefined, [], { multiselect: false });
        customFolderListBox.preferredSize = [350, 80];

        var addFolderBtn = customFoldersPanel.add("button", undefined, "Add Folder");
        var removeFolderBtn = customFoldersPanel.add("button", undefined, "Remove Folder");
        var editFolderBtn = customFoldersPanel.add("button", undefined, "Edit Folder");

        var packageBtn = leftPanel.add("button", undefined, "Package All");

        // RIGHT PANEL
        var rightPanel = tab.add("panel", undefined, "Instructions");
        rightPanel.orientation = "column";
        rightPanel.alignChildren = ["left", "top"];
        rightPanel.spacing = 10;
        rightPanel.margins = 16;
        rightPanel.preferredSize = [300, 600];

        var instructions = [
            "- Click 'Add .AEP file(s)' to import projects. AEPX is also suppported.",
            "- You can also choose a folder to scan and import all AEP + AEPX inside.",
            "- Use 'Remove' or 'Clear' to manage file list.",
            "",
            "- Browse and set the output folder.",
	        "  This is where all your packaged folders will be placed.",
	        "  You can also copypaste the filepath of the output folder into the textbox.",
            "",
            "- Custom folders allow you to define your own folder structure",
	        "",
            "- 'Generate Report' logs where your files are packaged to, and how many footages there are",
            "",
            internalInstruction1,
	        internalInstruction2,
            "",
            internalInstruction3,
	        "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            pluginVersion,
            ""
            ];

            if (!hideCredits) {
                instructions.push("Developed by skuntank.dev");
                instructions.push("https://skuntank.dev/");
                instructions.push("https://github.com/skuntank-dev/BatchAEP-Tool");
            }

for (var i = 0; i < instructions.length; i++) {
    var text = instructions[i];

    // Check if the line contains a URL
    var urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
        var link = rightPanel.add("statictext", undefined, text);
        link.graphics.foregroundColor = link.graphics.newPen(link.graphics.PenType.SOLID_COLOR, [0.0, 0.5, 1.0, 1], 1); // Light blue
link.addEventListener("mousedown", function(e) {
    var url = e.target.text.match(/https?:\/\/[^\s]+/)[0];
    try {
        if ($.os.toLowerCase().indexOf("windows") >= 0) {
            system.callSystem('explorer ' + url);
        } else {
            system.callSystem('open ' + url);
        }
    } catch (err) {
        alert("Failed to open URL: " + url + "\n" + err.toString());
    }
});

    } else {
        rightPanel.add("statictext", undefined, text);
    }
}


        // Event Handlers
        importBtn.onClick = function () {
            var files = File.openDialog("Select AEP or AEPX files", "*.aep;*.aepx", true);
            if (files) {
                for (var i = 0; i < files.length; i++) {
                    aepPackagerFiles.push(files[i]);
                    fileList.add("item", decodeURI(files[i].name));
                }
            }
        };
scanFolderBtn.onClick = function () {
    var selectedFolder = Folder.selectDialog("Select folder to scan for AEP/AEPX files");
    if (!selectedFolder) return;

    var foundFiles = [];
    var includeTemp = includeTempFilesCheckbox.value;

    function scanFolderRecursive(folder) {
        var files = folder.getFiles();
        for (var i = 0; i < files.length; i++) {
            if (files[i] instanceof Folder) {
                scanFolderRecursive(files[i]);
            } else if (files[i] instanceof File && files[i].name.match(/\.aepx?$/i)) {

                if (!includeTemp) {
                    if (
                        files[i].name.indexOf("tmpAEtoAMEProject-") === 0 ||
                        files[i].name.toLowerCase().indexOf("auto-save") !== -1
                    ) {
                        continue;
                    }
                }

                foundFiles.push(files[i]);
            }
        }
    }

    scanFolderRecursive(selectedFolder);

    for (var i = 0; i < foundFiles.length; i++) {
        aepPackagerFiles.push(foundFiles[i]);
        fileList.add("item", decodeURI(foundFiles[i].name));
    }

    if (foundFiles.length === 0) {
        alert("No AEP or AEPX files found in the selected folder.");
    }
};

        removeBtn.onClick = function () {
            if (fileList.selection !== null) {
                var index = fileList.selection.index;
                aepPackagerFiles.splice(index, 1);
                fileList.remove(index);
            }
        };
        clearBtn.onClick = function () {
            aepPackagerFiles = [];
            fileList.removeAll();
        };
        browseFolderBtn.onClick = function () {
            var selectedFolder = Folder.selectDialog("Select the output folder");
            if (selectedFolder) outputFolderInput.text = selectedFolder.fsName;
        };
        customFoldersCheckbox.onClick = function () {
            if (customFoldersCheckbox.value) {
                sendToRootCheckbox.enabled = false;
                sendToRootCheckbox.value = false;
                customFoldersPanel.visible = true;
            } else {
                sendToRootCheckbox.enabled = true;
                customFoldersPanel.visible = false;
            }
        };
        addFolderBtn.onClick = function () {
            var newFolder = prompt("Enter new folder name", "02_Final Output");
            if (newFolder) customFolderListBox.add("item", newFolder);
        };
        removeFolderBtn.onClick = function () {
            if (customFolderListBox.selection !== null) customFolderListBox.remove(customFolderListBox.selection.index);
        };
        editFolderBtn.onClick = function () {
            if (customFolderListBox.selection !== null) {
                var selectedFolder = customFolderListBox.selection.text;
                var editedFolder = prompt("Edit folder name", selectedFolder);
                if (editedFolder && editedFolder !== selectedFolder) customFolderListBox.selection.text = editedFolder;
            }
        };
        packageBtn.onClick = function () {
            if (aepPackagerFiles.length === 0) { alert("No AEP files selected."); return; }
            var confirmation = confirm("Are you sure you want to package all selected files?");
            if (!confirmation) return;

            var outputFolderPath = outputFolderInput.text;
            var outputFolder = new Folder(outputFolderPath);
            if (!outputFolder.exists) { alert("Please select a valid output folder."); return; }

            var report = "";
            if (reportCheckbox.value) report = "Batch AEP Packaging Report\n\nOutput Folder: " + outputFolder.fsName + "\n\n";

            for (var i = 0; i < aepPackagerFiles.length; i++) {
                var aepFile = aepPackagerFiles[i];
                var baseName = decodeURI(aepFile.name).replace(/\.aepx?$/i, "");
                var workingFolder, destAEP;

if (customFoldersCheckbox.value) {

    var rootFolder = new Folder(outputFolder.fsName + "/" + baseName);
    if (!rootFolder.exists) rootFolder.create();

    var customDestinationFolder = new Folder(rootFolder.fsName + "/" + workingFolderText.text);
    if (!customDestinationFolder.exists) customDestinationFolder.create();

    workingFolder = new Folder(customDestinationFolder.fsName + "/" + baseName + " folder");
    if (!workingFolder.exists) workingFolder.create();

    destAEP = new File(workingFolder.fsName + "/" + aepFile.name);

    for (var j = 0; j < customFolderListBox.items.length; j++) {
        var folderName = customFolderListBox.items[j].text;
        var customFolder = new Folder(rootFolder.fsName + "/" + folderName);
        if (!customFolder.exists) customFolder.create();
    }

} else if (sendToRootCheckbox.value || !internal) {

    workingFolder = new Folder(outputFolder.fsName + "/" + baseName + " folder");
    if (!workingFolder.exists) workingFolder.create();

    destAEP = new File(workingFolder.fsName + "/" + aepFile.name);

} else if (internal) {

    var rootFolder = new Folder(outputFolder.fsName + "/" + baseName);
    if (!rootFolder.exists) rootFolder.create();

    // 01_Working File (or custom name)
    var customDestinationFolder = new Folder(rootFolder.fsName + "/" + workingFolderText.text);
    if (!customDestinationFolder.exists) customDestinationFolder.create();

    workingFolder = new Folder(customDestinationFolder.fsName + "/" + baseName + " folder");
    if (!workingFolder.exists) workingFolder.create();

    // 🔧 FIX: Ensure 02_Final Output always exists (same as old behavior)
    var finalOutput = new Folder(rootFolder.fsName + "/02_Final Output");
    if (!finalOutput.exists) finalOutput.create();

    destAEP = new File(workingFolder.fsName + "/" + aepFile.name);

    for (var j = 0; j < customFolderListBox.items.length; j++) {
        var folderName = customFolderListBox.items[j].text;
        var customFolder = new Folder(rootFolder.fsName + "/" + folderName);
        if (!customFolder.exists) customFolder.create();
    }

} else {

    var rootFolder = new Folder(outputFolder.fsName + "/" + baseName);
    if (!rootFolder.exists) rootFolder.create();

    workingFolder = new Folder(rootFolder.fsName + "/01_Working File/" + baseName + " folder");
    if (!workingFolder.exists) workingFolder.create();

    var finalOutput = new Folder(rootFolder.fsName + "/02_Final Output");
    if (!finalOutput.exists) finalOutput.create();

    destAEP = new File(workingFolder.fsName + "/" + aepFile.name);
}


                aepFile.copy(destAEP.fsName);

                if (reportCheckbox.value) report += "Project: " + aepFile.name + "\nCopied to: " + destAEP.fsName + "\n";

                try {
                    app.open(destAEP);
                    var footageFolder = new Folder(workingFolder.fsName + "/(Footage)");
                    if (!footageFolder.exists) footageFolder.create();
                    var missingFootage = 0, copiedFootage = 0;
                    var footageItems = getAllFootageItems(app.project.rootFolder);
                    for (var j = 0; j < footageItems.length; j++) {
                        var sourceFile = footageItems[j].file;
                        if (sourceFile && sourceFile.exists) {
                            var destFile = new File(footageFolder.fsName + "/" + sourceFile.name);
                            if (!destFile.exists) sourceFile.copy(destFile.fsName);
                            footageItems[j].replace(destFile);
                            copiedFootage++;
                        } else missingFootage++;
                    }
                    if (reportCheckbox.value) {
                        report += "Footage copied: " + copiedFootage + "\n";
                        if (missingFootage > 0) report += "Missing footage: " + missingFootage + "\n";
                    }
                    app.project.save();
                    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
                } catch (e) {
                    if (reportCheckbox.value) report += "Error processing: " + e.toString() + "\n";
                }
                if (reportCheckbox.value) report += "----------------------------------\n";
            }

            if (reportCheckbox.value) {
                var reportFile = new File(outputFolder.fsName + "/PackagingReport.txt");
                if (reportFile.open("w")) { reportFile.write(report); reportFile.close(); }
                alert("All AEPs have been packaged.\nReport saved to PackagingReport.txt.");
            } else alert("All AEPs have been packaged.");
        };

        function getAllFootageItems(folder) {
            var items = [];
            for (var i = 1; i <= folder.numItems; i++) {
                var item = folder.item(i);
                if (item instanceof FolderItem) items = items.concat(getAllFootageItems(item));
                else if (item instanceof FootageItem && item.file) items.push(item);
            }
            return items;
        }
    })(packagerTab);

// -----------------------
// Updater Tab
// -----------------------
(function setupUpdater(tab) {
    tab.orientation = "row"; // layout like Packager
    tab.alignChildren = ["fill", "top"];
    tab.spacing = 20;

    // LEFT PANEL (Controls)
    var leftPanel = tab.add("panel", undefined, "Updater");
    leftPanel.orientation = "column";
    leftPanel.alignChildren = ["fill", "top"];
    leftPanel.spacing = 10;
    leftPanel.margins = 16;
    leftPanel.preferredSize = [400, 600];

    var importBtn = leftPanel.add("button", undefined, "Add .AEP/.AEPX file(s)");
    var scanFolderBtn = leftPanel.add("button", undefined, "Scan folder");
    var includeTempFilesCheckbox = leftPanel.add(
    "checkbox",
    undefined,
    "Don't ignore AME and auto-save files"
);
includeTempFilesCheckbox.value = false;

    leftPanel.add("statictext", undefined, "Files to update:");
    var fileList = leftPanel.add("listbox", undefined, [], { multiselect: false });
    fileList.preferredSize = [350, 150];

    var removeBtn = leftPanel.add("button", undefined, "Remove Selected File");
    var clearBtn = leftPanel.add("button", undefined, "Clear List");

    var overwriteCheckbox = leftPanel.add("checkbox", undefined, "Overwrite Original Files");
    overwriteCheckbox.value = true;

    var reportCheckbox = leftPanel.add("checkbox", undefined, "Generate Report");

    // --- New: Report folder selection ---
    var browseReportBtn = leftPanel.add("button", undefined, "Browse for Report Folder");
    var reportFolderInput = leftPanel.add("edittext", undefined, "", { multiline: false });
    reportFolderInput.preferredSize = [350, 20];

    browseReportBtn.onClick = function () {
        var selectedFolder = Folder.selectDialog("Select folder for report");
        if (selectedFolder) reportFolderInput.text = selectedFolder.fsName;
    };

    var updateBtn = leftPanel.add("button", undefined, "Update All");

    // RIGHT PANEL (Instructions)
    var rightPanel = tab.add("panel", undefined, "Instructions");
    rightPanel.orientation = "column";
    rightPanel.alignChildren = ["left", "top"];
    rightPanel.spacing = 10;
    rightPanel.margins = 16;
    rightPanel.preferredSize = [300, 600];

    var instructions = [
        "- Click 'Add .AEP file(s)' to import projects. AEPX is also suppported.",
        "- You can also choose a folder to scan and import all AEP + AEPX inside.",
        "- Use 'Remove' or 'Clear' to manage file list.",
        "",
        "- If 'Overwrite Original Files' is unchecked, a new file will be created with '_AE" + currentAEVersion + "' appended.",
        "",
        "- You can generate a report of updates and choose its destination folder.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        pluginVersion,
        ""
        ];

        if (!hideCredits) {
            instructions.push("Developed by skuntank.dev");
            instructions.push("https://skuntank.dev/");
            instructions.push("https://github.com/skuntank-dev/BatchAEP-Tool");
        }

for (var i = 0; i < instructions.length; i++) {
    var text = instructions[i];

    // Check if the line contains a URL
    var urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
        var link = rightPanel.add("statictext", undefined, text);
        link.graphics.foregroundColor = link.graphics.newPen(link.graphics.PenType.SOLID_COLOR, [0.0, 0.5, 1.0, 1], 1); // Light blue
link.addEventListener("mousedown", function(e) {
    var url = e.target.text.match(/https?:\/\/[^\s]+/)[0];
    try {
        if ($.os.toLowerCase().indexOf("windows") >= 0) {
            system.callSystem('explorer ' + url);
        } else {
            system.callSystem('open ' + url);
        }
    } catch (err) {
        alert("Failed to open URL: " + url + "\n" + err.toString());
    }
});

    } else {
        rightPanel.add("statictext", undefined, text);
    }
}


    // Event Handlers
    importBtn.onClick = function () {
        var files = File.openDialog("Select AEP or AEPX files", "*.aep;*.aepx", true);
        if (files) {
            for (var i = 0; i < files.length; i++) {
                aepUpdaterFiles.push(files[i]);
                fileList.add("item", decodeURI(files[i].name));
            }
        }
    };
scanFolderBtn.onClick = function () {
    var selectedFolder = Folder.selectDialog("Select folder to scan for AEP/AEPX files");
    if (!selectedFolder) return;

    var foundFiles = [];
    var includeTemp = includeTempFilesCheckbox.value;

    function scanFolderRecursive(folder) {
        var files = folder.getFiles();
        for (var i = 0; i < files.length; i++) {
            if (files[i] instanceof Folder) {
                scanFolderRecursive(files[i]);
            } else if (files[i] instanceof File && files[i].name.match(/\.aepx?$/i)) {

                if (!includeTemp) {
                    if (
                        files[i].name.indexOf("tmpAEtoAMEProject-") === 0 ||
                        files[i].name.toLowerCase().indexOf("auto-save") !== -1
                    ) {
                        continue;
                    }
                }

                foundFiles.push(files[i]);
            }
        }
    }

    scanFolderRecursive(selectedFolder);

    for (var i = 0; i < foundFiles.length; i++) {
        aepUpdaterFiles.push(foundFiles[i]);
        fileList.add("item", decodeURI(foundFiles[i].name));
    }

    if (foundFiles.length === 0) {
        alert("No AEP or AEPX files found in the selected folder.");
    }
};

    removeBtn.onClick = function () {
        if (fileList.selection !== null) {
            var index = fileList.selection.index;
            aepUpdaterFiles.splice(index, 1);
            fileList.remove(index);
        }
    };
    clearBtn.onClick = function () {
        aepUpdaterFiles = [];
        fileList.removeAll();
    };
updateBtn.onClick = function () {
    if (aepUpdaterFiles.length === 0) { alert("No AEP files selected."); return; }

    var report = "";
    if (reportCheckbox.value) report = "Batch AEP Update Report\n\n";

    // Begin suppressing script error dialogs
    app.beginSuppressDialogs();

    for (var i = 0; i < aepUpdaterFiles.length; i++) {
        var aepFile = aepUpdaterFiles[i];
        try {
            var proj = app.open(aepFile); // This may still show version dialogs
            var projVersion = parseInt(proj.version, 10);

            if (projVersion >= currentAEVersion) {
                if (reportCheckbox.value) report += aepFile.name + " is already the latest version.\n";
                app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
                continue;
            }

            var saveFile;
            if (overwriteCheckbox.value) {
                saveFile = aepFile;
            } else {
                var baseName = decodeURI(aepFile.name).replace(/\.aepx?$/i, "");
                var ext = aepFile.name.match(/\.aepx?$/i)[0];
                saveFile = new File(aepFile.path + "/" + baseName + "_AE" + currentAEVersion + ext);
            }

            app.project.save(saveFile);
            app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);

            if (reportCheckbox.value) report += aepFile.name + " updated -> " + saveFile.name + "\n";

        } catch (e) {
            if (reportCheckbox.value) report += "Error updating " + aepFile.name + ": " + e.toString() + "\n";
        }
    }

    // End suppressing dialogs
    app.endSuppressDialogs(false);

    if (reportCheckbox.value) {
        var reportFolder = reportFolderInput.text ? new Folder(reportFolderInput.text) : Folder.myDocuments;
        if (!reportFolder.exists) reportFolder.create();
        var reportFile = new File(reportFolder.fsName + "/AEPUpdateReport.txt");
        if (reportFile.open("w")) { reportFile.write(report); reportFile.close(); }
        alert("Update complete.\nReport saved to: " + reportFile.fsName);
    } else {
        alert("Update complete.");
    }
};


})(updaterTab);


    win.center();
    win.show();
}

app.beginUndoGroup("Batch AEP Tool");
BatchAEPTool();
app.endUndoGroup();
