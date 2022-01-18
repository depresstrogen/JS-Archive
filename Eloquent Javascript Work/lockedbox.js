const box = {
    locked: true,
    unlock() { this.locked = false; },
    lock() { this.locked = true; },
    _content: [],
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this._content;
    }
};

function pretendToUseAnArray(arr) {
    return arr[0];
}

function withBoxUnlocked(func) {
    let progress = 0;
    let locked = false;
    try {
        if (box.locked) {
            locked = true;
            box.unlock();
        }
        progress = 1;
        console.log(pretendToUseAnArray(box.content));
        progress = 2;
        if (locked) {
            box.lock();
        }

    } catch (e) {
        if (progress == 1) {
            box.lock();
        }
    }
}