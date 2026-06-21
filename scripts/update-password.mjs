import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const hash = bcrypt.hashSync('@4dminSejak1981', 10);
console.log('New hash:', hash);

const conn = mysql.createConnection({ host: 'localhost', user: 'root', database: 'webannajah' });

conn.query("UPDATE User SET password = ? WHERE email = '4dminSejak1981@smaannajah.sch.id'", [hash], (err, result) => {
  if (err) { console.error('Error:', err); process.exit(1); }
  console.log('Updated:', result.affectedRows, 'rows');
  
  conn.query("SELECT password FROM User WHERE email = '4dminSejak1981@smaannajah.sch.id'", (err, rows) => {
    if (err) { console.error('Error:', err); process.exit(1); }
    console.log('Stored hash:', rows[0].password);
    console.log('Verify match:', bcrypt.compareSync('@4dminSejak1981', rows[0].password));
    conn.end();
  });
});
