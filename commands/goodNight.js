module.exports = {
    regexp: /Я спать|я спать/g,
    callback: (msg) => {
        msg.send('споки зайка <3');
    },
};

