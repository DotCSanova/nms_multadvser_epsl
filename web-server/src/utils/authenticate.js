const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if(!token) {
        return res.status(401).json({ message: 'No se proporcionó un token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        req.userId = decoded.userId;

        next();
    });

};

module.exports = authenticate;
