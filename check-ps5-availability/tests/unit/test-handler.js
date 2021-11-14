'use strict';

const app = require('../../app.js');
const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const expect = chai.expect;
var event, context;

describe('Test unavailable', () => {
    let axiosStub;
    beforeEach(() => {
        const status = '403';
        const error = new Error();
        error.response = {
            status: status
        }
        axiosStub = sinon.stub(axios, "get").throws(error);
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
        expect(response.message).to.be.equal('The PS5 is not available yet at https://direct.playstation.com/nl-nl');
        expect(response.status).to.be.equal("403");
    });
});

describe('Test available', () => {
    let axiosStub;
    beforeEach(() => {
        const stubbedResponse = {status: '200'};
        axiosStub = sinon.stub(axios, "get").returns(new Promise((r) => r(stubbedResponse)));
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
        expect(response.message).to.be.equal('The PS5 is available at https://direct.playstation.com/nl-nl');
        expect(response.status).to.be.equal("200");
    });
});
