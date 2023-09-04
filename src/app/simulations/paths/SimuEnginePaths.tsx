import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";

export class SimuEnginePaths extends SimuEngine {

    private cellSideLength: number;
    private cells: Cell[][];
    private numWalls: number;
    private openList: Cell[];
    private numRows: number;
    private numCols: number;
    private arrival: Cell;
    private departure: Cell;
    private noPathFound: boolean;
    private pathFound: boolean;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);
        this.cellSideLength = 20;
        this.numWalls = 20;
        this.cells = [];
        this.openList = [];
        this.noPathFound = false;
        this.pathFound = false;
        this.numRows = Math.floor(this.canvas.height / this.cellSideLength);
        this.numCols = Math.floor(this.canvas.width / this.cellSideLength);
        this.start();
        this.departure = this.cells[0][0]
        this.departure.isDeparture = true;
        this.arrival = this.cells[this.numRows][this.numCols]
        this.departure.isArrival = true;
    }

    start(): void {
        if (!this.ctx) return;
        this.init();
    }

    init(): void {

        let wallsCount: number = 0;

        for (let i = 0; i < this.numRows; i++) {
            const row = [];
            for (let j = 0; j < this.numCols; j++) {
                const cell = new Cell(j, i);
                // Randomly set some cells as walls
                if (Math.random() < 0.2 && this.numWalls > wallsCount) {
                    cell.isWall = true;
                    wallsCount++;
                }
                row.push(cell);
            }
            this.cells.push(row);
        }
    }


    do(): void {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.doAstarStep();

        // Iterate through all cells and render each one
        for (const row of this.cells) {
            for (const cell of row) {
                this.renderCell(cell);
            }
        }
    }

    private doAstarStep(): void {
        // If the A* algorithm is already complete or no path is found, return
        if (this.noPathFound || this.pathFound) {
            return;
        }
    
        // Find the cell with the lowest F cost in the open list
        let currentCell = this.findLowestFCost();

        if (currentCell == this.arrival) return;
    
        // Remove the current cell from the open list
        this.removeFromOpenList(currentCell);
    
        // Add the current cell to the closed list
        currentCell.isClosed = true;
    
        // For each neighbor of the current cell
        for (const neighbor of this.getNeighbors(currentCell, this.cells)) {
            // If the neighbor is the arrival cell, the path is found
            if (neighbor === this.arrival) {
                this.constructPath(neighbor);
                return;
            }
    
            // If the neighbor is a wall or in the closed list, skip it
            if (neighbor.isWall || neighbor.isValidated) {
                continue;
            }
    
            // Calculate the tentative G cost to this neighbor
            const tentativeGCost = currentCell.gCost + this.distance(currentCell, neighbor);
    
            // If the neighbor is not in the open list or has a lower G cost
            if (!neighbor.isObserved || tentativeGCost < neighbor.gCost) {
                // Set the parent of the neighbor to the current cell
                neighbor.parent = currentCell;
    
                // Update neighbor's G and H costs
                neighbor.gCost = tentativeGCost;
                neighbor.hCost = this.heuristic(neighbor);
    
                // Calculate the F cost for the neighbor
                neighbor.fCost = neighbor.gCost + neighbor.hCost;
    
                // If the neighbor is not in the open list, add it
                if (!neighbor.isObserved) {
                    this.addToOpenList(neighbor);
                }
            }
        }
    
        // If the open list is empty, no path is found
        if (this.openList.length == 0) {
            this.noPathFound = true;
            return;
        }
    }

    private findLowestFCost(): Cell {
        let lowestFCostCell = this.arrival;
        let lowestFCost = Infinity;
    
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.isObserved && !cell.isClosed && cell.fCost < lowestFCost) {
                    lowestFCost = cell.fCost;
                    lowestFCostCell = cell;
                }
            }
        }
    
        return lowestFCostCell;
    }

    private addToOpenList(cell: Cell | null): void {
        // ... your existing code to add cell to open list
        if (!cell) return;
        cell.isObserved = true;
        // Add the cell to the openList array
        this.openList.push(cell);
    }

    private removeFromOpenList(cell: Cell): void {
        cell.isObserved = false;
        const index = this.openList.indexOf(cell);
        if (index !== -1) {
            this.openList.splice(index, 1);
        }
    }

    private getNeighbors(currentCell: Cell, cells: Cell[][]): Cell[] {
        const neighbors: Cell[] = [];
        const numRows = cells.length;
        const numCols = cells[0].length;
    
        // Define possible neighbor positions
        const neighborPositions = [
            { x: -1, y: 0 },  // Left
            { x: 1, y: 0 },   // Right
            { x: 0, y: -1 },  // Up
            { x: 0, y: 1 }    // Down
        ];
    
        for (const position of neighborPositions) {
            const newX = currentCell.x + position.x;
            const newY = currentCell.y + position.y;
    
            // Check if the neighbor is within the grid bounds
            if (newX >= 0 && newX < numCols && newY >= 0 && newY < numRows) {
                const neighbor = cells[newY][newX];
                neighbors.push(neighbor);
            }
        }
    
        return neighbors;
    }

    private constructPath(neighbor: Cell): void {
        // Create an array to store the path from the departure to the arrival
        const path: Cell[] = [];
        
        this.pathFound = true;

        // Start from the arrival cell and backtrack to the departure cell
        let currentCell: Cell | null = neighbor;
        while (currentCell !== null) {
            path.unshift(currentCell); // Add the current cell to the beginning of the path
            currentCell = currentCell.parent; // Move to the parent cell
        }
        
        // Mark each cell in the path as validated
        for (const cell of path) {
            cell.isValidated = true;
        }     
        // Optionally, you can store or use the 'path' array as needed
    }
    

    private distance(cell1: Cell, cell2: Cell): number {
        // Euclidean distance (straight-line distance)
        const dx = cell2.x - cell1.x;
        const dy = cell2.y - cell1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    
    
    // Modify the render method to take a cell as an argument
    renderCell(cell: Cell): void {
        if (!this.ctx) return;

        const x = cell.x * this.cellSideLength;
        const y = cell.y * this.cellSideLength;

        // Draw cell border
        this.ctx.strokeStyle = 'black'; // Border color
        this.ctx.lineWidth = 1; // Border width
        this.ctx.strokeRect(x, y, this.cellSideLength, this.cellSideLength);

        // Draw cell based on its type
        if (cell.isDeparture) {
            this.ctx.fillStyle = 'green'; // Departure cell is green
        } else if (cell.isArrival) {
            this.ctx.fillStyle = 'red'; // Arrival cell is red
        } else if (cell.isWall) {
            this.ctx.fillStyle = 'brown'; // Wall cell is brown
        } else if (cell.isValidated) {
            this.ctx.fillStyle = 'green'; // Validated cell is green
        } else if (cell.isObserved) {
            this.ctx.fillStyle = 'blue'; // Observed cell is blue
        } else {
            this.ctx.fillStyle = 'white'; // Normal cell is white
        }

        // Fill the cell without overlapping the borders
        this.ctx.fillRect(x + 1, y + 1, this.cellSideLength - 2, this.cellSideLength - 2);
    }

    private heuristic(cell: Cell): number {
        // Calculate the Manhattan distance (absolute differences in x and y)
        const dx = Math.abs(cell.x - this.arrival.x);
        const dy = Math.abs(cell.y - this.arrival.y);
    
        // Return the Manhattan distance as the heuristic cost (H)
        return dx + dy;
    }    

    stop(): void {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateSettings(settings: any): void {
        // Implement updateSettings logic for Paths Simulation
    }
}

class Cell {
    public isWall: boolean;
    public isDeparture: boolean;
    public isArrival: boolean;
    public isObserved: boolean;
    public isValidated: boolean;
    public x: number;
    public y: number;
    public fCost: number;
    public gCost: number;
    public hCost: number;
    public parent: Cell | null; // Parent cell for constructing the path
    public isClosed: boolean; // Indicates if the cell is in the closed list

    constructor(x: number, y: number) {
        this.isWall = false;
        this.isDeparture = false;
        this.isArrival = false;
        this.isObserved = false;
        this.isValidated = false;
        this.x = x;
        this.y = y;
        this.fCost = 0;
        this.gCost = Infinity;
        this.hCost = 0;
        this.parent = null;
        this.isClosed = false;
    }
}





