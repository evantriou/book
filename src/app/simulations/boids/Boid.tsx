import { Point } from "../../utils/Point";

export class Boid extends Point {
    public velocityX: number; // X-component of the boid's velocity.
    public velocityY: number; // Y-component of the boid's velocity.
    public heading: number; // Boid's current heading angle in radians.
    public distToFirstNeighbor: number;

    constructor(x: number, y: number, velocityX: number, velocityY: number) {
        super(x,y);
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.heading = Math.atan2(this.velocityY, this.velocityX); // Calculate initial heading.
        this.distToFirstNeighbor = Number.MAX_SAFE_INTEGER;
    }
    

    public updatePosition(canvas: HTMLCanvasElement, otherBoids: Boid[], alignmentRadius: number, cohesionRadius: number, separationRadius: number): void {
        
        this.computeDistToFirstNeigh(otherBoids);
        
        // Calculate alignment, cohesion, and separation vectors.
        const alignment = this.calculateAlignment(otherBoids, alignmentRadius);
        const cohesion = this.calculateCohesion(otherBoids, cohesionRadius);
        const separation = this.calculateSeparation(otherBoids, separationRadius);

        // Combine the vectors to determine the final heading.
        const rndDirX = (Math.random() > 0.5)?(-1):(1);
        const rndMoveX = rndDirX * Math.random();
        const rndDirY = (Math.random() > 0.5)?(-1):(1);
        const rndMoveY = rndDirY * Math.random(); 
        // Found coefs after different tries
        const totalHeadingX = alignment.x / 20 + cohesion.x / 40 + separation.x / 20 + rndMoveX*0.5;
        const totalHeadingY = alignment.y / 20 + cohesion.y / 40 + separation.y / 20 + rndMoveY*0.5;

        // Update the boid's velocity based on the combined heading.
        this.velocityX += totalHeadingX;
        this.velocityY += totalHeadingY;
    
        // Limit the velocity to a maximum value (optional).
        // This helps prevent boids from moving too fast.
        const maxVelocity = 5;
        const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
        if (speed > maxVelocity) {
            this.velocityX = (this.velocityX / speed) * maxVelocity;
            this.velocityY = (this.velocityY / speed) * maxVelocity;
        }

        this.heading = Math.atan2(this.velocityY, this.velocityX); // updates heading.
    
        // Update the position based on the velocity.
        this.x += this.velocityX - this.x / 1000;
        this.y += this.velocityY;
    
        // Implement wrapping or boundary checking (as before) to keep boids within the canvas.
        if (this.x < 0) {
            this.x = canvas.width;
        } else if (this.x > canvas.width) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = canvas.height;
        } else if (this.y > canvas.height) {
            this.y = 0;
        }
    }
    
    private calculateAlignment(otherBoids: Boid[], radius: number): vector {
        // Calculate alignment vector based on nearby boids within the alignment radius.
        // Adjust the boid's heading to align with the average heading of neighbors.
        // Return a vector representing the alignment adjustment.
        // You can implement your alignment logic here.
        // Example: Calculate the average heading of neighbors and adjust the boid's heading.
        // Calculate alignment vector based on nearby boids within the alignment radius.
        // Adjust the boid's heading to align with the average heading of neighbors.
        // Return a vector representing the alignment adjustment.
        
        if (otherBoids.length === 0) {
            return { x: 0, y: 0 };
        }

        let averageHeadingX = 0;
        let averageHeadingY = 0;
        let neighborCount = 0;

        for (const neighbor of otherBoids) {

            // Check if the neighbor is within the cohesion radius.
            const distance = Math.sqrt(
                (neighbor.x - this.x) ** 2 + (neighbor.y - this.y) ** 2
            );
    
            if (distance <= radius) {
                const headingX = neighbor.x - this.x;
                const headingY = neighbor.y - this.y;
                averageHeadingX += headingX;
                averageHeadingY += headingY;
                neighborCount++;
            }
        }

        if (neighborCount === 0) {
            return { x: 0, y: 0 };
        }

        // Calculate the average heading by dividing by the number of neighbors.
        averageHeadingX /= neighborCount;
        averageHeadingY /= neighborCount;

        // Create a vector adjustment to align with the average heading.
        const alignmentAdjustment: vector = {
            x: averageHeadingX - this.velocityX,
            y: averageHeadingY - this.velocityY,
        };

        return alignmentAdjustment;
    }
    
    private calculateCohesion(otherBoids: Boid[], radius: number): vector {
        // Calculate cohesion vector based on nearby boids within the cohesion radius.
        // Adjust the boid's heading to move towards the center of mass of neighbors.
        // Return a vector representing the cohesion adjustment.
    
        if (otherBoids.length === 0) {
            // No neighbors to cohesion with, return a zero vector.
            return { x: 0, y: 0 };
        }
    
        let centerX = 0;
        let centerY = 0;
        let neighborCount = 0;
    
        for (const neighbor of otherBoids) {
            // Check if the neighbor is within the cohesion radius.
            const distance = Math.sqrt(
                (neighbor.x - this.x) ** 2 + (neighbor.y - this.y) ** 2
            );
    
            if (distance <= radius) {
                // Neighbor is within the cohesion radius, include it in the calculation.
                centerX += neighbor.x;
                centerY += neighbor.y;
                neighborCount++;
            }
        }
    
        if (neighborCount === 0) {
            // No neighbors within the cohesion radius, return a zero vector.
            return { x: 0, y: 0 };
        }
    
        // Calculate the average position (center of mass) of neighbors within the radius.
        centerX /= neighborCount;
        centerY /= neighborCount;
    
        // Create a vector adjustment to move towards the center of mass.
        const cohesionAdjustment: vector = {
            x: centerX - this.x,
            y: centerY - this.y,
        };
    
        return cohesionAdjustment;
    }    
    
    private calculateSeparation(otherBoids: Boid[], radius: number): vector {
        // Calculate separation vector based on nearby boids within the separation radius.
        // Adjust the boid's heading to move away from neighbors that are too close.
        // Return a vector representing the separation adjustment.
    
        if (otherBoids.length === 0) {
            // No neighbors to separate from, return a zero vector.
            return { x: 0, y: 0 };
        }
    
        let separationX = 0;
        let separationY = 0;
    
        for (const neighbor of otherBoids) {
            // Check if the neighbor is within the separation radius.
            const distance = Math.sqrt(
                (neighbor.x - this.x) ** 2 + (neighbor.y - this.y) ** 2
            );
    
            if (distance <= radius) {
                // Neighbor is too close, adjust the separation vector to move away.
                const scaleFactor = (1 / (distance ** 100) + 1); // Adjust the exponent as needed.
                separationX += (this.x - neighbor.x) * (1 + scaleFactor);
                separationY += (this.y - neighbor.y) * (1 + scaleFactor);
            }
        }
    
        // Create a vector adjustment representing the separation.
        const separationAdjustment: vector = {
            x: separationX,
            y: separationY,
        };
    
        return separationAdjustment;
    }

    private computeDistToFirstNeigh(otherBoids: Boid[]) : void {
        this.distToFirstNeighbor = Number.MAX_SAFE_INTEGER;

        for (const neighbor of otherBoids) {
            // Check if the neighbor is within the cohesion radius.
            const distance = Math.sqrt(
                (neighbor.x - this.x) ** 2 + (neighbor.y - this.y) ** 2
            );

            if (distance < this.distToFirstNeighbor) {
                this.distToFirstNeighbor = distance;
            }
        }
    }
    
}

interface vector {
    x: number;
    y: number;
};