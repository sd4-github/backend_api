const jwt = require('jsonwebtoken');

    module.exports = (req, res, next) => {

        const authHeader = req.get('Authorization');
        console.log(authHeader);
        if (!authHeader) {
            const error = new Error('Not Authenticated');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split()[0];

        let decodeToken;

        try {
            decodeToken = jwt.verify(token, "SECRETPASS");
        }
        catch (err) {
            err.statusCode = 500;
            throw err;
        }

        if (!decodeToken) {
            const error = new Error('Not Authorize');
            error.statusCode = 401;
            throw error;
        }

        req.email = decodeToken.email;
        next()
    }
