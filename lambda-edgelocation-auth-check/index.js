'use strict';
// #############################################################################
// A lambda edge function that checks if the users has a cookie and is logged in
// #############################################################################
const jwt = require('jsonwebtoken'),
    moment = require('moment'),
    Keygrip = require("keygrip"),
    responseCode = '403';

const PRIVKEY = "usuallyiwouldstorethisinawssecretsmanagerbutthatcosts2dollarsamonthperkeyandthisisademo";

moment().format();

async function transformGivenCookie (strCookie, strTarget)  {
    return new Promise((resolve, reject) => {
        let cutArray = strCookie.split(';');
        let returnValue = '';
        cutArray.forEach((e) => {
            if (e.indexOf(strTarget) >= 0) {
                returnValue = e.replace(' ','').replace(strTarget,'');
            }
        })
        if ( returnValue !== '' ) {
            return resolve(returnValue);
        } else {
            return reject(returnValue);
        }
        
    });
}

async function decodeToken (token)  {
    return new Promise((resolve, reject) => {
        try {
            let decodedToken = jwt.decode(token);
            resolve(decodedToken);
        } catch(error){
            reject(error);
        }
        
    });
}

function decode64 (string) {
  var body = Buffer.from(string, 'base64').toString('utf8')
  return JSON.parse(body)
}

async function checkCreds (token, request, secret)  {
    return new Promise((resolve, reject) => {
    console.log('Started checkCreds....');
    
        try {
            jwt.verify(token, secret);
        } catch (error) {
            console.log('Error...Token not valid: ');
            const response = {
                status: responseCode,
                statusDescription: 'Token not valid',
                body: 'Token not valid',
            };
            resolve(response);
        }

        decodeToken(token).then((openToken) => {
            if ( moment(openToken.expires).isBefore(moment()) ) {
                console.log('Error...Token expired: ');
                const response = {
                    status: responseCode,
                    statusDescription: 'Token expired',
                    body: 'Token expired',
                };
                resolve(response);
            } else {
                resolve(request);
            }
            
        })
        .catch((error) => {
            console.log('Error...could not decode token');
            const response = {
                status: responseCode,
                statusDescription: 'Error decoding token',
                body: 'Error decoding token',
            };
            resolve(response);
        });
})};

exports.handler = async (event, context, callback) => {

    // Get request and request headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // let sessionSig;

    if ( headers.cookie ) {
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].value.indexOf('authorization') >= 0) {
                console.log('authorization cookie found. verifying');
                let authCookie = await transformGivenCookie(headers.cookie[i].value, 'authorization=');
                try {
                    const res = await checkCreds(authCookie, request, PRIVKEY);
                    callback(null, res);
                } catch (err) {
                    console.log('returned error:  ', err);
                    console.log('Error...No Cookie');
                    const response = {
                        status: responseCode,
                        statusDescription: 'Unauthorized',
                        body: 'Unauthorized',
                    };
                    callback(null, response);
                };
            }
        }
        // still here? cookies must not match what we want
        console.log('Error...No Cookie we want');
        const response = {
            status: responseCode,
            statusDescription: 'Unauthorized',
            body: 'Unauthorized',
        };
        callback(null, response);
    } else {
        console.log('Error...No Cookie');
        const response = {
            status: responseCode,
            statusDescription: 'Unauthorized',
            body: 'Unauthorized',
        };
        callback(null, response);
    }
    
};