'use strict'

// Initial Dependencies 
const express = require('express');
const app = express();
const cors = require('cors')
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./api/routes');

const config = require('config');
const appConfig = config.get('app');

// Logger 
const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger("MutantIdentifier-Server");

// Conections Data 
const port = process.env.PORT || appConfig.port;
const host = process.env.HOST || appConfig.host;

// Gral Config 
app.set('etag', false); /* Seguridad para HTTP Headers */
app.use(cors()); /* Seguridad para HTTP Headers */
app.use(helmet()); /* Seguridad para HTTP Headers */
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// App Creation 
const Appplication = { app }
routes(Appplication);

// Application Start-Up 
app.listen(port, host, function() {
    logger.info('MutantIdentifier app listening on port: ' + port);
});

module.exports = Appplication;