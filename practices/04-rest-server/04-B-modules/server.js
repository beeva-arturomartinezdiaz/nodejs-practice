const EventsEmitter = require('events');
const http          = require('http');
const FileManager   = require('./file-manager');

/**
 * Creates a HTTP Rest Full server to handle GET/POST /data requests.
 * @class   server
 * @extends EventsEmitter
 */
module.exports = class Server extends EventsEmitter
{
    constructor(config = {})
    {
        super();

        this._fm = new FileManager(config.charset);
        this._fm.setFilePath(config.filePath);
        this._fm.on('file-manager-error', e => {
            this.emit('server-error', e);
        });
        this._payload = '';
        this._config = config;
        if (!this._config.hasOwnProperty('port'))
        {
            this._config.port = 3000;
        }

        this._lastRequest = null;
        this._lastResponse = null;

        this._server = http.createServer(this._parseRequest.bind(this));
    }

    start()
    {
        this._server.listen(this._config.port, () => {
            this.emit('server-info', `Server running @ http://${this._config.hostname}:${this._config.port}`);
        });
    }

    _parseRequest(req = null, res = null)
    {
        this.emit('server-info', `${req.method.toUpperCase()} :: ${req.url}`);

        //Fetch request payload
        req.on('data', chunk => {
            this._payload += chunk;
        });

        this._lastRequest = req;
        this._lastResponse = res;
        req.on('end', this._evalRequest.bind(this));
    }

    _parseRequestURL(url = '')
    {
        if (typeof url === 'string' && url.charAt(0) === '/') {
            url = url.substr(1);
        }
        return url;
    }

    _evalRequest()
    {

        let url = this._parseRequestURL(this._lastRequest.url);
        let method = this._lastRequest.method.toUpperCase();

        let result = {};
        let status = 200;

        switch (url)
        {
            case 'data':
                switch (method)
                {
                    case 'GET':
                        result = this._fm.getContent();
                        break;
                    case 'POST':
                        try
                        {
                            result.newRows = this._fm.addContent(JSON.parse(this._payload));
                        }
                        catch (e)
                        {
                            status = 400;
                            result.error = e.message;
                        }
                        break;
                    default:
                        status = 500;
                        result.error = `Unsupported method [${method}]`;
                }
                break;
            default:
                status = 404;
                result = {
                    error: `Invalid URL: /${url}`
                };
                this.emit('server-error', result.error);
        }

        this._finishRequest(status, result);
    }

    _finishRequest(status = 200, result = null,)
    {
        this.emit('server-info', `Returning: ${status} :: ${JSON.stringify(result)}`);
        this._lastResponse.statusCode = status;
        this._lastResponse.setHeader('Content-Type', 'application/json');
        this._lastResponse.end(JSON.stringify(result, null, 2));
    }
};
