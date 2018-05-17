/**
 * 04. REST SERVER
 *
 * Target: create a rest-full server which allows to return data into JSON format and to save new data
 *
 * "GET /data" should return current content from "data.csv" file into JSON format:
 *  [
 *      {
 *          level: 1-10,
 *          character: String,
 *          race: String,
 *          class: String
 *      },
 *      ...
 *  ]
 *
 * "POST /data" should add new content into "data.csv" file with the right format.
 * Will admit a request payload body with following format:
 *  [{level: 1-10, character: String, race: Human|Orc|Beast, class: Warrior|Mage|Paladin|Warlock|Priest} ... ]
 * Will return number of new lines added to "data.csv" file.
 *
 * First row from "data.csv" is the data headers, and should not be erased at all
 *
 * Server should contemplate and return errors in JSON format: {error: Number, message: String}
 */

const path = require('path');
const fs = require('fs');
const http = require('http');

const hostname = 'localhost';
const port = 8080;
const charset = 'utf-8';

function loadCSVFile()
{
    let result = {};
    let filePath = path.resolve(__dirname, 'data.csv');
    if (fs.existsSync(filePath))
    {
        let content = fs.readFileSync(filePath, charset).toString();
        content = content.split('\n');
        content.shift();
        content.pop();
        result = content.map(item => {
            item = item.split(';');
            let parsed = {
                level: null,
                character: null,
                race: null,
                class: null
            };
            ['class', 'race', 'character', 'level'].forEach(prop => {
                parsed[prop] = item.pop();
            });
            return parsed;
        });
    } else {
        result.error = '0002';
        result.message = 'data.csv file could NOT be loaded!';
    }
    return result;
}

function addNewData(data = null)
{
    let newRows = 0;
    let error;

    if (data !== null && Array.isArray(data))
    {
        data.forEach(item => {
            newRows += addNewData(item);
        });
    }
    else if (data !== null && typeof data === 'object')
    {
        let row = [];
        let filePath = path.resolve(__dirname, 'data.csv');
        if (fs.existsSync(filePath))
        {
            ['level', 'character', 'race', 'class'].forEach(prop => {
                row.push(data[prop]);
            });
            fs.appendFileSync(filePath, `${row.join(';')}\n`, charset);
            newRows++;
        } else {
            error = {};
            error.error = '0003';
            error.message = 'data.csv file could NOT be loaded!';
        }
    }

    return !!error ? error : newRows;
}

function finishRequest(status = 200, result = null, res = null)
{
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result, null, 2));
}

const server = http.createServer((req, res) => {

    let url = req.url;
    if (url.charAt(0) === '/') {
        url = url.substr(1);
    }

    let result = {};

    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    switch (url)
    {
        case 'data':
            switch(req.method.toUpperCase())
            {
                case 'GET':
                    result = loadCSVFile();
                    finishRequest(200, result, res);
                    break;
                case 'POST':
                    req.on('end', () => {
                        result = addNewData(JSON.parse(body));
                        let status = 200;
                        if (typeof result === 'object') {
                            status = 400;
                        } else {
                            result = {numRows: result};
                        }
                        finishRequest(status, result, res);
                    });
                    break;
            }
            break;
        default:
            result.error = '0001';
            result.message = `Invalid server path: ${req.url}`;
            finishRequest(400, result, res);
    }
});

server.listen(port, () => {
    console.log(`Server running @ http://${hostname}:${port}`);
});
