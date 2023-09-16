export class PriorityQueue<T> {
    private _items: T[];
    private _comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this._items = [];
        this._comparator = comparator;
    }

    public enqueue(item: T): void {
        this._items.push(item);
        this._items.sort(this._comparator);
    }

    public dequeue(): T | undefined {
        return this._items.shift();
    }

    public peek(): T {
        return this._items[0];
    }

    public get length(): number {
        return this._items.length;
    }

    public sort(): void {
        this._items.sort(this._comparator);
    }

    public has(item: T): boolean {
        return new Set(this._items).has(item);
    }
}