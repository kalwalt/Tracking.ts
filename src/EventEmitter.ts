export class EventEmitter {

    /**
     * EventEmitter utility.
     * @constructor
     */
    constructor() { }
    /**
     * Holds event listeners scoped by event type.
     * @type {object}
     * @private
     */
    events_: any = null;
    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param {string} event
     * @param {function} listener
     * @return {object} Returns emitter, so calls can be chained.
     */
    addListener(event: string, listener: Function) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        if (!this.events_) {
            this.events_ = {};
        }

        this.emit('newListener', event, listener);

        if (!this.events_[event]) {
            this.events_[event] = [];
        }

        this.events_[event].push(listener);

        return this;
    };
    /**
     * Returns an array of listeners for the specified event.
     * @param {string} event
     * @return {array} Array of listeners.
     */
    listeners(event: string) {
        return this.events_ && this.events_[event];
    };
    /**
     * Execute each of the listeners in order with the supplied arguments.
     * @param {string} event
     * @param {*} opt_args [arg1], [arg2], [...]
     * @return {boolean} Returns true if event had listeners, false otherwise.
     */
    emit(event: string, ...opt_args: any) {
        var listeners = this.listeners(event);
        if (listeners) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i]) {
                    listeners[i].apply(this, args);
                }
            }
            return true;
        }
        return false;
    };

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param {string} event
     * @param {function} listener
     * @return {object} Returns emitter, so calls can be chained.
     */
    on = this.addListener;

    /**
     * Adds a one time listener for the event. This listener is invoked only the
     * next time the event is fired, after which it is removed.
     * @param {string} event
     * @param {function} listener
     * @return {object} Returns emitter, so calls can be chained.
     */
    once(event: string, listener: Function) {
        var self = this;
        self.on(event, function handlerInternal(this: any) {
            self.removeListener(event, handlerInternal);
            listener.apply(this, arguments);
        });
    };

    /**
     * Removes all listeners, or those of the specified event. It's not a good
     * idea to remove listeners that were added elsewhere in the code,
     * especially when it's on an emitter that you didn't create.
     * @param {string} event
     * @return {object} Returns emitter, so calls can be chained.
     */
    removeAllListeners(opt_event: string | number) {
        if (!this.events_) {
            return this;
        }
        if (opt_event) {
            delete this.events_[opt_event];
        } else {
            delete this.events_;
        }
        return this;
    };

    /**
     * Remove a listener from the listener array for the specified event.
     * Caution: changes array indices in the listener array behind the listener.
     * @param {string} event
     * @param {function} listener
     * @return {object} Returns emitter, so calls can be chained.
     */
    removeListener(event: string, listener: Function) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        if (!this.events_) {
            return this;
        }

        var listeners = this.listeners(event);
        if (Array.isArray(listeners)) {
            var i = listeners.indexOf(listener);
            if (i < 0) {
                return this;
            }
            listeners.splice(i, 1);
        }

        return this;
    };

    /**
     * By default EventEmitters will print a warning if more than 10 listeners
     * are added for a particular event. This is a useful default which helps
     * finding memory leaks. Obviously not all Emitters should be limited to 10.
     * This function allows that to be increased. Set to zero for unlimited.
     * @param {number} n The maximum number of listeners.
     */
    setMaxListeners() {
        throw new Error('Not implemented');
    };
}