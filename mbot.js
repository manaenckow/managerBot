const { Bot } = require('./lib/core.js');
const token = 'baa414d32219d2f96d3b5c0c375ed496a86a87e1b553ce7056d30d4055d997f5c96994cbc7ceab0b48c33';
const groupId = 191838894;

new Bot({token})
    .attachCommands('commands')
    .logProcessErrors()
    .initLongpoll(groupId)
    .catch(console.error);

console.log('Start');  
