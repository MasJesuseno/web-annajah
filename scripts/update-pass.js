const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

const hash = bcrypt.hashSync('@4dminSejak1981', 10);
console.log('New hash:', hash);

// Write SQL to a temp file to avoid escaping issues
const fs = require('fs');
const sql = "UPDATE User SET password='" + hash + "' WHERE email='4dminSejak1981@smaannajah.sch.id';\n";
fs.writeFileSync('/tmp/update.sql', sql);
console.log('SQL file written');

// Execute the SQL file
execSync('mysql -u root webannajah < /tmp/update.sql', { stdio: 'inherit' });
console.log('MySQL update done');

// Verify
const result = execSync("mysql -u root webannajah -e \"SELECT password FROM User WHERE email='4dminSejak1981@smaannajah.sch.id'\"", { encoding: 'utf8' });
console.log('Stored hash:', result.trim());

// Verify the hash matches
const storedHash = result.trim().split('\n')[1]; // Skip header
console.log('Verify match:', bcrypt.compareSync('@4dminSejak1981', storedHash));
