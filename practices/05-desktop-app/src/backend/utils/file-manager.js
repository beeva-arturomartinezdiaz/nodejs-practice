const path          = require('path');
const fs            = require('fs');
const EventsEmitter = require('events');

/**
 * Handles read/write into data.csv file
 * @class   FileManager
 * @extends EventsEmitter
 */
module.exports = class FileManager extends EventsEmitter
{
    constructor(charset = 'utf8')
    {
        super();
        this._charset = charset;
        this._filePath = null;
    }

    setFilePath(filePath = '')
    {
        filePath = path.resolve(__dirname, filePath);
        let fileExists = fs.existsSync(filePath);
        if (!fileExists)
        {
            this.emit('file-manager-error', `${filePath} does not exists!`);
            filePath = '';
        }
        this._filePath = filePath;
    }

    getContent()
    {
        let result;
        let content = fs.readFileSync(this._filePath, this._charset).toString();
        if (typeof content === 'string' && content.length)
        {
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
        }
        return result;
    }

    addContent(data = null)
    {
        let numRows = 0;

        if (data !== null && Array.isArray(data))
        {
            data.forEach(item => {
                numRows += this.addContent(item);
            });
        }
        else if (data !== null && typeof data === 'object')
        {
            let row = [];
            if (this._filePath)
            {
                ['level', 'character', 'race', 'class'].forEach(prop => {
                    row.push(data[prop]);
                });
                fs.appendFileSync(this._filePath, `${row.join(';')}\n`, this._charset);
                numRows++;
            } else {
                throw Error('data.csv file could NOT be loaded!');
            }
        }

        return numRows;
    }
};
