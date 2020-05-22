module.exports = {
    regexp: /^амнистия$/i,
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
        
        if((peer - 2e9) < 0 || parseInt(id) < 0) return;

        const [curUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, user]);
        const [secondUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, id]);

        if ((curUser[0] && !secondUser[0]) || (curUser[0] && curUser[0].owner)) {
            connection.query('UPDATE warns SET warns = 0 WHERE vkid = ? AND chat = ?', [id, peer - 2e9]);
            msg.send(`С @id${id}(вас) сняты все предупреждения. #user${id}`);
        }
    },
};
