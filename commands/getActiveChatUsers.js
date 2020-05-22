module.exports = {
    regexp: /^(\/|!)актив [1-9]+$/i,
    callback: (msg) => {
        let count = parseInt(msg.text.replace(/(\/|!)актив/, '')) || 15
        if(!(parseInt(count) >= 1 || parseInt(count) > 20)){
            msg.send('Неверное число после <<!актив>>.');
            return;
        }
        count = parseInt(count)
        if(count > 30){
            msg.send('Не более 30.');
            return;
        }
        if(count < 2){
            msg.send('Не менее 2.');
            return;
        }
        const peer = msg.peer_id;
        let id = msg.from_id;
        const api = msg.callMethod;
        const connection = msg.mysql;

        if((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

        connection.query('SELECT * FROM active WHERE chat = ? ORDER BY count DESC LIMIT ' + count, [peer],
            (e,r) => {
                if(!r[count - 1]) {
                    msg.send(`В данном чате менее ${count} активных пользователей.`);
                    return
                }
                let rsp = ' ';

                r.forEach((e, i) => {
                    setTimeout(() => {
                        if(e.user > 0){
                            api('users.get', {
                                user_ids: e.user
                            }).then(usr => {
                                rsp = rsp + `${i+1}. @id${e.user}(${usr[0].first_name} ${usr[0].last_name}) -- (${e.count} сообщения) \n`
                            })
                        } else {
                            api('groups.getById', {
                                group_id: e.user
                            }).then(usr => {
                                rsp = rsp + `${i+1}. @club${-e.user}(${usr[0].name}) [BOT] -- (${e.count} сообщения) \n`
                            })
                        }

                    }, i * 10)
                })
                    setTimeout(() => {
                        api('messages.send', {
                            disable_mentions: 1,
                            peer_id: peer,
                            message: rsp,
                            random_id: 0
                        })
                    }, count * 50)
            })
    },
};
