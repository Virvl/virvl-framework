const Event = require('../../structures/Event');
module.exports = class extends Event {
  constructor(client, options){
    super(client, options);
    this.name = 'ready';
  }
  run() {
    console.log('Ready!')
  }
}