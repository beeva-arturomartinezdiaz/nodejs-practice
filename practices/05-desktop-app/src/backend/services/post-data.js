const MicroService  = require('./_micro-service');
const bodyParser    = require('body-parser');

class PostData extends MicroService {
    constructor() {
        super(...arguments);
        this.name = `${this.name}.PostData`;
    }
    start() {
        super.start();

        this._app.post(this._config.path, bodyParser.json(), this._handleRequest.bind(this));

        this._app.listen(this._config.port, () => {
            this.info(`Running @ http://localhost:${this._config.port}`);
        });
    }
    _handleRequest(req = null, res = null) {
        let status  = 200;
        let result = null;
        try {
            result = this._fm.addContent(req.body);
        } catch (e) {
            status = 500;
            result = {
                error: e.message
            };
        } finally {
            if (typeof result === 'number') {
                result = {
                    numRows: result
                };
            }
            this.info(`[POST] ${req.url}`);
            this.info(`Result: [${status}] ${JSON.stringify(result)}`);
            res.type('json');
            res.status(status);
            res.end(JSON.stringify(result, null, 2));
        }
    }
}

module.exports = PostData;
