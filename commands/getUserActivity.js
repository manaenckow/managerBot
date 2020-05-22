module.exports = {
    regexp: /(\/|!)info/,
    callback: (msg, text) => {
        const peer = msg.peer_id;
        let id = msg.from_id;
        const api = msg.callMethod;
        const connection = msg.mysql;

        if (msg.fwd_messages[0]) {
            id = msg.fwd_messages[0].from_id
        } else if (msg.reply_message) {
            id = msg.reply_message.from_id
        }

        if((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

        connection.query('SELECT * FROM active WHERE chat = ? AND user = ?',
            [peer, id], (err,res) => {
                if(res){
                    msg.send(`${res[0].count} сообщений (с момента приглашения бота).`)
                }
            })
    },
};
