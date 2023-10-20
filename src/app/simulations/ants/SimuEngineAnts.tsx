import { SimuEngine } from "../SimuEngine";
import { Circle, Point } from "../../utils/Point";
import { DrawingUtils } from "../../utils/DrawingUtils";
import context from "react-bootstrap/esm/AccordionContext";
import "simplex-noise";
import { createNoise2D } from "simplex-noise";

export class SimuEngineAnts extends SimuEngine {

    private ant: Ant;

    private obstacles: Obstacle[];
    private obstacleNbr: number;
    private obstacleResolution: number;
    private obstacleMinRadius: number;
    private obstacleMaxRadius: number;
    private pointToHeight: Map<Point, number> = new Map();

    private pheromons: Set<Pheromon>;
    private fadeFactor: number;
    private pheromonDeathhreshold: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, diagLength: number) {
        super(canvas, ctx, diagLength);

        this.pheromons = new Set();
        this.fadeFactor = 0.99;
        this.pheromonDeathhreshold = 0.00005;

        const initialX = DrawingUtils.getRndNbrBetween(0, this.canvas.width);
        const initialY = DrawingUtils.getRndNbrBetween(0, this.canvas.height);
        const initialVelocityX = DrawingUtils.getRndNbrBetween(-1, 1);
        const initialVelocityY = DrawingUtils.getRndNbrBetween(-1, 1);
        this.ant = new Ant(initialX, initialY, 0.003*this.diagLength, initialVelocityX, initialVelocityY, 0.005*this.diagLength);

        this.obstacles = [];
        
        this.obstacleNbr = 1;
        this.obstacleResolution = 36;
        this.obstacleMinRadius = 100;
        this.obstacleMaxRadius = 100;

        this.initObstacles();
    }

    // Méthode pour démarrer la simulation
    init(): void {

    }

    private initObstacles(): void {
        
        const nbCol = this.canvas.width / this.obstacleResolution;
        const nbRow = this.canvas.height / this.obstacleResolution;
        const noise2D = createNoise2D();
        const grid: gridPoint[][] = [];
        const allGridPoints: gridPoint[] = [];
        
        for (let i = 0; i < nbCol; i ++) {
            const row: gridPoint[] = []; 
            for (let j = 0; j < nbRow; j++) {
                const x = i*this.obstacleResolution;
                const y = j*this.obstacleResolution;
                let height = noise2D(x*0.004,y*0.004);
                if (height > -0.3) {
                    height = 0;
                }
                const point: gridPoint = new gridPoint(x, y, i, j, Math.abs(height)); // Easier to think with positive heights.
                row.push(point);
                allGridPoints.push(point);
            }
            grid.push(row);
        }



        while (allGridPoints.length !== 0) {

            let highestPoint: gridPoint;
            let maxHeight = 0;
            for (const point of allGridPoints) {
                if (point.height > maxHeight) {
                    maxHeight = point.height;
                    highestPoint = point;
                }
            }

            highestPoint = highestPoint!;

            const highestPointNeighbors: gridPoint[] = this.updateNeighborhood(highestPoint, grid, []);

            // Remove treated points.
            for (const point of highestPointNeighbors) {
                allGridPoints.splice(allGridPoints.indexOf(point), 1);
            }

            // Post process, only keep borders.
            const relativeNeighbors = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], /*[0, 0],*/ [0, 1],
                [1, -1], [1, 0], [1, 1],
            ];
            for (const currPoint of highestPointNeighbors) {
                let remove: boolean = true;
                for (const [di, dj] of relativeNeighbors) {
                    const neighborI = currPoint.i + di;
                    const neighborJ = currPoint.j + dj;
                    const neighbor: gridPoint = grid[neighborJ][neighborI]
                    if (!neighbor.getVisited() || neighbor === undefined) {
                        remove = false;
                        break;
                    }
                }
                if (!remove) {
                    continue;
                }
                else {
                    highestPointNeighbors.splice(highestPointNeighbors.indexOf(currPoint), 1);
                }
            }
            this.obstacles.push(new Obstacle(highestPointNeighbors));
        }
    }

    private updateNeighborhood(currPoint: gridPoint, grid: gridPoint[][], highestPointNeighbors: gridPoint[]): gridPoint[] {
        currPoint.setVisited(true);
        const relativeNeighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], /*[0, 0],*/ [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];
        const currNeighborhoodToAdd: gridPoint [] = [];
        for (const [di, dj] of relativeNeighbors) {
            const neighborI = currPoint.i + di;
            const neighborJ = currPoint.j + dj;
            const neighbor: gridPoint = grid[neighborJ][neighborI]
            if (neighbor === undefined) {
                continue; // Canvas borders.
            }
            if (neighbor.height !== 0 && !neighbor.getVisited()) {
                currNeighborhoodToAdd.push(neighbor);
                this.updateNeighborhood(neighbor, grid, currNeighborhoodToAdd);
            }
        }
        return currNeighborhoodToAdd;
    }

    do(): void {
        if (!this.ctx) return;

        DrawingUtils.clearCanvas(this.ctx, this.canvas);

        for (const [point, height] of this.pointToHeight) {
            DrawingUtils.renderCircle(this.ctx, new Circle(point.x,point.y,Math.abs(height)*3), DrawingUtils.getColors()[0]);
        }

        for (const obstacle of this.obstacles) {
            obstacle.draw(this.ctx);
        }

        // this.ant.draw(this.ctx, this.canvas, this.diagLength);
        // for (const pheromon of this.pheromons) {
        //     pheromon.draw(this.ctx, this.canvas, this.diagLength);
        // }

        // this.ant.move(this.canvas);
        // this.pheromons.add(this.ant.dropPheromon(5));
        // this.updatePheromons();     
    }

    private updatePheromons(): void {
        const toRmv: Set<Pheromon> = new Set();
        for (const pheromon of this.pheromons) {
            pheromon.intensity *= this.fadeFactor;
            if (pheromon.intensity < this.pheromonDeathhreshold) {
                toRmv.add(pheromon);
            }
        }
        for (const pheromon of toRmv) {
            this.pheromons.delete(pheromon);
        }
    }

    updateSettings(settings: any): void {
    }
}

export class Ant extends Circle {
    
    private velocityX: number;
    private velocityY: number;
    private heading: number;
    private maxSpeed: number; // max resulting speed

    constructor(x: number, y: number, r: number, velocityX: number, velocityY: number, maxSpeed: number) {
        super(x,y,r);
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.maxSpeed = maxSpeed;
        this.heading = Math.atan2(this.velocityY, this.velocityX);
    }

    public draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, diagLength: number): void {

        const color = DrawingUtils.getColors()[0];
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

    public move(canvas: HTMLCanvasElement): void {

        if (this.x > canvas.width || this.x < 0) {
            this.velocityX = - this.velocityX;
        }
        else if (this.y > canvas.height || this.y < 0) {
            this.velocityY = - this.velocityY;
        }
        else {
           
            this.velocityX += DrawingUtils.getRndNbrBetween(-1, 1);
            this.velocityY +=  DrawingUtils.getRndNbrBetween(-1, 1);
            let speed = Math.sqrt(this.velocityX ** 2 +this.velocityY ** 2);
            if (speed > this.maxSpeed) {
                this.velocityX = (this.velocityX / speed) * this.maxSpeed;
                this.velocityY = (this.velocityY / speed) * this.maxSpeed;
            }
        }
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.heading = Math.atan2(this.velocityY, this.velocityX);
    }

    public dropPheromon(intensity: number): Pheromon {
        return new Pheromon(this.x, this.y, intensity);
    }
}

export class Pheromon extends Circle {
    public intensity: number;
    constructor(x: number, y: number, intensity: number) {
        super(x,y,intensity);
        this.intensity = intensity;
    }

    public draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, diagLength: number): void {
        const color = DrawingUtils.getColors()[2];
        DrawingUtils.renderCircle(ctx, this, color);
    }
}

export class Obstacle {
    private path: Path2D;
    private pointsList: Point [];

    constructor(pointsList: Point[]) {
        this.path = new Path2D();
        this.pointsList = pointsList;
    }

    private init(obsRes: number, noiseScale: number): void {

        // const layerNbr = 10;
        // const noise2D = createNoise2D();

        // const firstPoint = new Point(this.x + this.initRadius, this.y);
        // this.pointsList.push(firstPoint);

        // let prevPoint = firstPoint;
        // let currAngle = 0;
        // let lastRadius = this.initRadius;

        // while (currAngle < 360.0) {
        //     // Get back to initialRadius when you complete the 'circle'.
        //     let currRadius = (currAngle/360) * this.initRadius + (1-(currAngle/360))*lastRadius;
        //     let noise: number = 0;
        //     for (let i = 1; i <= layerNbr; i++) {
        //         noise += noise2D(prevPoint.x*(i*noiseScale) , prevPoint.y*(i*noiseScale)) * (i/layerNbr); // More weight to high scales.
        //     }
        //     // noise /= layerNbr; // End the average between layers.
        //     noise += 1; // Map [-1;1] noise to [0,1] noise.
        //     noise /= 2;
        //     currRadius *= noise; // Take a percentage of the radius based on noise.
        //     var angleInRadians = currAngle * (Math.PI / 180);
        //     const currPoint = new Point(this.x + currRadius * Math.cos(angleInRadians), this.y + currRadius * Math.sin(angleInRadians));
        //     this.pointsList.push(currPoint);
        //     lastRadius = currRadius;
        //     prevPoint = currPoint;
        //     currAngle += obsRes;
        // }
        // this.pointsList.push(firstPoint);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const color = DrawingUtils.getColors()[0];
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        this.path.moveTo(this.pointsList[0].x, this.pointsList[0].y);
        for (let i = 1; i < this.pointsList.length; i ++) {
            this.path.lineTo(this.pointsList[i].x, this.pointsList[i].y);
        }
        ctx.stroke(this.path);
        ctx.fill(this.path);
    }
}

export class gridPoint extends Point {
    public readonly i: number;
    public readonly j: number;
    public readonly height: number;
    private visited: boolean;
    constructor(x: number, y:number, i: number, j: number, height: number) {
        super(x,y);
        this.i = i;
        this.j = j;
        this.height = height;
        this.visited = false;
    }
    public getVisited(): boolean {
        return this.visited;
    }
    public setVisited(visited: boolean): void {
        this.visited = visited;
    }
}

