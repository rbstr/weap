const http = require('http');
const url = require('url');
const fs = require('fs');

const todos = [];

http.createServer(function(req, res) {

  var path;
  if(req.url === '/') {
    path = '/index.html';
  } else {
    path = req.url;
  }

  const filePath = './public' + path;

  fs.exists(filePath, function(exists) {
    if(exists) {
      fs.readFile(filePath, function(err, data) {
        if(err) {
          console.log(err.message);
          sendError(res, 500, 'There was a server error!');
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });
    } else {
      if(req.method === 'GET') {
        if(path === '/gettodos') {
          res.writeHeader(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(todos));
        } else {
          sendError(res, 404, "Page not found!");
        }
      } else if(req.method === 'POST') {
        if(path === '/addtodo') {
          var body = "";
          req.on('data', function(chunk) {
            body += chunk;
          });
          req.on('end', function() {
            var todo = {
              id: getRandomInt(10, 100000000),
              title: body,
              checked: false
            };

            todos.push(todo);
            res.writeHeader(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(todo));
          })
        } else {
          sendError(res, 404, "Page not found!");
        }
      } else if(req.method === 'DELETE') {
        if(path === '/deletetodo') {
          var body = "";
          req.on('data', function(chunk) {
            body += chunk;
          });
          req.on('end', function() {
            for(var i = 0; i < todos.length; i++) {
              var todo = todos[i];
              if(todo.id == body) {
                todos.splice(i, 1);
                break;
              }
            }
          })
          res.statusCode = 200;
          res.end();
        } else {
          sendError(res, 404, "Page not found!");
        }
      } else if(req.method === 'PUT') {
        if(path === '/modifytodo') {
          var bodyString = "";
          req.on('data', function(chunk) {
            bodyString += chunk;
          });
          req.on('end', function() {
            const body = JSON.parse(bodyString);
            for(var i = 0; i < todos.length; i++) {
              var todo = todos[i];
              if(todo.id == body.id) {
                todo.checked = body.checked;
                break;
              }
            }
          })
          res.statusCode = 200;
          res.end();
        } else {
          sendError(res, 404, "Page not found!");
        }
      } else {
        sendError(res, 404, "Unknown method!");
      }
    }
  });

}).listen(3001, function() {
  console.log('server is running.');
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function sendError(res, errorCode, message) {
  res.writeHead(errorCode, {'Content-Type' : 'text/plain'});
  res.end(message);
}
