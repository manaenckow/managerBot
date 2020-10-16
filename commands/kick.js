module.exports = {
    regexp: /^(кик)$|(кик нахуй)$|(кик пидора)$|(rbr)$/i,
    callback: async (msg, text) => {
        const peer = msg.peer_id;
        const user = msg.from_id;
        let id = msg.fwd_messages[0] ? msg.fwd_messages[0].from_id : msg.reply_message.from_id;
        const api = msg.callMethod;
        const connection = msg.mysql;
        const conn = msg.asyncMysql;

        if((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

        const [curUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, user]);
        const [secondUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, id]);

        if ((curUser[0] && !secondUser[0]) || (curUser[0] && curUser[0].owner)) {
            api('messages.send', {
                chat_id: peer - 2e9,
                message: `#user${id < 0 ? -id : id}`,
                random_id: 0,
                v: '5.103'
            }).then((res) => {
                api('messages.removeChatUser', {
                    chat_id: peer - 2e9,
                    member_id: id < 0 ? -id : id,
                    v: '5.103'
                })
            });
        }
    },
};
