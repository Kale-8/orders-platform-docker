// Configuración de PM2 para modo cluster
module.exports = {
    apps: [
        {
            name: 'fastfood-api',
            script: 'dist/server.js',
            instances: 'max',            // lanzar tantos procesos como núcleos
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: process.env.PORT
            }
        }
    ]
};