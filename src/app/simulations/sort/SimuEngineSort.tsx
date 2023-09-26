import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import { interpolateRgbBasisClosed } from "d3-interpolate";
import { DrawingUtils } from "../../utils/DrawingUtils";

// Paths Simulation engine

export class SimuEngineSort extends SimuEngine {
    private readonly numBars: number;
    private readonly maxBarValue: number;
    private readonly valueToHeightRatio: number;
    private readonly barWidth: number;
    private displayedBars: Bar[];
    private sortedBars: Bar[];
    private moves: Move[];
    private timer: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);
        this.numBars = 50;
        this.maxBarValue = 50;
        this.valueToHeightRatio = this.canvas.height / this.maxBarValue;
        this.barWidth = this.canvas.width / this.numBars;
        this.displayedBars = [];
        this.sortedBars = [];
        this.moves = [];
        this.timer = 0;
        this.init();
    }

    init(): void {
        if (!this.ctx) return;
        for (let i = 0; i < this.numBars; i++) {
            const value = Math.floor(Math.random() * (this.maxBarValue - 1 + 1)) + 1;
            const bar = new Bar(i, value);
            this.displayedBars.push(bar);
            this.sortedBars.push(bar.clone());
        }
        this.sort(); // Call the sorting algorithm at the end of init
    }

    renderBar(bar: Bar): void {
        if (!this.ctx) return;
        const x = bar.index * this.barWidth;
        const y = this.canvas.height;
        const width = this.barWidth;
        const height = - bar.value * this.valueToHeightRatio;

        this.ctx.fillStyle = this.getColorBasedOnDistance(bar.value, 0, this.maxBarValue);
        this.ctx.fillRect(x, y, width, height);
    }

    // Function to calculate the circle color based on this.r
    private getColorBasedOnDistance(height: number, minHeight: number, maxHeight: number): string {

        const colors = DrawingUtils.getColors();       

        // Create an interpolation function for colors
        const interpolateRes = interpolateRgbBasisClosed(colors);
    
        // Interpolate the color based on radius
        const color = interpolateRes((height - minHeight) / (minHeight - maxHeight));
    
        return color;
    }

    sort(): void {
        // Implement your sorting algorithm here (e.g., bubble sort)
        const n = this.sortedBars.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (this.sortedBars[j].value > this.sortedBars[j + 1].value) {

                    const movingBar = this.sortedBars[j];
                    const targetedBar = this.sortedBars[j+1];

                    this.sortedBars[j+1] = movingBar;
                    movingBar.index = j+1;
        
                    this.sortedBars[j] = targetedBar;
                    targetedBar.index = j;
                   
                    // Record the move
                    this.moves.push(new Move(j, j + 1));
                }
            }
        }
    }

    do(): void {
        if (!this.ctx) return;
    
        // Draw the background with a regular fillRect
        this.ctx.fillStyle = "rgba(25, 25, 25, 0.71)"; // Adjust the background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Check if there are moves left to play
        if (this.timer < this.moves.length) {
            const move = this.moves[this.timer];
            // Swap the indices of the bars
            const movingBar = this.displayedBars[move.sourceIndex];
            const targetedBar = this.displayedBars[move.targetIndex];

            const tempIndex = movingBar.index;

            this.displayedBars[move.targetIndex] = movingBar;
            movingBar.index = move.targetIndex;

            this.displayedBars[tempIndex] = targetedBar;
            targetedBar.index = tempIndex;

            this.timer++;
        }
    
        // Loop through the bars and render each one
        for (const bar of this.displayedBars) {
            this.renderBar(bar);
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

class Bar {
    public index: number;
    public value: number;

    constructor(index: number, value: number) {
        this.index = index;
        this.value = value;
    }

    public clone(): Bar {
        return new Bar(this.index, this.value);
    }
}

class Move {
    constructor(public sourceIndex: number, public targetIndex: number) {}
}
