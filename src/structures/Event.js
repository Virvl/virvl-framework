'use strict';

const Base = require('./Base');
const Snowflake = require('../util/Snowflake');

class Event extends Base {
    constructor(client, event) {
        super(client);

        this.name = event.name;
        this.once = event.once ?? false;
        this.event = event.event || event.name;
        this.emitter = event.emitter || client;
        this.enabled = event.enabled ?? true;

        this.code = event;
    }

    register() {
        return this.emitter[this.once ? 'once' : 'on'](this.event, this.code?.run);
    }

    disable() {
        return this.enabled = false;
    }

    enable() {
        return this.enabled = true;
    }

    toJSON() {
        return super.toJSON({
            name: this.name,
            emitter: this.emitter,
            run: this.run
        });
    }
}

module.exports = Event;