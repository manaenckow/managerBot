module.exports = {
    regexp: /^че там$/i,
    callback: async (msg, text) => {
        const peer = msg.peer_id;
        const user = msg.from_id;
        let id = msg.fwd_messages[0] ? msg.fwd_messages[0].from_id : msg.reply_message.from_id || 0;
        if(id === 0) {
            msg.send(`Произошёл мем, а точнее внутренная ошибка бота. Сообщите vk.me/manaenckov`);
            return;
        }
        const api = msg.callMethod;
        const connection = msg.mysql;
        const conn = msg.asyncMysql;
        
        if((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

        const [curUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, user]);
        const [secondUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, id]);

        if ((curUser[0] && !secondUser[0]) || (curUser[0] && curUser[0].owner)) {
                connection.query('SELECT * FROM warns WHERE vkid = ? AND chat = ?', [id, peer - 2e9],
                    (err,res) => {
                        if(!res[0]){
                            msg.send(`Предупреждений нет. #user${id}`);
                        } else {
                            msg.send(`Предупреждений ${res[0].warns ? `${res[0].warns}/3` : 'нет'}.  #user${id}`);
                        }
                    })
            }
    },
};
