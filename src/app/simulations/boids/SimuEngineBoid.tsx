import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import { Boid } from "./Boid";

// Boids Simulation engine
export class SimuEngineBoids extends SimuEngine {
    private boids: Boid[];
    private readonly population: number; // Adjust the population as needed.
    private readonly minDistAtBirth: number; // Adjust the sparsity of birth as needed.
    private readonly alignmentRadius: number; // Adjust the alignement as needed.
    private readonly cohesionRadius: number; // Adjust the cohesion as needed.
    private readonly separationRadius: number; // Adjust the seapration as needed.

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);
        this.boids = [];
        this.population = 350; // Adjust the population as needed.
        this.minDistAtBirth = 60; // Adjust the sparsity of birth as needed.
        this.alignmentRadius = 50; // Adjust the alignement as needed.
        this.cohesionRadius = 75; // Adjust the cohesion as needed.
        this.separationRadius = 50; // Adjust the seapration as needed.
        this.start();
    }

    // Implement the Boids simulation engine
    start(): void {
        if (!this.ctx) return;
        this.initializeBoids(this.minDistAtBirth);
    }

    private initializeBoids(minDistAtBirth: number): void {
        // Create and initialize the boids and add them to the simulation.
        for (let i = 0; i < this.population; i++) {
            // Initialize the boid's position and velocity for a more sparse distribution.
            const initialX = Math.random() * this.canvas.width;
            const initialY = Math.random() * this.canvas.height;
            const initialVelocityX = (Math.random() - 0.5) * 2; // Random velocity between -1 and 1.
            const initialVelocityY = (Math.random() - 0.5) * 2;
    
            // Check if the new boid is too close to existing boids.
            let isTooClose = false;
            for (const existingBoid of this.boids) {
                const distance = Math.sqrt(
                    (existingBoid.x - initialX) ** 2 + (existingBoid.y - initialY) ** 2
                );
                if (distance < minDistAtBirth) {
                    isTooClose = true;
                    break; // If too close to any existing boid, skip this iteration.
                }
            }
    
            if (!isTooClose) {
                // Create a new boid only if it's not too close to existing boids.
                const newBoid = new Boid(initialX, initialY, initialVelocityX, initialVelocityY);
                this.boids.push(newBoid);
            }
        }
    }
    

    public do(): void {
        // This method is called in an animation loop.
        if (!this.ctx) return;
        // Clear the canvas before rendering the next frame.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Update the position and behavior of each boid in the simulation.
        for (const boid of this.boids) {
            // Build an array of other boids (excluding the current boid).
            const otherBoids = this.boids.filter(other => other !== boid);
            // Update the boid's position based on its velocity and rules (e.g., alignment, cohesion, separation).
            boid.updatePosition(this.canvas, otherBoids, this.alignmentRadius, this.cohesionRadius, this.separationRadius);
            // Render the boid on the canvas using this.context.
            this.renderBoid(boid);
        }
    }

    private renderBoid(boid: Boid): void {
        if (!this.ctx) return;
        // Map distToFirstNeighbor to a color between red (0) and blue (500).
        const distToFirstNeighbor = boid.distToFirstNeighbor;
        let r, g, b;

        if (distToFirstNeighbor <= 50) {
            // Transition from red to green for lower values.
            r = 255 - (distToFirstNeighbor / 50) * 255;
            g = (distToFirstNeighbor / 50) * 255;
            b = 0;
        } else {
            // Transition from green to blue for higher values.
            r = 0;
            g = 255 - ((distToFirstNeighbor - 50) / 50) * 255;
            b = ((distToFirstNeighbor - 50) / 50) * 255;
        }

        // Calculate the color based on distToFirstNeighbor.
        const color = `rgb(${r}, ${g}, ${b})`;

        // Implement rendering logic for a single boid.
        // You can use this.context to draw the boid on the canvas.
        // For example, you can draw a triangle representing the boid.
        // You should have logic to determine the boid's position, heading, etc.
        // Example:
        this.ctx.save();
      
        this.ctx.translate(boid.x, boid.y); // Translate to the boid's position.
        this.ctx.rotate(boid.heading); // Rotate based on boid's heading.
        
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20); // Top vertex of the triangle (center).
        this.ctx.lineTo(0, 8); // Bottom-left vertex of the triangle.
        this.ctx.lineTo(8, 0); // Bottom-right vertex of the triangle.
        this.ctx.closePath();
       
        this.ctx.fillStyle = color;
        this.ctx.fill();
       
        this.ctx.fillStyle = color;
        this.ctx.fill();

        this.ctx.restore();

        console.log(boid.heading)
    }

    stop(): void {
        // Implement stop logic for Boids Simulation
        this.stopLoop();
    }

    updateSettings(settings: any): void {
        // Implement updateSettings logic for Boids Simulation
    }
}