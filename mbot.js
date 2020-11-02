const {Bot} = require('./lib/core.js');
const {token} = require('./config.json');
const groupId = 191838894;

new Bot({token})
    .attachCommands('commands')
    .logProcessErrors()
    .initLongpoll(groupId)
    .catch(console.error);

console.log('Start');  
