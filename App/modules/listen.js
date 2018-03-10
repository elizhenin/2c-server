module.exports = function(Environment){
    var port = process.env.PORT || Environment.listen_port;
    Environment.app.listen(port, function() {
        console.log("Listening on " + port);
    });
};