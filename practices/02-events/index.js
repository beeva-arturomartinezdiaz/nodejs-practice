const EventsEmitter = require('events');

class FirstClass extends EventsEmitter
{
    constructor()
    {
        super();
        console.log('FirstClass created!');
        setTimeout(() => {
            this.emit('created');
        }, 10);
    }
    start()
    {
        console.log('FirstClass started!');
        this.emit('started');
    }
}
class SecondClass
{
    constructor()
    {
        console.log('SecondClass created!');
    }
}

let firstClassInstance = new FirstClass();
firstClassInstance.on('started', () => {
    new SecondClass();
});
firstClassInstance.on('created', firstClassInstance.start);
