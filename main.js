const  {generateData} = require ("./generate-photos.js");

const http = require("http");
const fs = require("fs");
const path = require('path')
const busboy = require('busboy');

const data = generateData();
fs.writeFileSync("photos.txt", JSON.stringify(data.photos));
fs.writeFileSync("comments.txt", JSON.stringify(data.comments));
http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
    const url = request.url;
    if (request.method === "GET"){
    
        if(url === "/photos"){
            const dataPhotos = fs.readFileSync("photos.txt", "utf-8");

            response.write(dataPhotos);
            response.end();
        }

        if(url === "/comments"){
            const dataComments = fs.readFileSync("comments.txt", "utf-8");

            response.write(dataComments);
            response.end();
        }
    } else if(request.method === "POST"){
        if(url === "/sendform"){
            let filename = '';
            const bb = busboy({ headers: request.headers });
                bb.on('file', (name, file, info) => {
                filename = info.filename;
                const saveTo = path.join(__dirname, 'public/photos/', filename);
                file.pipe(fs.createWriteStream(saveTo));
                
            });
            bb.on('close', () => {
                console.log(filename);
                const data = generateData();
                fs.writeFileSync("photos.txt", JSON.stringify(data.photos));
                fs.writeFileSync("comments.txt", JSON.stringify(data.comments));
                const newPhoto = data.photos.find(photo => photo.url === `http://localhost:4000/photos/${filename}`);  
                response.write(JSON.stringify([newPhoto]));
                response.end();
            });
            request.pipe(bb);
        }
    }
    

    let filePath = path.join(__dirname, 'public', url)

    let contentType = 'text/html';

    let mimeType = path.extname(filePath)

    switch (mimeType) {
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.jpeg': contentType = 'image/jpeg'; break;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) return
        
        response.writeHead(200, { 'Content-Type':  contentType })
        response.end(data, 'utf8')
    
    })

}).listen(4000, function () {
    console.log("listen port 4000");
});

