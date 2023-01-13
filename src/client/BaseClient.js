'use strict';

require('setimmediate');
const EventEmitter = require('events');
const Collection = require('../util/Collection');
const RESTManager = require('../rest/RESTManager');
const { DefaultOptions } = require('../util/Constants');
const Util = require('../util/Util');
const fs = require('fs');

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
  constructor(options = {}) {
    super();

    /**
     * Timeouts set by {@link BaseClient#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link BaseClient#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();

    /**
     * Intervals set by {@link BaseClient#setImmediate} that are still active
     * @type {Set<Immediate>}
     * @private
     */
    this._immediates = new Set();

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(DefaultOptions, options);

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this, options._tokenType);

    this.stores = new Collection();
    this.events = new Collection();

    this.registerStores();
  }

  registerStores() {
    const { stores } = this.options;
    [{
      name: 'events',
      file: 'EventStore',
      dir: [...new Set([].concat(DefaultOptions.stores.events,
        Array.isArray(stores.events) ? [...stores.events] : stores.events))]
    }].forEach(store => {
      const newStore = new (require(`../stores/${store.file}`))(this);
      this.stores.set(store.name, );
      this[store.name] = newStore.events;

      newStore.registerAll([].concat(...store.dir.map(dir => [
        dir, fs.readdirSync(dir)
      ]).map(files => files[1].filter(file => file.endsWith('.js')).map(file =>
        require(`${files[0]}/${file}`)))));
    });
    return this;
  }

  /**
   * API shortcut
   * @type {Object}
   * @readonly
   * @private
   */
  get api() {
    return this.rest.api;
  }

  /**
   * Destroys all assets used by the base client.
   */
  destroy() {
    for (const t of this._timeouts) this.clearTimeout(t);
    for (const i of this._intervals) this.clearInterval(i);
    for (const i of this._immediates) this.clearImmediate(i);
    this._timeouts.clear();
    this._intervals.clear();
    this._immediates.clear();
  }

  /**
   * Sets a timeout that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setTimeout(fn, delay, ...args) {
    const timeout = setTimeout(() => {
      fn(...args);
      this._timeouts.delete(timeout);
    }, delay);
    this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears a timeout.
   * @param {Timeout} timeout Timeout to cancel
   */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  /**
   * Sets an interval that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait between executions (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setInterval(fn, delay, ...args) {
    const interval = setInterval(fn, delay, ...args);
    this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {Timeout} interval Interval to cancel
   */
  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }

  /**
   * Increments max listeners by one, if they are not zero.
   * @private
   */
  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   * @private
   */
  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1);
    }
  }

  toJSON(...props) {
    return Util.flatten(this, { domain: false }, ...props);
  }
}

module.exports = BaseClient;
