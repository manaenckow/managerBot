module.exports = {
    regexp: /^снять$/i,
    callback: async (msg, text) => {
        const peer = msg.peer_id;
        const user = msg.from_id;
        let id;
        const api = msg.callMethod;
        const connection = msg.mysql;
        const conn = msg.asyncMysql;

        if (msg.fwd_messages[0]) {
            id = msg.fwd_messages[0].from_id
        } else if (msg.reply_message) {
            id = msg.reply_message.from_id
        }

        if((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

        const [curUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, user]);
        const [secondUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, id]);

        if ((curUser[0] && !secondUser[0]) || (curUser[0] && curUser[0].owner)) {
            connection.query('SELECT * FROM warns WHERE vkid = ? AND chat = ?', [id, peer - 2e9],
                (err,res) => {
                    if(!res[0]){
                        msg.send(`Предупреждений и так нет.`);
                    } else if(res[0].warns > 0) {
                        connection.query('UPDATE warns SET warns = warns - 1 WHERE vkid = ?', [id]);
                        msg.send(`С @id${id}(вас) снято предупреждение. Осталось ${res[0].warns-1}/3. #user${id}`);
                    } else {
                        msg.send(`Предупреждений и так нет.`);
                    }
                })
        }
    },
};
