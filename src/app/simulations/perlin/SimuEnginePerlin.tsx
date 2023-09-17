import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import { Context } from "vm";

export class SimuEnginePerlin extends SimuEngine {

    private pixelMatrix: ImageData | null;
    private perm: number[]; // Permutation array
    private gradP: Vec2[];

    private center: { x: number; y: number };
    private deformedCirclePath: Path2D;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);

        this.pixelMatrix = null;

        // Initialize permutation array
        this.perm = [...Array(512)].map(() => Math.floor(Math.random() * 256));
        for (let i = 0; i < 256; i++) {
            this.perm[i + 256] = this.perm[i];
        }
        // Initialize gradP array with 512 Vec2 objects
        this.gradP = new Array(512);
        for (let i = 0; i < 512; i++) {
            this.gradP[i] = new Vec2(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();
        }

        // Calculate the center of the canvas
        this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };

        // Define the path for the deformed and twisted circle
        this.deformedCirclePath = this.createDeformedCirclePath();

        this.start();
    }

    // Create a deformed and twisted circle path with larger spikes for a subset of points
    // WORK IN PROGRESS
    private createDeformedCirclePath(): Path2D {
        const path = new Path2D();
        const numPoints = 100; // Adjust the number of points for smoothness
        const radius = this.canvas.width / 4; // Adjust the radius

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const x = this.center.x + radius * Math.cos(angle);
            const y = this.center.y + radius * Math.sin(angle);

            // Keep the point unaltered
            if (i === 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        }

        path.closePath();
        return path;
    }


    // Méthode pour démarrer la simulation
    start(): void {
        if (!this.ctx) return;

        this.pixelMatrix = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    do(): void {
        if (!this.ctx || !this.pixelMatrix) return;

        // Scale factor for Perlin noise
        const scale = 0.04; // You can adjust this value to change the noise scale

        // Draw the background with a regular fillRect
        this.ctx.fillStyle = "black"; // Adjust the background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Deform and twist the circle path for visual effects (update this.deformedCirclePath)
        this.deformedCirclePath = this.createDeformedCirclePath()

        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {

                // const noiseValue = this.perlin2(x * scale, y * scale);
                const noiseValue = this.perlin2(x * scale, y * scale);

                let red = 0;
                let green = 0;
                let blue = 0;

                if (this.ctx.isPointInPath(this.deformedCirclePath, x, y)) {

                    // Map the noise value to a reddish lava-like color
                    const colorValue = Math.floor((noiseValue + 1) * 128);
                    red = Math.min(255, colorValue + 128); // Adjust this to control the redness
                    green = Math.max(0, colorValue / 3);     // Adjust this to control the brightness
                    blue = Math.max(0, colorValue);

                    // Set the pixel to the mapped grayscale color
                    this.setPixel(x, y, new Pixel(red, green, blue, 255));
                }
                else {
                    // Calculate the distance from the center
                    const dx = x - this.center.x;
                    const dy = y - this.center.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Adjust the weights for the lava-red and fading components
                    const redWeight = 0.5;
                    const fadingWeight = 0.5;
                    const radius = this.canvas.width / 4 // ugly hard code

                    // Map the noise value to a reddish lava-like color
                    const colorValue = Math.floor((noiseValue + 1) * 128) + 1 / (distance - radius);
                    red = Math.min(255, (colorValue + 128)); // Adjust this to control the redness
                    green = Math.max(0, (colorValue / 3) - 128 + (distance - radius));     // Adjust this to control the brightness
                    blue = Math.max(0, colorValue - 128 + (distance - radius));
                }
                // Set the pixel to the mapped grayscale color
                this.setPixel(x, y, new Pixel(red, green, blue, 255));
            }
        }

        // Render the modified pixel matrix on the canvas
        this.ctx.putImageData(this.pixelMatrix, 0, 0);
    }

    private getPixel(x: number, y: number): Pixel {
        const pixelIndex = (y * this.canvas.width + x) * 4;

        if (!this.pixelMatrix) return new Pixel(0, 0, 0, 0);
        // Extract RGBA values for the pixel
        const red = this.pixelMatrix.data[pixelIndex];
        const green = this.pixelMatrix.data[pixelIndex + 1];
        const blue = this.pixelMatrix.data[pixelIndex + 2];
        const alpha = this.pixelMatrix.data[pixelIndex + 3];

        return new Pixel(red, blue, green, alpha);
    }

    private setPixel(x: number, y: number, pixel: Pixel): void {
        if (!this.pixelMatrix) return;

        const pixelIndex = (y * this.canvas.width + x) * 4;

        // Set RGBA values for the pixel in the pixel matrix
        this.pixelMatrix.data[pixelIndex] = pixel.red;
        this.pixelMatrix.data[pixelIndex + 1] = pixel.green;
        this.pixelMatrix.data[pixelIndex + 2] = pixel.blue;
        this.pixelMatrix.data[pixelIndex + 3] = pixel.alpha;
    }

    // Perlin noise function based on the commented code you provided
    private perlin2(x: number, y: number): number {
        // Find unit grid cell containing point
        const X = Math.floor(x);
        const Y = Math.floor(y);

        // Get relative xy coordinates of point within that cell
        x = x - X;
        y = y - Y;

        // Wrap the integer cells at 255
        const X1 = X & 255;
        const Y1 = Y & 255;

        // Calculate noise contributions from each of the four corners
        const n00 = this.gradP[X1 + this.perm[Y1]].dot2(new Vec2(x, y));
        const n01 = this.gradP[X1 + this.perm[Y1 + 1]].dot2(new Vec2(x, y - 1));
        const n10 = this.gradP[X1 + 1 + this.perm[Y1]].dot2(new Vec2(x - 1, y));
        const n11 = this.gradP[X1 + 1 + this.perm[Y1 + 1]].dot2(new Vec2(x - 1, y - 1));

        // Compute the fade curve value for x
        const u = this.fade(x);

        // Interpolate the four results
        return this.lerp(
            this.lerp(n00, n10, u),
            this.lerp(n01, n11, u),
            this.fade(y)
        );
    }

    // Perlin noise helper functions based on the commented code you provided
    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
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

class Pixel {
    public red: number;
    public blue: number;
    public green: number;
    public alpha: number;

    constructor(red: number, blue: number, green: number, alpha: number) {
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.alpha = alpha;
    }
}

// Vec2 class for gradient vectors
class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Normalize the vector
    normalize(): Vec2 {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length === 0) return new Vec2(0, 0);
        return new Vec2(this.x / length, this.y / length);
    }

    // Dot product of two vectors
    dot2(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }
}