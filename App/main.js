var Environment = {};
Environment.APPDIR = __dirname + "/";
Environment.ROOTDIR = Environment.APPDIR + "../";
Environment.SITESDIR = Environment.ROOTDIR + "sites";
Environment.upload_limit = '100mb';
Environment.listen_port = 80;
Environment.workers_per_cpu = 1;

var cluster = require('cluster');
if (cluster.isMaster) { // master process
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // Create a workers group for each CPU
    for (var i = 0; i < cpuCount * Environment.workers_per_cpu; i += 1) {
        cluster.fork();
    }
    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker
        console.log('Worker ' + worker.id + ' died and replaced');
        cluster.fork();

    });
} else { // worker process
    var Goodies = require('./goodies');
    var express = require('express');
    var path = require('path');
    var fs = require('fs');
    var bodyParser = require('body-parser');
    Environment.app = express();
    Environment.app.use(bodyParser.json({
        limit: Environment.upload_limit
    })); // to support JSON-encoded bodies

    Environment.app
        .post("/api/users/login",
            function (req, res) {
                var PAM = require('authenticate-pam');
                Request = req.body;
                Request.password = decodeURIComponent(Goodies.base64decode(Request.password));
                var ResponsePrepare = function (status, token) {
                    Response = {
                        Статус: status,
                        Токен: token
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                    
                };
                PAM.authenticate(Request.login, Request.password, function (err) {
                    if (err) {
                        res.send(ResponsePrepare(false,""));
                    } else {
                        res.send(ResponsePrepare(true,"generated_token"));
                    }
                });

            });

    //Static sender
    Environment.app
        .get(/(.+)$/,
            function (req, res) {
                domain = req.hostname;
                console.log('process id: "' + cluster.worker.id + '"');
                console.log('reached request for "' + domain + '"');
                var result = '';
                var requested = path.join(Environment.SITESDIR, domain, req.params[0]);
                var fallback = path.join(Environment.SITESDIR, domain, 'index.html');
                console.log('search for file "' + req.params[0] + '"');
                if (
                    fs.existsSync(requested) &&
                    (!(fs.lstatSync(requested).isDirectory()))
                ) {
                    result = requested;
                } else if (
                    fs.existsSync(fallback) &&
                    (!(fs.lstatSync(fallback).isDirectory()))
                ) {
                    result = fallback;
                } else result = path.join(Environment.SITESDIR, 'index.html');
                console.log('sending "' + result + '"');
                res.sendFile(result);
                console.log('process id: ' + cluster.worker.id + ' end of task');
            });

    var port = process.env.PORT || Environment.listen_port;
    Environment.app.listen(port, function () {
        console.log("Listening on " + port);
    });
}