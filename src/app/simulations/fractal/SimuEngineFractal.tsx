import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import { DrawingUtils } from "../../utils/DrawingUtils";

export class SimuEngineFractal extends SimuEngine {

    private lastLevelTriangles: Triangle[];
    private maxIteration: number;
    private currentIteration: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, diagLength: number) {
        super(canvas, ctx, diagLength);

        this.lastLevelTriangles = [];
        this.maxIteration = 0.0075*this.diagLength; // Set your desired maximum iterations
        this.currentIteration = 0;

        this.init();
    }

    init(): void {
        if (!this.ctx) return;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
    
        const triangleX = canvasWidth / 2; // Centered horizontally
        const triangleY = canvasHeight * 0.05
    
        const root = new Triangle(triangleX, triangleY, 0.45*this.diagLength);
    
        DrawingUtils.clearCanvas(this.ctx, this.canvas);
    
        root.render(this.ctx, this.canvas);
    
        this.lastLevelTriangles.push(root);
    }
    
    do(): void {
        if (!this.ctx || this.currentIteration >= this.maxIteration) return;

        const copyOfLastLevel = [...this.lastLevelTriangles];

        this.lastLevelTriangles = [];

        // For each triangle in the copy of topLevelTriangle
        for (const triangle of copyOfLastLevel) {
            
            triangle.render(this.ctx, this.canvas);
            const children = triangle.divide();

            for (const child of children) {
                if (child) {
                    child.render(this.ctx, this.canvas);
                    this.lastLevelTriangles.push(child);
                }
            }
        }
        this.currentIteration ++;
    }

    updateSettings(settings: any): void {
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

