module.exports = function (Environment) {
    /*
    All functions from this block must check rights of user and visibility of files/directories,
    depending on user's role and assigned groups.
    */
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
    "token": {
        "enable": false,
        "useforrequest": true,
        "algorithmRequest": "HS256",
        "authorizationHeader": "Authorization",
        "authorizationHeaderPrefix": "Bearer ",
        "secret": "hgieFESwivtw3489cmff",
        "expiresIn": "5m"
    }
  }

  const plugins = {
    "pluginsData": []
  };

  Environment.app.set("views", Environment.APPDIR + "/views");
  Environment.app.set("view engine", "ejs");

Environment.app.get(api_docserver_prefix + "/editor", function (req, res) {
    const fileSystem = require("fs");
    const jwt = require('jsonwebtoken');
    const docManager = require("./docserver-helpers/docManager");
    const fileUtility = require("./docserver-helpers/fileUtility");
    const siteUrl = api_docserver_prefix;
    const fileChoiceUrl = "";
    const cfgSignatureEnable = configServer.token.enable;
    const cfgSignatureSecretExpiresIn = configServer.token.expiresIn;
    const cfgSignatureSecret = configServer.token.secret;

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

        if (cfgSignatureEnable) {
            for (var i = 0; i < historyData.length; i++) {
                historyData[i].token = jwt.sign(historyData[i], cfgSignatureSecret, {expiresIn: cfgSignatureSecretExpiresIn});
            }
        }

        var argss = {
            apiUrl: siteUrl + configServer.apiUrl,
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

        if (cfgSignatureEnable) {
            app.render('config', argss, function(err, html){
                if (err) {
                    console.log(err);
                } else {
                    argss.editor.token = jwt.sign(JSON.parse("{"+html+"}"), cfgSignatureSecret, {expiresIn: cfgSignatureSecretExpiresIn});
                }
                res.render("editor", argss);
              });
        } else {
              res.render("editor", argss);
        }
    }
    catch (ex) {
        console.log(ex);
        res.status(500);
        res.render("error", { message: "Server error" });
    }
});

}