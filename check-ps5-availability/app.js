const aws = require('aws-sdk');
const axios = require('axios');
const URL = 'https://direct.playstation.com/nl-nl';
const PS5_AVAILABLE = 'The PS5 is available at ' + URL;
const PS5_UNAVAILABLE = 'The PS5 is not available yet at ' + URL;

const ses = new aws.SES({ region: 'eu-central-1'});
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
                message: PS5_AVAILABLE,
                status: status
            })
        };

        var params = {
            Destination: {
                ToAddresses: ["leejjon@gmail.com"],
            },
            Message: {
                Body: {
                    Text: { Data: "Go to " + URL },
                },
                Subject: { Data: "It's now possible to purchase a PS5 at Sony" },
            },
            Source: "leejjon@gmail.com",
        };

        await ses.sendEmail(params).promise();

        return response;
    } catch (err) {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: PS5_UNAVAILABLE,
                status: err.toString().substr(err.toString().length - 3)
            })
        };
        return response;
    }
};

const checkIfPs5IsForSaleInNetherlands = async () => {
    try {
        const {status} = await axios.get(URL);
        return status;
    } catch (err) {
        const {response} = err;
        const {status} = response;
        throw new Error(status);
    }
}
