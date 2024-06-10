const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const decoded = jwt.verify(token, 'secretkey');
        if (decoded.role !== 'admin') {
            return res.status(403).send('Erişim izni yok');
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

module.exports = admin;
