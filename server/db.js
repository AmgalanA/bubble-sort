const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'amgalan',
    host: 'localhost',
    potr: 5432,
    database: 'bubblesortdb'
});

module.exports = pool;