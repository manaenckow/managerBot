module.exports = {
    regexp: /^кик$/i,
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
            api('messages.send', {
                chat_id: peer - 2e9,
                message: `#user${id}`,
                random_id: 0,
                v: '5.103'
            }).then((res) => {
                api('messages.removeChatUser', {
                    chat_id: peer - 2e9,
                    member_id: id,
                    v: '5.103'
                })
            });
        }
    },
};
