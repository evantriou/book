import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import interpolateRgbBasis, { interpolateRgbBasisClosed } from "d3-interpolate";


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
        const i = Math.floor(Math.random() * 4); // 4 possibilities top bot right left

        const margin = (this.canvas.width - this.canvas.height) / 2;

        let x = 0;
        let y = 0;

        if (i === 0) { // top
            x = Math.random() * ((this.canvas.width - margin) - margin) + margin;
            y = 0;
        }
        else if (i === 1) { // left
            x = margin;
            y = Math.random() * this.canvas.height;
        }
        else if (i === 2) { // right
            x = this.canvas.height + margin;
            y = Math.random() * this.canvas.height;
        }
        else { // bottom
            x = Math.random() * ((this.canvas.width - margin) - margin) + margin;
            y = this.canvas.height;
        }

        return { x: x, y: y };
    }

    do(): void {
        if (!this.ctx) return;

        // Draw the background with a regular fillRect
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.71)"; // Adjust the background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const walker of this.tree) {
            walker.render(this.ctx, this.minRadius, this.maxRadius);
        }
        for (let n = 0; n < 75; n++) {
            for (let i = 0; i < this.walkers.length; i++) {
                this.walkers[i].walk(this.canvas);
                if (this.walkers[i].checkSticky(this.tree)) { // WARN removing while looping on the same data structure
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
            walker.render(this.ctx, this.minRadius, this.maxRadius);
        }

        if (this.tree.length === 2000) {
            this.stop();
        }
    }

    // Méthode pour arrêter la simulation
    stop(): void {
        if (!this.ctx) return;
        this.stopLoop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Méthode pour mettre à jour les paramètres de la simulation
    updateSettings(settings: any): void {
        // À implémenter
    }
}

class Walker {
    public x;
    public y;
    public r;
    public stuck: boolean;

    constructor(x: number, y: number, r: number, stuck: boolean) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.stuck = stuck;
    }

    public walk(canvas: HTMLCanvasElement): void {
        const moveAmplitude = 10;
        this.x += (Math.random() * moveAmplitude) - (moveAmplitude / 2);
        this.y += (Math.random() * moveAmplitude) - (moveAmplitude / 2);
        if (this.x >= canvas.width) {
            this.x = canvas.width;
        }
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.y >= canvas.height) {
            this.y = canvas.height;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
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

    public render(ctx: CanvasRenderingContext2D, minRadius: number, maxRadius: number): void {
        if (!ctx) return;

        const x = this.x;
        const y = this.y;

        // Default size for regular points
        const circleRadius = this.r;
        let circleColor = "rgba(255, 255, 255, 0.6)";

        if (this.stuck) {
            // Calculate the circle color based on this.r
            circleColor = this.getColorBasedOnRadius(this.r, minRadius, maxRadius);
        }

        // Draw the circle
        ctx.fillStyle = circleColor;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // Function to calculate the circle color based on this.r
    private getColorBasedOnRadius(radius: number, minRadius: number, maxRadius: number): string {

        const colors = [
            'rgb(0, 128, 0)',     // green
            'rgb(60, 179, 113)',  // medium sea green
            'rgb(70, 130, 180)',  // steel blue
            'rgb(0, 0, 128)',     // navy
            'rgb(25, 25, 112)'    // midnight blue
        ];

        // Create an interpolation function for colors
        const interpolateRes = interpolateRgbBasisClosed(colors);
    
        // Interpolate the color based on radius
        const color = interpolateRes((radius - minRadius) / (maxRadius - minRadius));
    
        return color;
    }
}

