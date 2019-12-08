'use strict';
// #########################################################
// A lambda function to authenticate users and drop a cookie
// #########################################################
const jwt = require('jsonwebtoken'),
    moment = require('moment'),
    bcrypt = require('bcryptjs');

const validUserList = { "validUsers": [
    {
        "user": "gooch",
        "pass": "$2a$15$LTsoGSxQuGGJaaMcgUjAm.Sh/OZKW/nbGype4l64azepT7UpQlU3K" //password
    }
]};

const PRIVKEY = "usuallyiwouldstorethisinawssecretsmanagerbutthatcosts2dollarsamonthperkeyandthisisademo";

moment().format();

async function checkCreds (user, pass)  {
    console.log('Started checkCreds....');
    try {
        let selectedUser = validUserList.validUsers.find(validUser => validUser.user === user);
        if (!selectedUser) {
            console.log('No user found');
            return Promise.reject('Forbidden: not allowed');
        } else {
            const valid = await bcrypt.compare(pass, selectedUser.pass)
            if (!valid) {
                console.log('Invalid password');
                return Promise.reject('Forbidden: not allowed');
            } else {
                console.log('returning user');
                return Promise.resolve(selectedUser);
            }
        }
    } catch (err) { 
        return Promise.reject(err);
    }

};

// async function makeNewPassword(pass) {
//     console.log(pass);
//     // const salt = bcrypt.genSaltSync(10);
//     const password = await bcrypt.hash(pass, 15);
//     console.log(password);
// }

exports.handler = async (event, context) => {

        if (!event.body.user || !event.body.password) {
            context.done('Forbidden: ', 'error');
        }

        let selectedUser = await checkCreds(event.body.user.replace(/%21/g, '!').replace(/%2A/g, '*'), event.body.password.replace(/%21/g, '!').replace(/%2A/g, '*'));
        try {
            if (selectedUser) {
                const tokenModel = {
                    userId: selectedUser.user, 
                    expires: moment().add(1, 'days')
                };
                const token = jwt.sign(tokenModel, PRIVKEY);
                const response = {
                    status: '200',
                    statusDescription: 'Authorized',
                    body: 'Authorized',
                    headers: {
                        'Authorization': [{key: 'Authorization', value: token}]
                    },
                };
                console.log('returned response');
                context.done(null, response);
            } else {
                console.log('finished with no selected user')
                context.done('Forbidden: ', 'error');
            }
        } catch(err) {
            console.log('returned error:  ', err);
            context.done('Forbidden: ', 'error');
        };

// TODO: add cognito or a dynamodb backend
};