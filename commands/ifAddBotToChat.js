const self = {
    attach: (vk) => {
        vk.on('message_new', ({ object }) => {
            self.onEvent(vk, object);
        });
    },
    onEvent: (vk, data) => {
        const connection = vk.connection;
        const api = vk.callMethod;
        const msg = data;
 
        const { peer_id, from_id } = msg;

        const action = msg.action;
        if(action && action.type === 'chat_invite_user' && action.member_id === -191838894){
            api('messages.send', {
                chat_id: peer_id - 2e9,
                message: 'Привет! Для моей работы необходимо выдать права администратора и написать /готово.',
                random_id: 0
            })
        } else {
            connection.query('SELECT * FROM active WHERE chat = ? AND user = ?',
                [peer_id, from_id], (err,res) => {
                    if(!res[0]){
                        connection.query('INSERT INTO active (chat, user) VALUES (?, ?)',
                            [peer_id, from_id]);
                    } else {
                        connection.query('UPDATE active SET count = count + 1 WHERE chat = ? AND user = ?',
                            [peer_id, from_id]);
                    }
                })
        }
    }
};

module.exports = self;
