'use strict';

const Event = require('../structures/Event');
const Collection = require('../util/Collection');

class EventStore {
    #client;
    constructor(client) {
        this.#client = client;
        this.events = new Collection();
    }

    get(name) {
        return this.events.get(name);
    }

    add(name, code) {
        this.events.set(name, new Event(this.#client, code));
        return this;
    }

    remove(name) {
        this.events.remove(name);
        return this;
    }

    registerAll(events) {
        events.map(event => new event({ client: this.#client })).map(event => this.add(event.name, event).get(event.name).register());
        return this;
    }

}

module.exports = EventStore;