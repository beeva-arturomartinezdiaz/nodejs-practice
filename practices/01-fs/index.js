const fs        = require('fs');
const path      = require('path');
const charset   = 'utf-8';

let filePath = path.resolve(__dirname, 'data.txt');
if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, charset).toString();
    let rows = content.split(/\n/g);
    let items = [];
    rows.forEach(row => {
        row = row.split(';');
        row.shift();
        if (Array.isArray(row) && row.length) {
            items.push({item: row[0], price: row[1]});
        }
    });
    fs.writeFileSync(path.resolve(__dirname, 'data.json'), JSON.stringify(items, null, 2), charset);
}
