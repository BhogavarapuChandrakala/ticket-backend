const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',              // Default user
    host: 'localhost',             // Localhost
    database: 'postgres',     // The DB you created
    password: 'chandu123',     // Password you chose during install
    port: 5433                   // Default PostgreSQL port
});

module.exports = pool;
