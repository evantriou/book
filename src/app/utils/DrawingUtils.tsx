import { interpolateRgbBasisClosed } from "d3-interpolate";
import { Context } from "vm";
import { Circle, Point } from "./Point";

export class DrawingUtils {

    public static getRndNbrBetween(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }

    public static getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    public static distance(x1: number, y1: number, x2: number, y2: number) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // To avoid root computations when possible
    public static distanceSquared(x1: number, y1: number, x2: number, y2: number) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return (dx * dx + dy * dy);
    }

    public static getRandintInInterval(a: number, b: number): number {
        // Ensure that a is smaller than b
        if (a > b) {
            [a, b] = [b, a];
        }

        // Calculate the random integer
        const min = Math.ceil(a);
        const max = Math.floor(b);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static clearCanvas(ctx: Context, canvas: HTMLCanvasElement): void {
        ctx.fillStyle = "rgba(51, 51, 51, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    // Colors palette
    public static getColors(): string[] {
        return [
            'rgba(94, 255, 255, 1)',    // RGB (94, 255, 255)
            'rgba(79, 255, 193, 1)',    // RGB (79, 255, 193)
            'rgba(160, 214, 180, 1)',  // RGB (160, 214, 180)
            'rgba(26, 145, 50, 1)',    // RGB (26, 145, 50)
            'rgba(48, 77, 99, 1)'      // RGB (48, 77, 99)
        ];
    }

    public static parseRGBA(rgbaString: string): { red: number; green: number; blue: number } | null {
        // Split the input string by commas and remove any whitespace
        const values = rgbaString
            .replace('rgba(', '')
            .replace(')', '')
            .split(',')
            .map(value => parseInt(value.trim(), 10));

        // Ensure there are exactly 4 values in the array
        if (values.length === 4) {
            const [red, green, blue] = values.slice(0, 3);
            return { red, green, blue };
        }

        // Return null if the input string does not have the expected number of values
        return null;
    }


    // Color gradient based on min to max.
    public static getColorBasedOnValue(value: number, min: number, max: number): string {

        // Create an interpolation function for colors
        const interpolateRes = interpolateRgbBasisClosed(DrawingUtils.getColors());

        // Interpolate the color based on radius
        const color = interpolateRes((value - min) / (min - max));

        return color;
    }

    public static renderCircle(ctx: Context, circle: Circle, color: any): void {
        if (!ctx) return;

        // Draw the circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    public static renderCircleOnValue(ctx: Context, circle: Circle, value: number, min: number, max: number): void {
        if (!ctx) return;

        // Draw the circle
        ctx.fillStyle = DrawingUtils.getColorBasedOnValue(value, min, max);
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    public static renderCell(ctx: Context, point: Point, sideLength: number, color: any, colorBorders: any): void {
        if (!ctx) return;

        const x = point.x * sideLength;
        const y = point.y * sideLength;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, sideLength, sideLength);

        ctx.strokeStyle = colorBorders;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, sideLength, sideLength);
    }

    public static clampToCanvas(x: number, y: number, canvas: HTMLCanvasElement): { x: number, y: number } {
        if (x >= canvas.width) {
            x = canvas.width;
        }
        if (x <= 0) {
            x = 0;
        }
        if (y >= canvas.height) {
            y = canvas.height;
        }
        if (y <= 0) {
            y = 0;
        }
        return { x: x, y: y };
    }

    public static noise1D(amplitude: number, scale: number): Simple1DNoise  {
        return new Simple1DNoise(amplitude, scale);
    }


}

// From https://www.michaelbromley.co.uk/blog/simple-1d-noise-in-javascript/
export class Simple1DNoise {
    private MAX_VERTICES = 256;
    private MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
    private amplitude = 1;
    private scale = 1;
    private r: number[] = [];

    constructor(amplitude: number, scale: number) {
        this.amplitude = amplitude;
        this.scale = scale;
        for (var i = 0; i < this.MAX_VERTICES; ++i) {
            this.r.push(Math.random());
        }
    }

    public getVal(x: number): number {
        var scaledX = x * this.scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * (3 - 2 * t);

        /// Modulo using &#038;
        var xMin = xFloor % this.MAX_VERTICES_MASK;
        var xMax = (xMin + 1) % this.MAX_VERTICES_MASK;

        var y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);

        return y * this.amplitude;
    }

    private lerp(a: number, b: number, t: number): number {
        return a * (1 - t) + b * t;
    }

    public setScale(scale: number): void {
        this.scale = scale;
    }
}