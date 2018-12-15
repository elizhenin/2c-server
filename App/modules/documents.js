module.exports = function (Environment) {
    /*
    All functions from this block must check rights of user and visibility of files/directories,
    depending on user's role and assigned groups.
    */

    var fs = require('fs');
    var AuthWrapper = require('./auth-wrapper');
    var api_documents_prefix = "/documents";

    // Reports functions
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/list",
            function (req, res) {
                //list all reports. Should return names of directories. 
                res.send(false);
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
                //add new report directory and it's required subdirectory structures
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/reports/update",
            function (req, res) {
                res.send(false);
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
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/periods/add",
            function (req, res) {
                //add new period directory
                res.send(false);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_documents_prefix + "/periods/update",
            function (req, res) {
                //save new name of period's directory
                res.send(false);
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
                //list filenames in given period's directory
                res.send(false);
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
                res.send(false);
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
                    for OnlyOffice Macros subsustem.
                    Macroses will ask server for data in some cells
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

}