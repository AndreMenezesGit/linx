var express = require('express');
var app = express();

app.get('/', function (req, res) {
res.send('Hello World! Tum!');
/*res.send('Hello World com zero downtime!!!');*/
});

app.listen(3000, function () {
console.log('Example app listening on port 3000!');
});
