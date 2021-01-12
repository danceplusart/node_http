const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 5000;
const list = [];

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Charset', 'UTF-8');
            res.end(fs.readFileSync('index.html'), 'UTF-8', null);
            break;
        case '/messages':
            if(req.method == 'GET')
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Charset', 'UTF-8');
                res.end(JSON.stringify(list));
                break;
            }
            req.on('data', (chunk) => {
                
                let obj = JSON.parse(chunk.toString('UTF-8'));
                if(!obj && !obj.message)
                {
                    res.statusCode = 400;
                    res.end();
                    return;
                }
                list.unshift({message: obj.message});
                list.splice(5);
                res.statusCode = 200;
                res.end();
            });
            break;
        default:
            res.statusCode = 404;
            res.end();
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}/`);
});