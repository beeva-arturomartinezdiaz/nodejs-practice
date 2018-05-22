const EventsEmitter = require('events');
const express       = require('express');
const FileManager   = require('../utils/file-manager');

class MicroService extends EventsEmitter {
    constructor(config = null) {
        super();
        this.name       = 'MicroService';
        this._app       = null;
        this._config    = config;
        this._fm        = null;

        this._createFileManager();
    }
    error(message = '') {
        this._log('error', message);
    }
    info(message = '') {
        this._log('info', message);
    }
    start() {
        this._app = express();
    }
    _createFileManager() {
        this._fm = new FileManager();
        this._fm.on('file-manager-error', this.error.bind(this));
        try {
            this._fm.setFilePath(`../../../${this._config.ddbb}`);
        } catch (e) {
            this.error(e.message);
        }
    }
    _log(type = 'error', message = '') {
        this.emit(type, `[${this.name}] ${message}`);
    }
    _handleRequest() {
        this.error('Method "_handleRequest" must be implemented');
    }
}

module.exports = MicroService;
