module.exports = {
    regexp: /❤❤|Максем|максем/g,
    callback: (msg, text) => {
       const api = msg.callMethod;
        api('messages.send', {
            chat_id: msg.peer_id - 2e9,
            sticker_id: random(1000, 5000),
            random_id: 0
        })
    },
};

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
