//var imap_host = "10.36.0.92"; //mail.zdrav36.ru from ztki
var Environment = {};
Environment.APPDIR = __dirname+"/";
Environment.ROOTDIR = Environment.APPDIR+"../";
Environment.imap_host = "mail.zdrav36.ru";
Environment.upload_limit = '100mb';
Environment.uploads_dir = Environment.ROOTDIR+"UPLOADS/";
Environment.listen_port = 5000;
//common requres
var express = require("express");
//local requres
var ViewsRender = require('./modules/views');
var MainPage = require('./modules/main');
var StaticFiles = require('./modules/static');
var InitApp = require('./modules/init');
var Users = require('./modules/users');
var Workspace = require('./modules/workspace');
var Listen = require('./modules/listen');
Environment.app = express();
InitApp(Environment);//common initialisation
ViewsRender(Environment);//views renderer

MainPage(Environment);//serve root path of webserver
Users(Environment);//serve users/* routes
Workspace(Environment); // serve workspace/* routes

StaticFiles(Environment);  //serve any static files. must be after all
Listen(Environment); //begin listen on port