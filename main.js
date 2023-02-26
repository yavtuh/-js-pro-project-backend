const  {comments, photos} = require ("./generate-photos.js");

const http = require("http");
const fs = require("fs");


fs.writeFileSync("photos.txt", JSON.stringify(photos));
fs.writeFileSync("comments.txt", JSON.stringify(comments));
http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
    const url = request.url;

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

}).listen(4000, function () {
    console.log("listen port 4000");
});