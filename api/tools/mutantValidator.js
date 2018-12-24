'use strict'

const log4js = require('log4js');
const logger = log4js.getLogger("mutantValidator");

const FIX_PATTERN = /([A]{4}|[C]{4}|[T]{4}|[G]{4})/g; /** HORIZONTAL - VERTICAL PATTERN */

module.exports = {

    mutantCheck: async(data, max) => {
        //MATCH HORIZONTAL
        let horiz_match = 0;
        let plain_dna = convertToPlainString(data);
        if (plain_dna.match(FIX_PATTERN) != null)
            horiz_match = plain_dna.match(FIX_PATTERN).length;

        //MATCH VERTICAL
        let vert_match = 0;
        let inv_plain_dna = transposeMatrixToPlainString(data);
        if (inv_plain_dna.match(FIX_PATTERN) != null)
            vert_match = inv_plain_dna.match(FIX_PATTERN).length;

        //MATCH OBLICUO
        let letters = ['A', 'T', 'C', 'G'];
        let oblic_match = 0;
        letters.forEach(opc => {
            let pattern = new RegExp('[' + opc + '][ATCG]{' + max + '}[' +
                opc + '][ATCG]{' + max + '}[' +
                opc + '][ATCG]{' + max + '}[' +
                opc + '][ATCG]*', 'g');
            if (plain_dna.match(pattern) != null)
                oblic_match += plain_dna.match(pattern).length;
        });

        /** Se retorna la suma de las secuencias encontradas */
        let total = horiz_match + vert_match + oblic_match;
        logger.info('Total Sequences: ' + total);
        return total;
    }
}


const convertToPlainString = dna => {
    let plain = "";
    dna.forEach(element => {
        plain += element;
    });
    return plain;
}

const transposeMatrixToPlainString = dna => {
    let convert = "";
    for (let col = 0; col < dna.length; col++) {
        for (let fila = 0; fila < dna.length; fila++) {
            convert += dna[fila][col];
        }
    }
    return convert;
}