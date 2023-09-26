import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import { Context } from "vm";
import { DrawingUtils } from "../../utils/DrawingUtils";

export class SimuEngineFractal extends SimuEngine {

    private lastLevelTriangles: Triangle[];
    private maxIteration: number;
    private currentIteration: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);

        this.lastLevelTriangles = [];
        this.maxIteration = 7; // Set your desired maximum iterations
        this.currentIteration = 0;

        this.start();
    }

    // Méthode pour démarrer la simulation
    start(): void {
        if (!this.ctx) return;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
    
        // Calculate the coordinates of the top point of the triangle
        const triangleX = canvasWidth / 2; // Centered horizontally
        const triangleY = canvasHeight * 0.05
    
        // Create the initial triangle
        const root = new Triangle(triangleX, triangleY, 600);
    
        DrawingUtils.clearCanvas(this.ctx, this.canvas);
    
        // Render the initial triangle
        root.render(this.ctx, this.canvas);
    
        this.lastLevelTriangles.push(root);
    }
    
    do(): void {
        if (!this.ctx || this.currentIteration >= this.maxIteration) return;

        // Copy the last level triangles
        const copyOfLastLevel = [...this.lastLevelTriangles];

        this.lastLevelTriangles = [];

        // For each triangle in the copy of topLevelTriangle
        for (const triangle of copyOfLastLevel) {
            // Redraw it in white
            triangle.render(this.ctx, this.canvas);

            // Divide it
            const children = triangle.divide();

            // Draw each child in black
            for (const child of children) {
                if (child) {
                    child.render(this.ctx, this.canvas);
                    this.lastLevelTriangles.push(child);
                }
            }
        }

        this.currentIteration ++;
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

// Define an external Triangle class
class Triangle {
    private x: number;
    private y: number;
    private size: number;
    private children: Triangle[];

    constructor(x: number, y: number, size: number) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.children = [];

    }
  
    render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {

        ctx.fillStyle = DrawingUtils.getColorBasedOnValue(this.size, 0, canvas.width);
        const halfSize = this.size / 2;
        const height = (Math.sqrt(3) / 2) * this.size; // Height of an equilateral triangle
    
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + halfSize, this.y + height);
        ctx.lineTo(this.x - halfSize, this.y + height);
        ctx.closePath();
        ctx.fill();
    }

    // Divide the triangle into three smaller triangles
    divide(): Triangle[] {

        const side = this.size / 2;
        const height = (Math.sqrt(3)/2)*side;

        const leftTriangle = new Triangle(this.x - (side / 2), this.y + height, side);
        const topTriangle = new Triangle(this.x, this.y, side);
        const rightTriangle = new Triangle(this.x + (side / 2), this.y + height, side);

        this.children = [topTriangle, leftTriangle, rightTriangle];

        return this.children;
    }
  }

