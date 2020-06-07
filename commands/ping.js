module.exports = {
    regexp: /!пинг/g,
    callback: (msg) => {
        msg.send('понг');
    },
};

