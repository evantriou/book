import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import interpolateRgbBasis, { interpolateRgbBasisClosed } from "d3-interpolate";
import { Circle } from "../../utils/Point";
import { DrawingUtils } from "../../utils/DrawingUtils";


export class SimuEngineDLA extends SimuEngine {

    private tree: Walker[];
    private walkers: Walker[];
    private maxRadius: number;
    private minRadius: number;
    private maxWalkers: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);

        this.tree = [];
        this.walkers = [];
        this.maxRadius = 10;
        this.minRadius = 5;
        this.maxWalkers = 100;

        this.start();
    }

    // Méthode pour démarrer la simulation
    start(): void {
        this.tree.push(new Walker(this.canvas.width / 2, this.canvas.height / 2, this.maxRadius, true));
        for (let i = 0; i < this.maxWalkers; i++) {
            let rndPoint: { x: number, y: number } = this.pickSmartRndPoint();
            this.walkers.push(new Walker(rndPoint.x, rndPoint.y, this.maxRadius, false));
        }
    }

    // Pick points along edges to create smart walkers
    private pickSmartRndPoint(): { x: number, y: number } {
        // const i = Math.floor(Math.random() * 4); // 4 possibilities top bot right left
        const i = DrawingUtils.getRandintInInterval(0,3);

        const margin = (this.canvas.width - this.canvas.height) / 2;

        let x = 0;
        let y = 0;

        if (i === 0) {
            x = Math.random() * ((this.canvas.width - margin) - margin) + margin;
            y = 0;
        }
        else if (i === 1) {
            x = margin;
            y = Math.random() * this.canvas.height;
        }
        else if (i === 2) {
            x = this.canvas.height + margin;
            y = Math.random() * this.canvas.height;
        }
        else {
            x = Math.random() * ((this.canvas.width - margin) - margin) + margin;
            y = this.canvas.height;
        }

        return { x: x, y: y };
    }

    do(): void {
        if (!this.ctx) return;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.71)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const walker of this.tree) {
            DrawingUtils.renderCircleOnValue(this.ctx, walker, walker.r, this.minRadius, this.maxRadius);
        }
        for (let n = 0; n < 75; n++) {
            for (let i = 0; i < this.walkers.length; i++) {
                this.walkers[i].walk(this.canvas);
                if (this.walkers[i].checkSticky(this.tree)) { // WARN: removing while looping on the same data structure
                    const currRadius = this.walkers[i].r;
                    this.tree.push(this.walkers[i]);
                    this.walkers.splice(i, 1);
                    let rndPoint: { x: number, y: number } = this.pickSmartRndPoint();
                    this.walkers.push(new Walker(rndPoint.x, rndPoint.y, currRadius * 0.8, false));
                }
            }
        }
        // Uncomment to display walkers --> warning it takes a lot of computations !
        for (const walker of this.walkers) {
            DrawingUtils.renderCircleOnValue(this.ctx, walker, walker.r, this.minRadius, this.maxRadius);
        }

        if (this.tree.length === 2000) {
            this.stop();
        }
    }

    stop(): void {
        if (!this.ctx) return;
        this.stopLoop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateSettings(settings: any): void {
    }
}

class Walker extends Circle {
    public stuck: boolean;

    constructor(x: number, y: number, r: number, stuck: boolean) {
        super(x,y,r);
        this.stuck = stuck;
    }

    public walk(canvas: HTMLCanvasElement): void {
        const moveAmplitude = 10;
        this.x += (Math.random() * moveAmplitude) - (moveAmplitude / 2);
        this.y += (Math.random() * moveAmplitude) - (moveAmplitude / 2);

        let pos = DrawingUtils.clampToCanvas(this.x, this.y, canvas);
        this.x = pos.x;
        this.y = pos.y
    }

    public checkSticky(tree: Walker[]): boolean {
        for (let i = 0; i < tree.length; i++) {

            // Calculate the distance from the center
            const dx = tree[i].x - this.x;
            const dy = tree[i].y - this.y;
            const distance = (dx * dx + dy * dy);

            if (distance < (tree[i].r + this.r) ** 2) {
                this.stuck = true;
                break;
            }
        }
        return this.stuck
    }
}

