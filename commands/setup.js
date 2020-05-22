module.exports = {
    regexp: /^\/готово$/,
    callback: (msg, text) => {
        console.log(this)
        let peer = msg.peer_id;
        let user = msg.from_id;
        const api = msg.callMethod;
        const connection = msg.mysql;
        if(peer - 2e9 < 0) return;
        api('messages.getConversationMembers', {
            peer_id: peer
        }).then(res => {
            if(res){
                msg.send('Готово! Синхронизация администраторов прошла успешно. Посмотреть доступные команды -- /help.');
                res.items.forEach(e => {
                    if(e.is_admin){
                        connection.query('INSERT INTO admins (chat, user, owner) VALUES (?,?,?)', [peer, e.member_id, e.is_owner ? 1 : 0]);
                    }
                })
            } else {
                msg.send('Кажется, у меня всё ещё нет прав администратора, я не смогу работать без них ;(')
            }
        })

    },
};
