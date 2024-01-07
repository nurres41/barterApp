//Protect API and Auth JWT Middleware

const { expressjwt }  = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET;

    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            '/api/v1/users/login',
            '/api/v1/users/register',
        ]
    });
}

// Eger admin ise diger method ve pathleri kullandirmaya izin verir. 
async function isRevoked(req, payload, done) {
    if(!payload.isAdmin){
        done(null, true)
    }
    done()
}

module.exports = authJwt;
 