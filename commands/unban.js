module.exports = {
    regexp: /^разбан$/i,
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

            connection.query('SELECT * FROM bans WHERE user = ? AND chat = ?', [id, peer],
                (e,r) => {
                    if(!r[0]){
                        msg.send('Пользователь не заблокирован.');
                    } else {
                        msg.send(`Пользователь разблокирован. Теперь его можно добавить в чат. #bans #user${id}`)
                        connection.query('DELETE FROM bans WHERE user = ? AND chat = ?', [id, peer])
                    }
                })
        }
    },
};
