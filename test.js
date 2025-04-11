const pool = require('./db');

pool.query('SELECT COUNT(*) FROM seats', (err, res) => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Total Seats:', res.rows[0].count);
    }
    pool.end();
});
