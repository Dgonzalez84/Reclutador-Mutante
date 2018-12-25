'use strict'

const log4js = require('log4js');
const logger = log4js.getLogger("mutantController");

const validator = require('../tools/mutantValidator');
const db = require('../dao/querys');

var tamañoMatriz;

module.exports = {

    isMutant: async(req, res) => {
        let dna = req.body.dna;
        try {
            validarMatrizNxN(dna);
            let count = await validator.mutantCheck(dna, tamañoMatriz);

            /** Es mutante si existe mas de una secuencia de las 4 letras indicadas */
            if (count > 1) {
                await db.insert(dna, true, count);
                genericResponse(res, "MUTANTE", 200, "OK");
            } else {
                await db.insert(dna, false, count);
                genericResponse(res, "HUMANO", 403, "FORBIDDEN");
            }
        } catch (error) {
            logger.error(error.stack);
            genericResponse(res, error.message, 500, "");
        }
    },

    getStats: async(req, res) => {
        let statsInfo = "SIN DATOS";
        try {
            let response = await db.getStats();
            if (response.length > 0) {
                statsInfo = parseResponse(response);
            }
            genericResponse(res, "STATS", 200, statsInfo);
        } catch (error) {
            logger.error(error.stack);
            genericResponse(res, error.message, 500, "");
        }
    }
}

/**
 * Respuesta Generica para todos los resultados generados
 * @param {*} response 
 * @param {*} message 
 * @param {*} status 
 * @param {*} data 
 */
const genericResponse = (response, message, status, data) => {
    response.status(status);
    response.json({
        status: status,
        message: message,
        data: data
    });
}

/**
 * Valida que se sea NxN y por lo menos con 4 filas/columnas
 * @param {*} dna 
 */
const validarMatrizNxN = dna => {
    validarElementos(dna);
    if ((dna.length === dna[0].length) && dna.length >= 4) {
        tamañoMatriz = dna.length;
    } else {
        throw new Error('No corresponde a una cadena de DNA completa');
    }
}

/**
 * Valida el numero de elementos de la matriz
 * @param {*} dna 
 */
const validarElementos = dna => {
    let anterior = dna[0];
    dna.forEach(element => {
        if (element.length === anterior.length) {
            anterior = element;
        } else {
            throw new Error('No corresponde a una cadena de DNA completa');
        }
    });
}

/**
 * Recupera los datos y los ordena para mostrar
 * @param {*} response 
 */
const parseResponse = response => {
    let stats = {};
    return stats = {
        count_mutant_dna: response[1].count,
        count_human_dna: response[0].count,
        ratio: response[0].count / response[1].count,
    }
}