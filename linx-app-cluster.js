var http = require('http');
var cluster = require('cluster')
, os = require('os')
;
var cpu_numbers = os.cpus().length;

var server = http.createServer(function (req, res) {

    /* For google chrome, one url request will generate two request, one for "/favicon.ico" the other for "/".
       So to avoid the second request in one url request, we should filter out the favicon.ico request. */
    if(req.url!='/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World from worker process ' + process.pid);
        console.log('Process request worker pid is ' + process.pid);
    }
})

// When app start.
if (cluster.isMaster) {
    // Print out the master pid.
    console.log('Master process id ' + process.pid)
    // Create worker process in cluster.
    for (var i = 0; i < cpu_numbers; i++) {
        // Invoke cluster fork method to create a cluster worker.
        var worker = cluster.fork();
        // Print out the worker pid.
        console.log('Worker ' + (i + 1) + ' process id ' + worker.process.pid);
    }
} else {
    // Make http web server listen on port 8000.
    server.listen(8000)
