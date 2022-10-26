
class Item {
    constructor(limit = 60) {
        this.value = 0;
        this.limit = limit;
    }

    inc() {
        ++this.value;
        if (this.value == this.limit) {
            this.value = 0;
            this.onReset();
        }
    }
    onReset() { }
}

class Clock{
    #items = [
        new Item(100),
        new Item(),
        new Item()
    ];
    #getItemValue(i) { return this.#items[i].value }

    constructor() {
        let self = this;
        for (let i = 0; i < this.#items.length - 1; i++) {
            this.#items[i].onReset = function() {
                self.#items[i + 1].inc();
            }
        }
        this.list = [];
    }

    reset() {
        for (let i of this.#items) {
            i.value = 0;
        }
        this.list = [];
    }
    run() { this.#items[0].inc() }

    latch() {
        let t = this.time;
        this.list.push(t);
    }

    get minute() { return this.#getItemValue(2) }
    get second() { return this.#getItemValue(1) }
    get milis() { return this.#getItemValue(0) }

    get time() {
        return new Time(this.minute, this.second, this.milis);
    }

}

class Time {
    constructor(m = 0, s = 0, ms = 0) {
        this.minute = m;
        this.second = s;
        this.milis = ms;
    }
    get ticks() {
        return (this.minute * 60 + this.second) * 100 + this.milis;
    }
    getSpan(t = new Time()) {
        let v = this.ticks - t.ticks;
        let ms = v % 100;
        let s = Math.floor(v / 100);
        let m = Math.floor(s / 60);
        s %= 60;

        return new Time(m, s, ms);
    }
    toString() {
        function dig(v) {
            if (v < 10) v = '0' + v;
            return v;
        }

        return dig(this.minute) + ":" + dig(this.second) +
            "." + dig(this.milis);
    }
}