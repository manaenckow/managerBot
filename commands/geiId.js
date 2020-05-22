module.exports = {
    regexp: /^\/id$/,
    callback: (msg, text) => {
        let id = msg.from_id;
        if (msg.fwd_messages[0]) {
            id = msg.fwd_messages[0].from_id
        } else if (msg.reply_message) {
            id = msg.reply_message.from_id
        }
        msg.send(`ID: ${id}`);
    },
};
