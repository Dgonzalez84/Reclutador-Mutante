'use strict'

const config = require('config');
const appConfig = config.get('app');

// DB Config
const mongojs = require('mongojs');
const db = mongojs(appConfig.mongoUrl, ['stats']);
db.on('error', err => { logger.error('DB Error ' + err); })
db.on('connect', () => { logger.info('DB Conectada correctamente'); })

const log4js = require('log4js');
const logger = log4js.getLogger("mongoQuery");

module.exports = {

    insert: (data, mutant, count) => {
        return new Promise((resolve, reject) => {
            db.stats.save({
                dna: data,
                isMutant: mutant,
                sequences: count,
                createdAt: new Date()
            }, (err, response) => {
                if (err) {
                    logger.info("Error el insertar: " + err);
                    reject(err);
                } else {
                    logger.info("Se inserto un nuevo registro con exito");
                    resolve(response);
                }
            })
        })
    },

    getStats: () => {
        return new Promise((resolve, reject) => {
            db.stats.aggregate([
                { "$group": { _id: "$isMutant", count: { $sum: 1 } } }
            ], (err, response) => {
                if (err) {
                    logger.info("Error al buscar datos: " + err);
                    reject(err);
                } else {
                    logger.info("Se recuperaron los registros correctamente.");
                    resolve(response);
                }
            })
        })
    }
}