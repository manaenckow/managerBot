let load = false;
let error = false;

module.exports = {
    regexp: /^parse/i,
    callback: async (msg, text) => {
        const peer = msg.peer_id;
        const user = msg.from_id;

        const api = msg.callMethod;
        const connection = msg.mysql;
        const conn = msg.asyncMysql;
        const table = msg.text.replace('parse ', '');

        connection.query('CREATE TABLE ' + table +
            ' ( ' +
            '`id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user` INT NOT NULL , ' +
            '`name` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL , ' +
            '`surname` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL , ' +
            '`city` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL , ' +
            '`allowed` INT NOT NULL DEFAULT 1 ,' +
            '`canwrite` INT NOT NULL , ' +
            'PRIMARY KEY (`id`)) ' +
            'ENGINE = InnoDB', (e, r) => {
                console.log(e || r)
            }
        )
        if (user !== 236820864) return;
        if (load) {
            msg.send('Задача уже начата.. ожидайте завершения.');
            return;
        } else {
            load = true;
        }
        let error = false;

        const token = '08efa62256f070aa57a8efbfaec1443b85cda3c79be3217831acf63ee436550ffb373b069c5d892e484bf';
        // царь горы 986a026180ee0cf68c48b81f9e297c9af0357283c0d04ffee28f2cfb1e74fc2ded1db897b664e86741784
        // infection 08efa62256f070aa57a8efbfaec1443b85cda3c79be3217831acf63ee436550ffb373b069c5d892e484bf
        // ! 6954328f572adf0d572c62413fce0cdb769647fc558cb0e3e6903425439588421d3d62e09c7d12c10ebd5
        let offset = 200;
        let ids = [];

        let data = await api('messages.getConversations', {
            count: 200,
            extended: 1,
            fields: 'city',
            access_token: token
        });

        let count = data.count;

        msg.send(`Диалогов всего: ${count}. Начинаю запись в базу.`);
        while ((offset < count) && !error) {
            const res = await api('messages.getConversations', {
                offset: offset,
                count: 200,
                extended: 1,
                fields: 'city, can_write_private_message',
                access_token: token
            });
            const profiles = res.profiles;

            profiles.forEach(info => {
                const {id, first_name, last_name, can_write_private_message} = info;

                const city = info.city ? info.city.title : '';

                if (!ids.includes(id) && !error && can_write_private_message) {
                    connection.query(
                        'INSERT INTO ' + table + ' (user, name, surname, city, canwrite) VALUES (?, ?, ?, ?, ?)',
                        [id, first_name, last_name, city, can_write_private_message],
                        (e, r) => {
                            if (e) {
                                error = true;
                                console.log(e);
                                return;
                            }
                        }
                    )
                }
                ids.push(id);
            })
            data = res;
            offset += 200;
        }
        msg.send(`Задача завершена ${error ? 'с ошибками' : 'без ошибок'}, конечный offset: ${offset}`);
        load = false;
    },
};
