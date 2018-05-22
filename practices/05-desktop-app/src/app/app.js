(function(w,d) {
    'use strict';

    const server = {
        protocol    : 'http',
        hostname    : 'localhost',
        port        : 8080,
        saveCharacter(body = null) {
            let request = new XMLHttpRequest();
            request.withCredentials = false;
            request.timeout = 60 * 1000;
            request.responseType = 'json';
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status >= 200 && request.status < 400) {
                        debugger;
                        form.toggle();
                        this.getCSV();
                    }
                }
            }.bind(this);
            let url = `${this.protocol}://${this.hostname}:3001/data`;
            request.open('POST', url);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(body));
        },
        getCSV      : function() {
            let request = new XMLHttpRequest();
            request.withCredentials = false;
            request.timeout = 60 * 1000;
            request.responseType = 'json';
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status >= 200 && request.status < 400) {
                        let table = document.createElement('table');
                        let tBody = document.createElement('tbody');
                        request.response.forEach(character => {
                            let tr = document.createElement('tr');
                            Object.keys(character).forEach(data => {
                                let td = document.createElement('td');
                                td.innerText = character[data];
                                tr.appendChild(td);
                            });
                            tBody.appendChild(tr);
                        });

                        let tHead = document.createElement('thead');
                        tHead.innerHTML = '<tr><th>LEVEL</th><th>NAME</th><th>RACE</th><th>CLASS</th></tr>';

                        table.appendChild(tHead);
                        table.appendChild(tBody);
                        d.querySelector('.table').innerHTML = '';
                        d.querySelector('.table').appendChild(table);
                    }
                }
            };
            let url = `${this.protocol}://${this.hostname}:3000/data`;
            request.open('GET', url);
            request.send();
        }
    };

    const form = {
        element : d.querySelector('#form-new-char'),
        toggle() {
            this.element.classList.toggle('open');
        },
        save() {
            let payload = {};
            ['level', 'character', 'race', 'class'].forEach(prop => {
                payload[prop] = this.element.querySelector(`#char-${prop}`).value;
            }, this);
            server.saveCharacter(payload);
        }
    };

    d.querySelector('#get-csv-btn').addEventListener('click', server.getCSV.bind(server));
    d.querySelector('#open-form').addEventListener('click', form.toggle.bind(form));
    d.querySelector('#close-form').addEventListener('click', form.toggle.bind(form));
    d.querySelector('#save-new-character').addEventListener('click', form.save.bind(form));

}(window, document));
