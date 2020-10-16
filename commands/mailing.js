let load = false;
let attept = 1;
module.exports = {
    regexp: /^\/рассылкатот2/i,
    callback: async (msg, text) => {

        const peer = msg.peer_id;
        const user = msg.from_id;

        const api = msg.callMethod;
        const connection = msg.mysql;
        const conn = msg.asyncMysql;
        const table = 'mailing';
        const textt = msg.text.replace('/рассылка2 ', '').trim();

        if(!textt){
            msg.send('error');
            return;
        }

        if (user !== 236820864) return;
        const token = '986a026180ee0cf68c48b81f9e297c9af0357283c0d04ffee28f2cfb1e74fc2ded1db897b664e86741784 ';

        connection.query(`SELECT user FROM ${table} WHERE canwrite = 1`, (e, r) => {
            if (e) {
                msg.send(e.toString())
            } else {
                if (attept < 2) {
                    attept++;
                    msg.send(`Будет произведена рассылка на ${r.length} пользователей с текстом: 
                    \n\n ${textt} \n\n Чтобы отписаться от рассылки напишите "Отписаться от рассылки"
                    Напишите команду повторно для запуска.
                    `
                    );
                    setTimeout(() => {
                        attept = 0;
                        msg.send(attept)
                    }, 20000)
                    return;
                }
                if (load) {
                    msg.send('Задача уже начата.. ожидайте завершения.');
                    return;
                } else {
                    load = true;
                }
                msg.send(`База для рассылки успешла получена, пользователей ${r.length}`);
                attept = 0;
                let users = [];
                let sends = [];
                r.forEach((e,i) => {
                   if(!sends.includes(e.user)){
                       users.push(e.user)
                       sends.push(e.user)
                   }
                    if (users.length >= 98) {
                        setTimeout(() => {
                            api('messages.send', {
                                message: textt + '\n\n Чтобы отписаться от рассылки напишите "Отписаться от рассылки"',
                                random_id: 0,
                                access_token: token,
                                keyboard: JSON.stringify({
                                    "buttons": [
                                        [
                                            {
                                                "action": {
                                                    "type": "open_app",
                                                    "app_id": 7182607,
                                                    "payload": "",
                                                    "label": "Играть в Infection",
                                                    "hash": ""
                                                }
                                            }
                                        ],
                                        [
                                            {
                                                "action": {
                                                    "type": "open_link",
                                                    "link": "https://vk.com/im?sel=-178943744",
                                                    "label": "Узнать секретные данные друзей",
                                                    "payload": ""
                                                }
                                            }
                                        ]
                                    ]
                                }),
                                user_ids: users.toString()
                            })
                        }, 1000)
                    console.log(users)
                        users = []
                    }
                })
            }
        })
        
    },
};
