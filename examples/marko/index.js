'use strict';
// Load modules

const Hapi = require('hapi');
const Vision = require('../..');
const Path = require('path');
const Marko = require('marko');


// Declare internals

const internals = {
    templatePath: '.'
};

const today = new Date();
internals.thisYear = today.getFullYear();


const rootHandler = (request, h) => {

    const relativePath = Path.relative(`${__dirname}/../..`, `${__dirname}/templates/${internals.templatePath}`);

    return h.view('index', {
        title: `Running ${relativePath} | Hapi ${request.server.version}`,
        message: 'Hello Marko!',
        year: internals.thisYear
    });
};

internals.main = async () => {

    const server = Hapi.Server({ port: 3000 });

    await server.register(Vision);

    server.views({
        engines: {
            marko: {
                compile: (src, options) => {

                    const params = { preserveWhitespace: true, writeToDisk: false };

                    const template = Marko.load(options.filename, params);

                    return (context) => {

                        return template.renderToString(context);
                    };
                }
            }
        },
        relativeTo: __dirname,
        path: `templates/${internals.templatePath}`
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });

    await server.start();
    console.log('Server is running at ' + server.info.uri);
};

internals.main();
