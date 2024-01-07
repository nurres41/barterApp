//Protect API and Auth JWT Middleware

const { expressjwt }  = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET;

    return expressjwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path:[
            '/api/v1/user/login',
            '/api/v1/user/register',
        ]
    });
}

module.exports = authJwt;
 