export class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x=x;
        this.y=y;
    }
}

export class Circle extends Point {
    public r: number;
    constructor(x: number, y: number, r: number) {
        super(x,y);
        this.r=r;
    }  
}