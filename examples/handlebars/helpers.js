'use strict';
// Load modules

const Hapi = require('hapi');
const Vision = require('../..');
const Path = require('path');
const Handlebars = require('handlebars');


// Declare internals

const internals = {
    templatePath: 'withHelpers'
};

const today = new Date();
internals.thisYear = today.getFullYear();


const rootHandler = (request, h) => {

    const relativePath = Path.relative(`${__dirname}/../..`, `${__dirname}/templates/${internals.templatePath}`);

    return h.view('index', {
        title: `Running ${relativePath} | Hapi ${request.server.version}`,
        message: 'Hello Handlebars Helpers!',
        year: internals.thisYear,
        min: 0,
        max: 50
    });
};


internals.main = async () => {

    const server = Hapi.Server({ port: 3000 });

    await server.register(Vision);

    server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: `templates/${internals.templatePath}`,
        helpersPath: `templates/${internals.templatePath}/helpers`,
        isCached: false
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });

    await server.start();
    console.log('Server is running at ' + server.info.uri);
};


internals.main();
