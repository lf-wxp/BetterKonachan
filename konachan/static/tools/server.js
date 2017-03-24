const http = require('http');
const fs = require('fs');
const path = require('path');
http.createServer((req,res)=>{
    let file = path.basename(req.url) || 'index.html';
    if(file === 'index.css') {
        file = 'css/' + file;
    }
    fs.readFile('dist/' + file, 'utf8',(err,data) => {
        if(err) {
        } else {
            res.write(data);
        }
        res.end();
    });
}). listen(8888);