const self = {
  attach: (vk) => {
    vk.on('message_new', ({ object }) => {
      self.onEvent(vk, object);
    });
  },
  onEvent: (vk, { from_id: fromId }) => {
      vk.callMethod('messages.setActivity', {
        peer_id: 236820864,
        type: 'typing',
      });
  },
};

//module.exports = self;
