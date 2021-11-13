const axios = require('axios');
const url = 'https://direct.playstation.com/nl-nl';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        const status = await checkIfPs5IsForSaleInNetherlands();
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Response status of https://direct.playstation.com/nl-nl',
                status: status
            })
        };
        return response;
    } catch (err) {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Response status of https://direct.playstation.com/nl-nl',
                status: err.toString().substr(err.toString().length - 3)
            })
        };
        return response;
    }
};

const checkIfPs5IsForSaleInNetherlands = async () => {
    try {
        const {status} = await axios.get(url);
        return status;
    } catch (err) {
        const {response} = err;
        const {status} = response;
        throw new Error(status);
    }
}
