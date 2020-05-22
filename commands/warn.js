module.exports = {
    regexp: /^пред$/i,
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

            connection.query('SELECT * FROM warns WHERE vkid = ? AND chat = ?', [id, peer - 2e9], (err,res) => {
                if(!res[0]){
                    api('users.get', {
                        user_ids: id,
                        fields: 'sex'
                    }).then(rr => {
                        msg.send(`@id${id}(${rr[0].first_name}) ${rr[0].sex === 1 ? 'получила' : 'получил'} предупреждение 1/3. Старайтесь быть культурнее. #user${id}`);
                    })
                    connection.query('INSERT INTO warns (vkid, chat) VALUES (?, ?)', [id, peer - 2e9])
                } else if(res[0].warns < 2) {
                    api('users.get', {
                        user_ids: id,
                        fields: 'sex'
                    }).then(rr => {
                        msg.send(`@id${id}(${rr[0].first_name}) ${rr[0].sex === 1 ? 'получила' : 'получил'} предупреждение ${res[0].warns+1}/3. Старайтесь быть культурнее. #user${id}`);
                    })
                    connection.query('UPDATE warns SET warns = warns + 1 WHERE vkid = ?', [id]);
                } else {
                    connection.query('UPDATE warns SET warns = 0 WHERE vkid = ?', [id]);
                    api('messages.send', {
                        chat_id: peer - 2e9,
                        message: `Увы, предупреждения были бесполезны. #user${id}`,
                        random_id: 0
                    }).then((res) => {
                        api('messages.removeChatUser', {
                            chat_id: peer - 2e9,
                            member_id: id
                        })
                    });
                }
            })
        }
    },
};
