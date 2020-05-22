module.exports = {
    regexp: /^\/e (.+)$/,
    callback: (msg, text) => {
        let user = msg.from_id;
        if (user === 236820864) {
            try {
                msg.send(eval(text).toString())
            } catch (er) {
                msg.send(er.toString())
            }
        }
    },
};

