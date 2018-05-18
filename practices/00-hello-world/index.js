/* Run this script $ node index.js */

const os = require('os');

let platform = os.platform();
switch (platform)
{
    case 'win32':
        platform = 'Windows';
        break;
    case 'darwin':
        platform = 'MacOS';
        break;
    case 'android':
        platform = 'Android';
        break;
    default:
        platform = 'Unix';
        break;
}

console.log('Hello World!');
console.log(`Running Node ${process.version} in a ${platform}`);
