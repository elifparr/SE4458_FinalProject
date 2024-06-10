const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
    target: 'http://backend:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}));

app.use('/', createProxyMiddleware({
    target: 'http://frontend:8080',
    changeOrigin: true
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
