'use strict';

const fs = require('fs');
const path = require('path');

const http = require('http');
const https = require('https');
const parseUrl = require('url').parse;

const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

const version = require('./package.json').version;

function getMime(filename) {
    let ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'css': return 'text/css';
        case 'html': return 'text/html';
        case 'js': return 'application/javascript';
        case 'png': return 'image/png';
    }
    console.log("Unknown!", filename);
    return null;
}

//const StaticPath = path.resolve(__dirname, './peeping/');
const StaticPath = path.resolve(__dirname, './dist/');

function handler(request, response) {
    let isSecure = !!request.connection.ssl;

    let url = parseUrl(request.url);

    function sendContent(content, contentType) {
        response.writeHead(200, { "Content-Type": contentType });
        response.write(content);
        response.end();
    }

    function sendError(statusCode, reason) {
        response.writeHead(200, reason);
        response.end();
    }

    if (request.method === 'GET') {
        if (url.pathname.match(/\/$/)) { url.pathname += 'index.html'; }
        let filename = path.resolve(StaticPath, '.' + url.pathname);
        if (filename.substring(0, StaticPath.length) !== StaticPath) {
            console.log("Error: Out of snadbox");
            return sendError('403', 'Premission Denied');
        }

        try {
            let content = fs.readFileSync(filename);
            return sendContent(content, getMime(url.pathname));
        } catch (error) {
            if (error.code === 'ENOENT') {
                return sendError(404, 'Not Found');
            } else {
                console.log(error);
                return sendError(500, 'Server Error');
            }
        }

    } else {
        return sendError(400, 'Bad Request');
    }
}

https.createServer(options, handler).listen(8443);
