'use strict';

const EventStore = require('../stores/EventStore');
const Collection = require('../util/Collection');

class StoreManager extends BaseManager {
    #client;

    constructor(client, options = {}) {
        this.#client = client;
        this.stores = new Collection();
    }

    add(store) {
        this.stores.add(store.name, '')
    }
}

module.exports = StoreManager;
