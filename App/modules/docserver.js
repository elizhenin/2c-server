module.exports = function (Environment) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    Environment.app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });
    /*
    All functions from this block must check rights of user and visibility of files/directories,
    depending on user's role and assigned groups.
    */

   String.prototype.hashCode = function () {
	const len = this.length;
	let ret = 0;
    for (let i = 0; i < len; i++) {
        ret = (31 * ret + this.charCodeAt(i)) << 0;
    }
    return ret;
};
String.prototype.format = function () {
    let text = this.toString();

    if (!arguments.length) return text;

    for (let i = 0; i < arguments.length; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "gi"), arguments[i]);
    }

    return text;
};

   const api_docserver_prefix = "";
   const configServer = {
   "siteUrl": "http://ehomestation:8081/",
    "commandUrl": "coauthoring/CommandService.ashx",
    "converterUrl": "ConvertService.ashx",
    "tempStorageUrl": "ResourceService.ashx",
    "apiUrl": "web-apps/apps/api/documents/api.js",
    "preloaderUrl": "web-apps/apps/api/documents/cache-scripts.html",
    "exampleUrl": null,
    "viewedDocs": [".pdf", ".djvu", ".xps"],
    "editedDocs": [".docx", ".xlsx", ".csv", ".pptx", ".ppsx", ".txt"],
    "convertedDocs": [".docm", ".doc", ".dotx", ".dotm", ".dot", ".odt", ".fodt", ".ott", ".xlsm", ".xls", ".xltx", ".xltm", ".xlt", ".ods", ".fods", ".ots", ".pptm", ".ppt", ".ppsm", ".pps", ".potx", ".potm", ".pot", ".odp", ".fodp", ".otp", ".rtf", ".mht", ".html", ".htm", ".epub"],
    "storageFolder": "files",
    "maxFileSize": 1073741824,
    "mobileRegEx": "android|avantgo|playbook|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino",
   }

  const plugins = {
    "pluginsData": []
  };
  
  Environment.app.set("views", Environment.APPDIR + "/views");
  Environment.app.set("view engine", "ejs");

 const fileSystem = require("fs");
 const docManager = require("./docserver-helpers/docManager");
 const fileUtility = require("./docserver-helpers/fileUtility");
 const fileChoiceUrl = "";

Environment.app.get(api_docserver_prefix + "/editor", function (req, res) {
 
    try {
         docManager.init(Environment.DSTEMPDIR, req, res);
        var history = [];
        var historyData = [];
        var lang = docManager.getLang();
        var userid = req.query.userid ? req.query.userid : "-1";
        var name = req.query.name ? req.query.name : "(Безымянный гость)";

        var userAddress = docManager.curUserHostAddress();
        var fileName = fileUtility.getFileName(req.query.fileName);
        var key = docManager.getKey(fileName);
        var url = docManager.getFileUri(fileName);
        var mode = req.query.mode || "edit"; //mode: view/edit/review/comment/embedded
        var type = req.query.type || ""; //type: embedded/mobile/desktop
        if (type == "") {
                type = new RegExp(configServer.mobileRegEx, "i").test(req.get('User-Agent')) ? "mobile" : "desktop";
            }

        var canEdit = configServer.editedDocs.indexOf(fileUtility.getFileExtension(fileName)) != -1;

        var countVersion = 1;

        var historyPath = docManager.historyPath(fileName, userAddress);
        var changes = null;
        var keyVersion = key;

        if (historyPath != '') {

            countVersion = docManager.countVersion(historyPath) + 1;
            for (var i = 1; i <= countVersion; i++) {
                if (i < countVersion) {
                    var keyPath = docManager.keyPath(fileName, userAddress, i);
                    keyVersion = "" + fileSystem.readFileSync(keyPath);
                } else {
                    keyVersion = key;
                }
                history.push(docManager.getHistory(fileName, changes, keyVersion, i));

                var historyD = {
                    version: i,
                    key: keyVersion,
                    url: i == countVersion ? url : (docManager.getlocalFileUri(fileName, i, true) + "/prev" + fileUtility.getFileExtension(fileName)),
                };

                if (i > 1 && docManager.existsSync(docManager.diffPath(fileName, userAddress, i-1))) {
                    historyD.previous = {
                        key: historyData[i-2].key,
                        url: historyData[i-2].url,
                    };
                    historyD.changesUrl = docManager.getlocalFileUri(fileName, i-1) + "/diff.zip";
                }

                historyData.push(historyD);
                
                if (i < countVersion) {
                    var changesFile = docManager.changesPath(fileName, userAddress, i);
                    changes = docManager.getChanges(changesFile);
                }
            }
        } else {
            history.push(docManager.getHistory(fileName, changes, keyVersion, countVersion));
            historyData.push({
                version: countVersion,
                key: key,
                url: url
            });
        }

       

        var argss = {
            apiUrl: configServer.siteUrl + configServer.apiUrl,
            file: {
                name: fileName,
                ext: fileUtility.getFileExtension(fileName, true),
                uri: url,
                version: countVersion,
                created: new Date().toDateString()
            },
            editor: {
                type: type,
                documentType: fileUtility.getFileType(fileName),
                key: key,
                token: "",
                callbackUrl: docManager.getCallback(fileName),
                isEdit: canEdit && (mode == "edit" || mode == "filter"),
                review: mode == "edit" || mode == "review",
                comment: mode != "view" && mode != "embedded",
                modifyFilter: mode != "filter",
                mode: canEdit && mode != "view" ? "edit" : "view",
                canBackToFolder: type != "embedded",
                backUrl: docManager.getServerUrl(),
                curUserHostAddress: docManager.curUserHostAddress(),
                lang: lang,
                userid: userid,
                name: name,
                fileChoiceUrl: fileChoiceUrl,
                plugins: JSON.stringify(plugins)
            },
            history: history,
            historyData: historyData
        };

        res.render("editor", argss);
        
    }
    catch (ex) {
        console.log(ex);
        res.status(500);
        res.render("error", { message: "Server error" });
    }
});

Environment.app.post(api_docserver_prefix + "/track", function (req, res) {

    docManager.init(Environment.DSTEMPDIR, req, res);

    var userAddress = req.query.useraddress;
    var fileName = fileUtility.getFileName(req.query.filename);
    var version = 0;

    var processTrack = function (response, body, fileName, userAddress) {

        var processSave = function (downloadUri, body, fileName, userAddress, resp) {
            var curExt = fileUtility.getFileExtension(fileName);
            var downloadExt = fileUtility.getFileExtension(downloadUri);

            if (downloadExt != curExt) {
                var key = documentService.generateRevisionId(downloadUri);

                try {
                    documentService.getConvertedUriSync(downloadUri, downloadExt, curExt, key, function (dUri) {
                        processSave(dUri, body, fileName, userAddress, resp)
                    });
                    return;
                } catch (ex) {
                    console.log(ex);
                    fileName = docManager.getCorrectName(fileUtility.getFileName(fileName, true) + downloadExt, userAddress)
                }
            }

            try {

                var path = docManager.storagePath(fileName, userAddress);

                if (docManager.existsSync(path)) {
                    var historyPath = docManager.historyPath(fileName, userAddress);
                    if (historyPath == "") {
                        historyPath = docManager.historyPath(fileName, userAddress, true);
                        docManager.createDirectory(historyPath);
                    }

                    var count_version = docManager.countVersion(historyPath);
                    version = count_version + 1;
                    versionPath = docManager.versionPath(fileName, userAddress, version);
                    docManager.createDirectory(versionPath);

                    var downloadZip = body.changesurl;
                    if (downloadZip) {
                        var path_changes = docManager.diffPath(fileName, userAddress, version);
                        var diffZip = syncRequest("GET", downloadZip);
                        fileSystem.writeFileSync(path_changes, diffZip.getBody());
                    }

                    var changeshistory = body.changeshistory || JSON.stringify(body.history);
                    if (changeshistory) {
                        var path_changes_json = docManager.changesPath(fileName, userAddress, version);
                        fileSystem.writeFileSync(path_changes_json, changeshistory);
                    }

                    var path_key = docManager.keyPath(fileName, userAddress, version);
                    fileSystem.writeFileSync(path_key, body.key);

                    var path_prev = docManager.prevFilePath(fileName, userAddress, version);
                    fileSystem.writeFileSync(path_prev, fileSystem.readFileSync(path));

                    var file = syncRequest("GET", downloadUri);
                    fileSystem.writeFileSync(path, file.getBody());

                    var forcesavePath = docManager.forcesavePath(fileName, userAddress, false);
                    if (forcesavePath != "") {
                        fileSystem.unlinkSync(forcesavePath);
                    }
                }
            } catch (ex) {
                console.log(ex);
            }

            response.write("{\"error\":0}");
            response.end();
        };

        var processForceSave = function (downloadUri, body, fileName, userAddress, resp) {
            var curExt = fileUtility.getFileExtension(fileName);
            var downloadExt = fileUtility.getFileExtension(downloadUri);

            if (downloadExt != curExt) {
                var key = documentService.generateRevisionId(downloadUri);

                try {
                    documentService.getConvertedUriSync(downloadUri, downloadExt, curExt, key, function (dUri) {
                        processForceSave(dUri, body, fileName, userAddress, resp)
                    });
                    return;
                } catch (ex) {
                    console.log(ex);
                    fileName = docManager.getCorrectName(fileUtility.getFileName(fileName, true) + downloadExt, userAddress)
                }
            }

            try {

                var path = docManager.storagePath(fileName, userAddress);

                var forcesavePath = docManager.forcesavePath(fileName, userAddress, false);
                if (forcesavePath == "") {
                    forcesavePath = docManager.forcesavePath(fileName, userAddress, true);
                }

                var file = syncRequest("GET", downloadUri);
                fileSystem.writeFileSync(forcesavePath, file.getBody());
            } catch (ex) {
                console.log(ex);
            }

            response.write("{\"error\":0}");
            response.end();
        };

        if (body.status == 1) { //Editing
            if (body.actions && body.actions[0].type == 0) { //finished edit
                var user = body.actions[0].userid;
                if (body.users.indexOf(user) == -1) {
                    var key = body.key;
                    try {
                        documentService.commandRequest("forcesave", key);
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            }

        } else if (body.status == 2 || body.status == 3) { //MustSave, Corrupted
            processSave(body.url, body, fileName, userAddress, response);
            return;
        } else if (body.status == 6 || body.status == 7) { //MustForceSave, CorruptedForceSave
            processForceSave(body.url, body, fileName, userAddress, response);
            return;
        }

        response.write("{\"error\":0}");
        response.end();
    };

    var readbody = function (request, response, fileName, userAddress) {
        var content = "";
        request.on('data', function (data) {
            content += data;
        });
        request.on('end', function () {
            var body = JSON.parse(content);
            processTrack(response, body, fileName, userAddress);
        });
    };

    if (req.body.hasOwnProperty("status")) {
        processTrack(res, req.body, fileName, userAddress);
    } else {
        readbody(req, res, fileName, userAddress);
    }
});

Environment.app.get(api_docserver_prefix + "/download", function(req, res) {
    docManager.init(Environment.DSTEMPDIR, req, res);

    var fileName = fileUtility.getFileName(req.query.fileName);
    var userAddress = docManager.curUserHostAddress();

    var path = docManager.forcesavePath(fileName, userAddress, false);
    if (path == "") {
        path = docManager.storagePath(fileName, userAddress);
    }

    res.setHeader("Content-Length", fileSystem.statSync(path).size);
    res.setHeader("Content-Type", mime.lookup(path));

    res.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

    var filestream = fileSystem.createReadStream(path);
    filestream.pipe(res);
});

}