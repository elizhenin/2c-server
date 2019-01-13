module.exports = function (Environment) {
    /*
    All functions from this block must check rights of user and visibility of files/directories,
    depending on user's role and assigned groups.
    */
    var Goodies = require("./goodies");
    var fs = require('fs');
    var RepWrapper = require('./reports-wrapper');
    RepWrapper.DBDIR = Environment.DBDIR;
    RepWrapper.DBREPORTSSDIR = Environment.DBREPORTSSDIR;
    RepWrapper.AuthWrapper = require('./auth-wrapper');
    RepWrapper.AuthWrapper.DBGROUPNAMESDIR = Environment.DBGROUPNAMESDIR;
    RepWrapper.AuthWrapper.DBORGNAMESDIR = Environment.DBORGNAMESDIR;
    var api_documents_prefix = "/documents";

    // Reports functions
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/list",
            function (req, res) {
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Отчеты: items,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                var ReportsList = RepWrapper.getList();
                var Response = [];
                ReportsList.forEach(report => {
                    var RepRights = RepWrapper.getRights(report);
                    var item = {
                        Название: report,
                        Пользователь: RepRights.user,
                        Группа: {
                            Код: RepRights.group.code,
                            Название: RepRights.group.name
                        }
                    };
                    switch (req.AuthTokenDetails.role) {
                        case "editor":
                            {
                                Response.push(item);
                                break;
                            }
                        case "receiver":
                            {
                                if (req.AuthTokenDetails.login == item.Пользователь) {

                                    Response.push(item);
                                }
                                break;
                            }
                        case "sender":
                            {
                                Groups = RepWrapper.AuthWrapper.getGroupsByUser(req.AuthTokenDetails.login);
                                if (Groups.includes(item.Группа.Код)) {
                                    Response.push(item);
                                }

                                break;
                            }
                    }
                });
                Response = ResponsePrepare(true, Response, "Список отчетов успешно получен");

                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/read",
            function (req, res) {
                //should return detailed info about report (not clear task at this point. maybe removed)
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/add",
            function (req, res) {
                var Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Сервер: items,
                        Сообщение: message
                    };
                    var cache = [];
                    Response = JSON.stringify(Response, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found
                                try {
                                    // If this value does not reference a parent it can be deduped
                                    return JSON.parse(JSON.stringify(value));
                                } catch (error) {
                                    // discard key if value cannot be deduped
                                    return;
                                }
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection
                    return Response;
                };
                var Response = RepWrapper.newReport(Request.name);
                Response = ResponsePrepare(true, Response, "Новый отчет успешно создан");
                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/update",
            function (req, res) {
                var Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Сервер: items,
                        Сообщение: message
                    };
                    var cache = [];
                    Response = JSON.stringify(Response, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found
                                try {
                                    // If this value does not reference a parent it can be deduped
                                    return JSON.parse(JSON.stringify(value));
                                } catch (error) {
                                    // discard key if value cannot be deduped
                                    return;
                                }
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection
                    return Response;
                };
                var Response;
                switch (Request.operation) {
                    case "rename":
                        {
                            Response = RepWrapper.renameReport(Request.current, Request.new);
                            Response = ResponsePrepare(true, Response, "Отчет успешно переименован");
                            break;
                        }
                    case "rights":
                        {
                            Response = RepWrapper.setRightsReport(Request.name, Request.user, Request.group);
                            Response = ResponsePrepare(true, Response, "Права отчета успешно назначены");

                            break;
                        }
                }

                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/delete",
            function (req, res) {
                //zip report's directory structure, move result to archive's directory, and unlink from filesystem
                res.send(false);
            });
    // Periods functions
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/periods/list",
            function (req, res) {
                //list names of periods of given report and their creation time, ordered by creation time
                var Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Периоды: items,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                var PeriodsList = RepWrapper.getListPeriod(Request.report);
                var Response = [];
                PeriodsList.forEach(period => {
                    var RepPerRights = RepWrapper.getRightsPeriod(Request.report, period);
                    var item = {
                        Название: period,
                        Права: {
                            Чтение: (RepPerRights.rights.charAt(4) == "-") ? false : true,
                            Запись: (RepPerRights.rights.charAt(5) == "-") ? false : true
                        }
                    };
                    switch (req.AuthTokenDetails.role) {
                        default:
                            {
                                Response.push(item);
                            }
                    }
                });
                Response = ResponsePrepare(true, Response, "Список периодов успешно получен");

                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/periods/add",
            function (req, res) {
                var Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Сервер: items,
                        Сообщение: message
                    };
                    var cache = [];
                    Response = JSON.stringify(Response, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found
                                try {
                                    // If this value does not reference a parent it can be deduped
                                    return JSON.parse(JSON.stringify(value));
                                } catch (error) {
                                    // discard key if value cannot be deduped
                                    return;
                                }
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection
                    return Response;
                };
                var Response = RepWrapper.newReportPeriod(Request.report, Request.name);
                Response = ResponsePrepare(true, Response, "Новый период успешно создан");
                res.send(Response);
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/periods/update",
            function (req, res) {
                var Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Сервер: items,
                        Сообщение: message
                    };
                    var cache = [];
                    Response = JSON.stringify(Response, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found
                                try {
                                    // If this value does not reference a parent it can be deduped
                                    return JSON.parse(JSON.stringify(value));
                                } catch (error) {
                                    // discard key if value cannot be deduped
                                    return;
                                }
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection
                    return Response;
                };
                var Response;
                switch (Request.operation) {
                    case "rename":
                        {
                            Response = RepWrapper.renameReportPeriod(Request.report, Request.current, Request.new);
                            Response = ResponsePrepare(true, Response, "Период успешно переименован");
                            break;
                        }
                    case "rights":
                        {
                            Response = RepWrapper.rightsReportPeriod(Request.report, Request.period, Request.access);
                            Response = ResponsePrepare(true, Response, "Доступ к периоду изменен");
                            break;
                        }

                }

                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/periods/delete",
            function (req, res) {
                //unlink period's directory
                res.send(false);
            });
    // Documents functions 
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/document/list",
            function (req, res) {
                var Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Отчеты: items,
                        Сообщение: message
                    };
                    var cache = [];
                    Response = JSON.stringify(Response, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found
                                try {
                                    // If this value does not reference a parent it can be deduped
                                    return JSON.parse(JSON.stringify(value));
                                } catch (error) {
                                    // discard key if value cannot be deduped
                                    return;
                                }
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null; // Enable garbage collection
                    return Response;
                };
                var Response = RepWrapper.listReportPeriodDocs(Request.report, Request.period);
                Response = ResponsePrepare(true, Response, "Список первичных отчетов успешно получен");
                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/document/add",
            function (req, res) {
                //create new template file in report's directory with one of standart names(for senders and for receivers)
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/document/read",
            function (req, res) {
                //read file with given name from given period of given report
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/document/update",
            function (req, res) {
                //save edited file
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/document/copy",
            function (req, res) {
                //copy template file from report's directory to period's directory, and rename it to user organisation's name
                var Request = req.query;
                var Response = false;
                switch (req.AuthTokenDetails.role) {
                    case "sender":
                        {
                            var RepPerRights = RepWrapper.getRightsPeriod(Request.report, Request.period);
                            if (RepPerRights.rights.charAt(5) != "-") {
                            switch (Request.type) {
                                case "sample":
                                    {
                                        RepWrapper.copySampleToPeriod(Request.report, Request.period, RepWrapper.AuthWrapper.getOrgByUser(req.AuthTokenDetails.login));
                                        break;
                                    }
                                case "exists":
                                    {
                                        RepWrapper.copyPeriodToPeriod(Request.report, Request.source, Request.period, RepWrapper.AuthWrapper.getOrgByUser(req.AuthTokenDetails.login));
                                        break;
                                    }
                            }
                        }
                            Response = Environment.api_url_prefix + api_documents_prefix + "/download/" + Request.report + "/Первичные/" + Request.period + "/" + RepWrapper.AuthWrapper.getOrgByUser(req.AuthTokenDetails.login) + ".xlsx";
                            break;
                        }
                }
                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/document/delete",
            function (req, res) {
                //unlink selected file
                res.send(false);
            });

    //Reserved for macroses api. not clear task
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/parser/read",
            function (req, res) {
                /*
                    this function, or set of functions in future, required as data backend
                    for OnlyOffice Macros subsystem.
                    Macroses will ask server for data
                                        in some cells
                                            of some rows 
                                                of some worksheets
                                                    of some files
                                                        of some periods
                                                            of some reports....
                        and server must return requested information.
                    There more than one way to implement parsing of ods/xls/xlsx sheets, so - not now.
                */
                res.send(false);
            });

    //direct download/upload xlsx by editor request
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/download/*",
            function (req, res) {
                path = require("path");
                result = path.join(Environment.DBREPORTSSDIR, req.params[0]);
                console.log('sending "' + result + '"');
                res.sendFile(result);
            });
    Environment.app
        .post(Environment.api_url_prefix + api_documents_prefix + "/upload",
            function (req, res) {
                filename = req.query.filename.replace("/api/documents/download/", "");
                file_struct = filename.split("/");
                var allow_save = false;
                switch (file_struct[1]) {
                    case "Первичные":
                        {
                            var RepPerRights = RepWrapper.getRightsPeriod(file_struct[0], file_struct[2]);
                            if (RepPerRights.rights.charAt(5) != "-") {
                                allow_save = true;
                            }
                            break;
                        }
                    case "Трафареты":
                        {
                            allow_save = true;
                            break;
                        }
                }
                if (allow_save) {
                    var JSZip = require("jszip");
                    var new_zip = new JSZip();
                    new_zip.loadAsync(Goodies.base64decode(req.body.Data))
                        .then(function (zip) {
                            zip
                                .generateNodeStream({
                                    type: 'nodebuffer',
                                    streamFiles: true
                                })
                                .pipe(fs.createWriteStream(Environment.DBREPORTSSDIR + "/" + filename))
                                .on('finish', function () {
                                    res.send("Успешно сохранено, можете закрыть это окно");
                                });
                        });
                } else {
                    res.send("Нельзя сохранить. Закройте это окно");
                }
            });
}