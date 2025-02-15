module.exports = {
    regexp: /^\/help$/,
    callback: (msg, text) => {
        msg.send('<</админ>> -- назначить пользователя администратором. (ответом на сообщение пользователя, только для создателя беседы) \n ' +
            '<<пред>> -- выдать предупреждение пользователю (ответом на сообщение, для всех администраторов) \n' +
            '<<кик>> -- иключить пользователя из чата (ответом на сообщение, для всех администраторов) \n' +
            '<<бан>> -- заблокировать пользователя, его нельзя будет добавить в чат (ответом на сообщение, для всех администраторов) \n' +
            '<<разбан>> -- разблокировать пользователя (ответом на сообщение, для всех администраторов) \n' +
            '<<снять>> -- снять предупреждение с пользователя (ответом на сообщение, для всех администраторов) \n' +
            '<<че там>> -- узнать количество предупреждений пользователя \n' +
            '<</info>> -- узнать сколько сообщений написал пользователь. (ответом на сообщение) \n' +
            '<</актив>> -- посмотреть топ самых активных пользователей в беседе. (Для отображения заданного кол-ва' +
            ' пользователей в топе можно использовать <</актив 5>>)');
    },
};

