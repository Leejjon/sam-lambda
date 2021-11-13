'use strict';

const app = require('../../app.js');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const axios = require('axios');
var event, context;

describe('Test unavailable', () => {
    let stub;
    beforeEach(() => {
        const stubbedResponse = {status: '403'};
        stub = sinon.stub(axios, "get").returns(new Promise((r) => r(stubbedResponse)));
    });
    after(function () {
        sinon.restore();
    });

    it('verifies forbidden response', async () => {
        const result = await app.lambdaHandler(event, context);

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal('Response status of https://direct.playstation.com/nl-nl');
        expect(response.status).to.be.equal("403");
    });
});

describe('Test available', () => {
    let stub;
    beforeEach(() => {
        const stubbedResponse = {status: '200'};
        stub = sinon.stub(axios, "get").returns(new Promise((r) => r(stubbedResponse)));
    });
    after(function () {
        sinon.restore();
    });

    it('verifies successful response', async () => {
        const result = await app.lambdaHandler(event, context);

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal('Response status of https://direct.playstation.com/nl-nl');
        expect(response.status).to.be.equal("200");
    });
});
