import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import PoissonDiskSampling from "poisson-disk-sampling";
import { PriorityQueue } from "../../utils/PriorityQueue";

export class SimuEngineTSP extends SimuEngine {

    private cityNbr: number;

    private cities: City[];
    private roads: Road[];

    private computingMST: boolean;
    private computingTSP: boolean;
    private completedTSP: boolean;

    private startCity: City | null;

    private heapMST: PriorityQueue<City>;
    private predecessors: Map<City,City>;

    private tour: City[];
    private finalTour: City[];

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);

        this.cityNbr = 50;

        this.cities = [];
        this.roads = [];

        this.computingMST = false;
        this.computingTSP = false;
        this.completedTSP = false;

        this.startCity = null;

        this.heapMST = new PriorityQueue<City>((c1, c2) => {
            if (c1.cost > c2.cost) return 1;
            return -1;
        });
        this.predecessors = new Map();

        this.tour = [];
        this.finalTour = [];

        this.start();
    }
    start(): void {
        if (!this.ctx) return;
        this.initGraph();
        this.initMST();
        this.initTSP();
    }

    private initGraph(): void {

        // Initialize the Poisson disk sampling with margins
        const marginX = 100;
        const marginY = 100;
        const poisson = new PoissonDiskSampling({
            shape: [this.canvas.width - marginX * 2, this.canvas.height - marginY * 2],
            minDistance: 100, // Adjust the minimum distance between points as needed
            maxDistance: 200, // Adjust the maximum distance between points as needed
        });

        // Generate points with Poisson disk sampling (may generate more than needed)
        const generatedPoints = poisson.fill();

        // Shift the points to center them on the canvas with margins
        const points = generatedPoints.map(point => [point[0] + marginX, point[1] + marginY]).slice(0, this.cityNbr);

        // Convert generated points to cities
        for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i];
            const cityName = `City ${i + 1}`;
            const city = new City(cityName, x, y);
            this.cities.push(city);
        }

        // Generate random roads between cities
        for (let i = 0; i < this.cities.length; i++) {
            for (let j = i + 1; j < this.cities.length; j++) {
                const roadCost = Math.sqrt(
                    Math.pow(this.cities[i].x - this.cities[j].x, 2) +
                    Math.pow(this.cities[i].y - this.cities[j].y, 2)
                );
                const roadIJ = new Road(roadCost, this.cities[i], this.cities[j]);

                const roadJI = new Road(roadCost, this.cities[j], this.cities[i]);

                this.cities[i].connectedRoads.add(roadIJ);
                this.roads.push(roadIJ);
                this.cities[j].connectedRoads.add(roadJI);
                this.roads.push(roadJI);   
            }
        }
    }

    private initMST(): void {
        this.startCity = this.cities[Math.floor(Math.random() * this.cities.length)];
        this.startCity.cost = 0;
        for (let i = 0; i <  this.cities.length; i++) {
            this.heapMST.enqueue(this.cities[i]);
        }
        this.computingMST = true;
    }

    private initTSP(): void {
        if (this.startCity)
        this.tour.push(this.startCity);
    }

    do(): void {
        if (!this.ctx) return;

        // Draw the background with a regular fillRect
        this.ctx.fillStyle = "rgba(25, 25, 25, 1)"; // Adjust the background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.computingMST) {
            if (this.heapMST.length != 0) {
                this.doMSTStep();
            }
            else {
                this.finishMST();
                this.computingMST = false;
                this.computingTSP = true;
                debugger
            }
        }
        else if (this.computingTSP) {
            if (!this.completedTSP) {
                this.doTSPStep(this.tour[this.tour.length - 1]);
            } else {
                // All cities have been visited in TSP, complete the tour
                this.finishTSP();
                this.computingTSP = false;
            }
        }

        for (const road of this.roads) {
            this.renderRoad(road);
        }
        for (const city of this.cities) {
            this.renderCity(city);
        }

        if (!this.completedTSP) return;

        // Draw the path on top of the canvas
        this.renderPath();


        // Draw lines to represent the final tour
        this.ctx.strokeStyle = 'purple';
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.finalTour.length - 1; i++) {
            const cityA = this.finalTour[i];
            const cityB = this.finalTour[i + 1];

            this.ctx.beginPath();
            this.ctx.moveTo(cityA.x, cityA.y);
            this.ctx.lineTo(cityB.x, cityB.y);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    private doMSTStep(): void {
        const city = this.heapMST.dequeue();
        if (!city) return;
        for (const road of city.connectedRoads) {
            const otherCity = road.cityB;
            if (this.heapMST.has(otherCity) && otherCity.cost >= road.cost) {
                this.predecessors.set(otherCity, city);
                otherCity.cost = road.cost
                this.heapMST.sort();
            }
        }
    }

    private finishMST(): void {
        for (const [city, predecessor] of this.predecessors.entries()) {
            predecessor.childrenMST.push(city);
        }
        for (const city of this.cities) {
            city.childrenMST = city.childrenMST.sort((c1, c2) => {
                const pred: City | undefined = this.predecessors.get(c1);
                if (!pred)
                    return 0;
                const roadCostC1 = Math.sqrt(
                    Math.pow(c1.x - pred.x, 2) +
                    Math.pow(c1.y -pred.y, 2)
                );
                const roadCostC2 = Math.sqrt(
                    Math.pow(c2.x - pred.x, 2) +
                    Math.pow(c2.y -pred.y, 2)
                );
                
                if (roadCostC1>roadCostC2) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
        }
    }

    private doTSPStep(city: City) : void {
        if (city.childrenMST.length == 0) {
            const backwards = this.predecessors.get(city);
            if (backwards) {
                this.tour.push(backwards);
            }
            else {
                this.completedTSP = true;
            }
        }
        else {
            const firstChildFound: City = city.childrenMST[0];
            this.tour.push(firstChildFound);
            firstChildFound.visited = true;
            city.childrenMST = city.childrenMST.slice(1, city.childrenMST.length);
            return;
        }
    }

    private finishTSP(): void {
        for (let i = 0; i < this.tour.length; i ++) {
            if (!this.finalTour.includes(this.tour[i])) {
                this.finalTour.push(this.tour[i]);
            }
        }
        if (this.startCity) {
            this.finalTour.push(this.startCity);
            this.startCity.visited = true;
        }
    }

    // Render a city as a circle with different colors and sizes based on their properties
    private renderCity(city: City): void {
        if (!this.ctx) return;

        const colors = [
            'rgba(94, 255, 255, 1)',    // RGB (94, 255, 255)
            'rgba(79, 255, 193, 1)',    // RGB (79, 255, 193)
            'rgba(160, 214, 180, 1)',  // RGB (160, 214, 180)
            'rgba(26, 145, 50, 1)',    // RGB (26, 145, 50)
            'rgba(48, 77, 99, 1)'      // RGB (48, 77, 99)
        ]; 

        let circleRadius = 3; // Default size for regular points
        let circleColor = colors[3]; // Default color for regular points

        if (city === this.startCity) {
            circleRadius = 5; // Larger size for the starting point
            circleColor = colors[0]; // Red color for the starting point
        }
        else if (city.visited) {
            circleRadius = 8;
            circleColor = colors[1];
        }

        // Calculate the circle position
        const x = city.x;
        const y = city.y;

        // Draw the circle
        this.ctx.fillStyle = circleColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();

        // Add the city name as a label next to the circle
        this.ctx.fillStyle = 'white'; // Set the text color to black
        this.ctx.font = '12px Arial bold'; // Set the font style
        this.ctx.textAlign = 'center'; // Align the text to the center
        this.ctx.fillText(city.name, x + 10, y + 20);
    }

    // Render a road segment with different colors and sizes based on their properties
    private renderRoad(road: Road): void {
        if (!this.ctx) return;

        let roadWidth = 1; // Default width for regular roads
        let roadColor = 'blue'; // Default color for regular roads

        const colors = [
            'rgba(94, 255, 255, 1)',    // RGB (94, 255, 255)
            'rgba(79, 255, 193, 1)',    // RGB (79, 255, 193)
            'rgba(160, 214, 180, 1)',  // RGB (160, 214, 180)
            'rgba(26, 145, 50, 1)',    // RGB (26, 145, 50)
            'rgba(48, 77, 99, 1)'      // RGB (48, 77, 99)
        ]; 

        if (road.isMSTRoad(this.predecessors)) {
            roadWidth = 2; // Larger width for MST edges
            roadColor = colors[0]; // Red color for MST edges
        }
        else {
            return;
        }

        // Set the road color and width
        this.ctx.strokeStyle = roadColor;
        this.ctx.lineWidth = roadWidth;

        // Draw the road segment
        this.ctx.beginPath();
        this.ctx.moveTo(road.cityA.x, road.cityA.y);
        this.ctx.lineTo(road.cityB.x, road.cityB.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private renderPath(): void {
        if (!this.ctx) return;

        // Draw the path on top of the canvas
        const pathText = this.getPathString();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial bold';
        this.ctx.textAlign = 'center';

        this.ctx.fillText(pathText, this.canvas.width / 2, 30);
    }

    private getPathString(): string {
        let path = "Path: ";
        for (let i = 0; i < this.finalTour.length; i++) {
            path += this.finalTour[i].name;
            if (i < this.finalTour.length - 1) {
                path += " - ";
            }
        }
        return path;
    }

    stop(): void {
        if (!this.ctx) return;
        this.stopLoop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    updateSettings(settings: any): void {
    }
}

class City {
    public name: string;
    public x: number;
    public y: number;
    public connectedRoads: Set<Road>;
    public cost: number;
    public visited: boolean;
    public childrenMST: City[];

    constructor(name: string, x: number, y: number) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.connectedRoads = new Set();
        this.cost = Infinity;
        this.visited = false;
        this.childrenMST = [];
    }
}

class Road {
    public cost: number;
    public cityA: City;
    public cityB: City;

    constructor(cost: number, cityA: City, cityB: City) {
        this.cost = cost;
        this.cityA = cityA;
        this.cityB = cityB;
    }

    public isMSTRoad(predecessors: Map<City,City>): boolean {
        const end: City | undefined = predecessors.get(this.cityA);
        if (!end) return false;
        if (end != this.cityB) return false;
        return true;
    }
}