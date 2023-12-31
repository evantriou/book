import { SimuEngine } from "../SimuEngine";
import { Circle } from "../../utils/Point";
import { DrawingUtils } from "../../utils/DrawingUtils";

export class SimuEngineBoids extends SimuEngine {

    private populationNbr: number;
    private boids: boid [];
    private boidSize: number;
    private boidMaxForce: number;
    private boidMaxSpeed: number;
    private perceptionRadius: number;
    private separationRadius: number;
    private userCoefs: {mass:number, separation:number, alignement:number};

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, diagLength: number) {
        super(canvas, ctx, diagLength);
        this.boids = [];
        this.populationNbr = 0.3*this.diagLength;
        this.boidSize = 0.003*this.diagLength;
        this.boidMaxForce = 0.005*this.diagLength;
        this.boidMaxSpeed = 0.005*this.diagLength;
        this.perceptionRadius = 0.1*this.diagLength;
        this.separationRadius = 0.05*this.diagLength;
        this.userCoefs = {mass:1, separation:1, alignement:1};
        this.init();
    }

    // Initializes first state for each boid and render one time.
    init(): void {
        if (!this.ctx) return;
        DrawingUtils.clearCanvas(this.ctx, this.canvas);
        for (let i = 0; i < this.populationNbr; i++) {
            const initialX = Math.random() * this.canvas.width;
            const initialY = Math.random() * this.canvas.height;
            const initialVelocityX = (Math.random() - 0.5)*2;
            const initialVelocityY = (Math.random() - 0.5)*2;
            const newBoid: boid = new boid(initialX, initialY,
                this.boidSize, initialVelocityX, initialVelocityY,
                this.boidMaxForce, this.boidMaxSpeed,
                this.perceptionRadius, this.separationRadius);
            newBoid.render(this.ctx, this.populationNbr, this.diagLength);
            this.boids.push(newBoid);
        }
    }
    
    public do(): void {
        if (!this.ctx) return;

        DrawingUtils.clearCanvas(this.ctx, this.canvas);

        for (const boid of this.boids) {
            boid.update(this.canvas, this.boids, this.userCoefs);
            boid.render(this.ctx, this.populationNbr, this.diagLength);
        }
    }

    updateSettings(settings: any): void {
        this.userCoefs = settings;
    }
}

export class boid extends Circle {
    private velocityX: number;
    private velocityY: number;
    private heading: number;
    private maxForce: number; // max force applied to boid's direction
    private maxSpeed: number; // max resulting speed
    private perceptionRadius: number;
    private separationRadius: number;
    private neighCount: number;

    constructor(x: number, y: number, r: number, velocityX: number, velocityY: number, maxForce: number, maxSpeed: number, perceptionRadius: number, separationRadius: number) {
        super(x,y,r);
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.maxForce = maxForce;
        this.maxSpeed = maxSpeed;
        this.perceptionRadius = perceptionRadius;
        this.separationRadius = separationRadius;
        this.heading = Math.atan2(this.velocityY, this.velocityX);
        this.neighCount = 0;
    }

    public render(ctx: CanvasRenderingContext2D | null, population: number, diagLength: number): void {
        if (!ctx) return;

        const color: string = DrawingUtils.getColorBasedOnValue(this.neighCount, 0, population);

        DrawingUtils.renderCircle(ctx, this, color);
        
        const endpointX = this.x + 0.002*diagLength * this.r * Math.cos(this.heading);
        const endpointY = this.y + 0.002*diagLength * this.r * Math.sin(this.heading);

        ctx.strokeStyle = color;
        ctx.lineWidth = 0.002*diagLength;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endpointX, endpointY);
        ctx.stroke();
    }

    public update(canvas: HTMLCanvasElement, boids: boid[], userCoefs: {mass:number, separation:number, alignement:number}): void {

        const acceleration = this.flock(boids, userCoefs);
        
        this.velocityX += acceleration.x;
        this.velocityY += acceleration.y;
        
        let speed = Math.sqrt(this.velocityX ** 2 +this.velocityY ** 2);
        if (speed > this.maxSpeed) {
            this.velocityX = (this.velocityX / speed) * this.maxSpeed;
            this.velocityY = (this.velocityY / speed) * this.maxSpeed;
        }

        this.heading = Math.atan2(this.velocityY, this.velocityX);

        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Uncomment the one you prefer:
        this.clampToPacmanWorld(canvas);
        // this.bouncingBorders(canvas);
    }

    public flock(boids: boid[], userCoefs: {mass:number, separation:number, alignement:number}): {x: number, y: number} {

        this.neighCount = 0;

        const otherBoids: boid[] = boids.filter(other => other !== this);

        let mass: {x: number, y: number} = {x:0, y:0};
        let separation: {x: number, y: number} = {x:0, y:0};
        let alignment: {x: number, y: number} = {x:0, y:0};

        let neighborsCount: number = 0;
        for (const neighbor of otherBoids) {

            const distance = Math.sqrt(
                (neighbor.x - this.x) ** 2 + (neighbor.y - this.y) ** 2
            );
    
            if (distance < this.perceptionRadius) {
                mass.x += neighbor.x;
                mass.y += neighbor.y;
            
                alignment.x += neighbor.velocityX;
                alignment.y += neighbor.velocityY;
       
                neighborsCount ++;
                this.neighCount ++;
            }

            if (distance < this.separationRadius) {
                separation.x += (this.x - neighbor.x)/distance; // I want to dodge the closest boid first.
                separation.y += (this.y - neighbor.y)/distance;
                this.neighCount ++;
            }
        }

        if (neighborsCount === 0) return {x: 0, y: 0};

        mass.x = (mass.x / neighborsCount) - this.x;
        mass.y = (mass.y / neighborsCount) - this.y;
        //Set magnetude
        let massSteering = Math.sqrt(mass.x ** 2 + mass.y ** 2);
        if (massSteering !== 0) {
            mass.x = (mass.x / massSteering) * this.maxForce;
            mass.y = (mass.y / massSteering) * this.maxForce
        }
        
        alignment.x =  (alignment.x / neighborsCount);
        alignment.y =  (alignment.y / neighborsCount);
        //Set magnetude
        let alignSteering = Math.sqrt(alignment.x ** 2 + alignment.y ** 2);
        if (alignSteering !== 0) {
            alignment.x = (alignment.x / alignSteering) * this.maxForce
            alignment.y = (alignment.y / alignSteering) * this.maxForce
        }

        //Set magnetude
        let separSteering = Math.sqrt(separation.x ** 2 + separation.y ** 2);
        if (separSteering !== 0) {
            separation.x = (separation.x / separSteering) * this.maxForce
            separation.y = (separation.y / separSteering) * this.maxForce
        }

        let updateX: number =  userCoefs.mass * mass.x + userCoefs.alignement * alignment.x + userCoefs.separation * separation.x;
        let updateY: number =  userCoefs.mass * mass.y + userCoefs.alignement * alignment.y + userCoefs.separation * separation.y;

        return {x: updateX, y: updateY}
    }

    private clampToPacmanWorld(canvas: HTMLCanvasElement): void {
        if (this.x >= canvas.width) {
            this.x = 0
        }
        else if (this.x < 0) {
            this.x = canvas.width
        }
        if (this.y >= canvas.height) {
            this.y = 0
        }
        else if (this.y < 0) {
            this.y = canvas.height
        }
    }

    private bouncingBorders(canvas: HTMLCanvasElement): void {
        if (this.x > canvas.width || this.x < 0) {
            this.velocityX = - this.velocityX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.velocityY = - this.velocityY;
        }
    }
}