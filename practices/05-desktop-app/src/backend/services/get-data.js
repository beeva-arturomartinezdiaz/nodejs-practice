const MicroService = require('./_micro-service');

class GetData extends MicroService {
    constructor() {
        super(...arguments);
        this.name = `${this.name}.GetData`;
    }
    start() {
        super.start();

        this._app.get(this._config.path, this._handleRequest.bind(this));
        this._app.listen(this._config.port, () => {
            this.info(`Running @ http://localhost:${this._config.port}`);
        });
    }
    _handleRequest(req = null, res = null) {
        let status  = 200;
        let result = null;
        try {
            result = this._fm.getContent();
        } catch (e) {
            status = 500;
            result = {
                error: e.message
            };
        } finally {
            this.info(`[GET] ${req.url}`);
            this.info(`Result: [${status}] ${JSON.stringify(result)}`);
            res.type('json');
            res.status(status);
            res.end(JSON.stringify(result, null, 2));
        }
    }
}

module.exports = GetData;
