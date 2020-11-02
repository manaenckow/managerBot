const {Bot} = require('./lib/core.js');
const {token, groupId} = require('./config.json');

new Bot({token})
    .attachCommands('commands')
    .logProcessErrors()
    .initLongpoll(groupId)
    .catch(console.error);

console.log('Start');  
