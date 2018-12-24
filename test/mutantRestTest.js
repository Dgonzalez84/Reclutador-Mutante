'use strict'

require('dotenv').load();

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server.js');

const config = require('config');
const appConfig = config.get('app');

const port = process.env.PORT || appConfig.port;
const host = process.env.HOST || appConfig.host;

var req = request("http://" + host + ":" + port);

const MUTANT_DNA = ["ATGGCGT", "CAGGTTT", "TTATGGT", "AGAAGGT", "CCTCGTT", "TCAGCTT", "TCAGCTT"];
const HUMAN_DNA = ["CTTTCG", "CAGGTT", "TTATGG", "AGAAGG", "CCTCGT", "TCAGCT"];
const WRONG_DNA = ["CTTTCG", "CAGGTT", "TTATGG", "AGAAGG", "CCTCGT", "TCAGCT", "TCAGCT"];

describe('Chequeo general de Magneto para localizar mutantes', function() {
    describe('POST', function() {
        it('Testeo de un DNA Mutante Positivo', function(done) {
            req.post('/mutant')
                .send({ dna: MUTANT_DNA })
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    expect(res.body.message).to.be.equal('MUTANTE');
                    return done();
                });
        });

        it('Testeo de un DNA Mutante Negativo', function(done) {
            req.post('/mutant')
                .send({ dna: HUMAN_DNA })
                .expect(403)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    expect(res.body.message).to.be.equal('HUMANO');
                    return done();
                });
        });

        it('Testeo de un DNA con estructura erronea', function(done) {
            req.post('/mutant')
                .send({ dna: WRONG_DNA })
                .expect(500)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    expect(res.body.message).to.be.equal('No corresponde a una cadena de DNA completa');
                    return done();
                });
        });
    });
});


describe('Stats Check', function() {
    describe('GET', function() {
        it('Testeo la recuperacion de los STATS', function(done) {
            req.get('/stats')
                .send()
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    expect(res.body.message).to.be.equal('STATS');
                    return done();
                });
        });
    });
});