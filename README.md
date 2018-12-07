<<<<<<< HEAD
# webserver
## About
Standalone static webserver on Node.js and Express.js.

The main concept is to serve static files and always show index.html instead of 404 error. This feachure is required for application building where CMS tasks such as uri path routing and dynamic page generating is done on browser side by js application.

So, the logic is "If static file exist, send it. If not - send /index.html". And "index.html" must look at the URI and do the all dirty work.

## Usage:
1) start server by node.js executable;
2) go to localhost:5000 to see the sample site working;
3) look at "sites" subdirectory to see how it organized. The bootstrap-based site template is placed there. It was adopted to be browser-driven mini engine;
*Hint: create symlink to "localhost" directory and name it "127.0.0.1". See that this way also works, to open your resource by IP instead of domain;*
4) create directory with your domain name at "sites" subdirectory and "index.html" file into it. This is minimum;
*Hint: you can make symlink to real place of directory with your files instead;*
5) place your project's other required files in that directory;
6) access server by your domain name and see your site is working;
7) configure best number of worker threads by modyfying *Environment.workers_per_cpu* in App/main.js file.
8) Got it!

If you want to change the default port, it can be done in two ways:
1) set environment variable "PORT" before starting node.js;
2) change *Environment.listen_port* variable in App/main.js.

Hint: to use 80 port with non-root user, here is example for debian/ubuntu:

sudo apt-get install libcap2-bin

sudo setcap cap_net_bind_service=+ep \`readlink -f \\`which node\\``

Theese commands should allow "node" executable to bind ports lower than 1024.


## TODO
1) <del>make multithreaded version</del> - Done.
2) move setting to external config;
3) improve documentation;
4) <del>create working sample of browser-based CMS to demonstrate usage of "always *index.html*" concept</del> - Done.
5) add FastCGI interface for interactivity with ready-to-use PHP code
=======
# 2c-server
Reporting system, provided to replace sharing and collecting excel documents. Based on nodejs server, NW.js thin client and LibreOffice Online for report editing.
TODO replace LibreOffice Online to OnlyOffice (build parts from sources) due to non-stable working of first one
>>>>>>> 9d1c4640717b8bd3bc9f6b698714b68b01f039d7
