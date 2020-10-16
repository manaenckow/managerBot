let posts = [];
setInterval(() => {
    if(posts.length){
        posts.shift();
    }
}, 3600000)
const self = {
    attach: (vk) => {
        vk.on('message_new', ({object}) => {
            self.onEvent(vk, object);
        });
    },
    onEvent: (vk, data) => {
        const connection = vk.connection;
        const api = vk.callMethod;
        const msg = data;

        const {peer_id, from_id} = msg;

        const action = msg.action;

        if (parseInt(peer_id) === 2000000209) {

            const clipsToken = '9d4fb5e6e0e6d4527e79a965e05fa4b72786ac5d54d9a7364cea35c7e4d541fdfd8496e07d9ea583a1702';

            if (msg.attachments && msg.attachments[0] && msg.attachments[0].type === 'video') {

                if (posts.length) {
                    if(posts.includes(`video${msg.attachments[0].video.owner_id}_${msg.attachments[0].video.id}`)){
                        api('messages.send', {
                            chat_id: peer_id - 2e9,
                            message: 'Такой клип уже был сегодня',
                            random_id: 0
                        });
                        return;
                    }
                    api('messages.send', {
                        chat_id: peer_id - 2e9,
                        message: 'кинул в отложку',
                        random_id: 0
                    });
                    api('wall.post', {
                        owner_id: -185937018,
                        message: msg.text || ' ',
                        from_group: 1,
                        access_token: clipsToken,
                        publish_date: Math.floor(Date.now() / 1000) + (4000 * posts.length),
                        attachments: `video${msg.attachments[0].video.owner_id}_${msg.attachments[0].video.id}`
                    });
                    posts.push(`video${msg.attachments[0].video.owner_id}_${msg.attachments[0].video.id}`);
                    return;
                }

                api('wall.post', {
                    owner_id: -185937018,
                    message: msg.text || '   ',
                    from_group: 1,
                    access_token: clipsToken,
                    attachments: `video${msg.attachments[0].video.owner_id}_${msg.attachments[0].video.id}`
                });
                api('messages.send', {
                    chat_id: peer_id - 2e9,
                    message: 'Клип опубликован.',
                    random_id: 0
                });
                posts.push(`video${msg.attachments[0].video.owner_id}_${msg.attachments[0].video.id}`);
            }
        }

        if (action && action.type === 'chat_invite_user') {
            if (action.member_id === -191838894) {
                api('messages.send', {
                    chat_id: peer_id - 2e9,
                    message: 'Привет! Для моей работы необходимо выдать права администратора и написать /готово.',
                    random_id: 0
                })
            } else {
                connection.query('SELECT * FROM bans WHERE chat = ? AND user = ?', [peer_id, action.member_id],
                    (err, res) => {
                        if (res[0]) {
                            api('messages.send', {
                                chat_id: peer_id - 2e9,
                                message: `Пользователь заблокирован администратором. #bans #user${action.member_id}`,
                                random_id: 0
                            }).then((res) => {
                                api('messages.removeChatUser', {
                                    chat_id: peer_id - 2e9,
                                    member_id: action.member_id,
                                    v: '5.103'
                                })
                            });
                        }
                    })
            }

        } else {
            connection.query('SELECT * FROM active WHERE chat = ? AND user = ?',
                [peer_id, from_id], (err, res) => {
                    if (!res[0]) {
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
