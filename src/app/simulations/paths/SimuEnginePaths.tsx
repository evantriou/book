import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";
import { PriorityQueue } from "../../utils/PriorityQueue";
import { Point } from "../../utils/Point";
import { DrawingUtils } from "../../utils/DrawingUtils";

export class SimuEnginePaths extends SimuEngine {

    private cellSideLength: number;
    private cells: Cell[][];
    private openQueue: PriorityQueue<Cell>;
    private numRows: number;
    private numCols: number;
    private arrival: Cell;
    private departure: Cell;
    private noPathFound: boolean;
    private pathFound: boolean;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);

        this.cellSideLength = 23;
        this.numRows = Math.floor(this.canvas.height / this.cellSideLength);
        this.numCols = Math.floor(this.canvas.width / this.cellSideLength);
        this.cells = [];

        this.init();

        this.noPathFound = false;
        this.pathFound = false;

        this.arrival = this.cells[this.numRows - 1][this.numCols - 1]
        this.departure = this.cells[0][0]

        this.openQueue = new PriorityQueue<Cell>((c1, c2) => {
            if (c1.fCost > c2.fCost) return 1;
            return -1;
        });
        this.openQueue.enqueue(this.departure);
        this.departure.isObserved = true;
        this.departure.fCost = 0;
        this.departure.gCost = 0;
    }

    init(): void {
        if (!this.ctx) return;
        
        for (let i = 0; i < this.numRows; i++) {
            const row = [];
            for (let j = 0; j < this.numCols; j++) {
                const cell = new Cell(j, i);

                if (i === 0 && j === 0) {
                    cell.isDeparture = true;
                }
                else if (i === this.numRows - 1 && j === this.numCols - 1) {
                    cell.isArrival = true;
                }
                else if (Math.random() < 0.1) {
                    cell.isWall = true;
                }
                row.push(cell);
            }
            this.cells.push(row);
        }

        this.renderAllCells();
    }

    do(): void {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.doAstarStep();

        this.renderAllCells();
    }

    private doAstarStep(): void {

        if (this.noPathFound || this.pathFound) {
            return;
        }

        const currentCell: Cell | undefined = this.openQueue.dequeue();

        if (!currentCell) return;

        currentCell.isObserved = false;
        currentCell.isClosed = true;

        if (currentCell === this.arrival) {
            this.constructPath(currentCell);
            return;
        }

        for (const neighbor of this.getNeighbors(currentCell, false)) {

            // We always just move from one cell at a time.
            const tentativeGCost = currentCell.gCost + 1;

            // If the neighbor is not in the open list or has a lower G cost
            if (tentativeGCost < neighbor.gCost) {

                neighbor.gCost = tentativeGCost;
                neighbor.fCost = neighbor.gCost + this.heuristic(neighbor);

                if (neighbor.isObserved) {
                    this.openQueue.sort();
                }
                else {
                    this.openQueue.enqueue(neighbor);
                    currentCell.isObserved = true;
                }
            }
        }
        // If the open list is empty, no path is found
        if (this.openQueue.length === 0) {
            this.noPathFound = true;
            return;
        }
    }

    private getNeighbors(currentCell: Cell, constructPath: boolean): Cell[] {
        const neighbors: Cell[] = [];

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
            if (newX >= 0 && newX < this.numCols && newY >= 0 && newY < this.numRows) {
                const neighbor = this.cells[newY][newX];
                let acceptedCell : boolean = (constructPath || !neighbor.isClosed) && !neighbor.isWall;
                if (acceptedCell) {
                    neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }

    private constructPath(neighbor: Cell): void {
        // Create an array to store the path from the departure to the arrival
        const path: Cell[] = [];

        this.pathFound = true;

        let currentCell: Cell = neighbor;

        while (currentCell.gCost !== 0) {
            let min: number = Infinity;
            let minCell: Cell | null = null;
            for (const neighbor of this.getNeighbors(currentCell, true)) {
                if (neighbor.gCost < min) {
                    min = neighbor.gCost;
                    minCell = neighbor;
                }
            }
            if (!minCell) return;
            path.unshift(minCell);
            minCell.isValidated = true;
            currentCell = minCell;
        }
    }

    private heuristic(cell: Cell): number {
        // Calculate the Manhattan distance (absolute differences in x and y)
        const dx = Math.abs(cell.x - this.arrival.x);
        const dy = Math.abs(cell.y - this.arrival.y);

        // Return the Manhattan distance as the heuristic cost (H)
        return dx + dy;
    }

    private renderAllCells(): void {
        // Iterate through all cells and render each one
        for (const row of this.cells) {
            for (const cell of row) {
                this.renderCell(cell);
            }
        }
    }

    // Modify the render method to take a cell as an argument
    private renderCell(cell: Cell): void {
        if (!this.ctx) return;

        const x = cell.x * this.cellSideLength;
        const y = cell.y * this.cellSideLength;

        // Draw cell border
        this.ctx.strokeStyle = 'rgba(21, 21, 21, 1)'; // Border color
        this.ctx.lineWidth = 1; // Border width
        this.ctx.strokeRect(x, y, this.cellSideLength, this.cellSideLength);

        const colors = DrawingUtils.getColors();

        // Draw cell based on its type
        if (cell.isDeparture) {
            this.ctx.fillStyle = colors[0];
        } else if (cell.isArrival) {
            this.ctx.fillStyle = colors[0];
        } else if (cell.isWall) {
            this.ctx.fillStyle = colors[4];
        } else if (cell.isValidated) {
            this.ctx.fillStyle = colors[0];
        } else if (cell.isClosed) {
            this.ctx.fillStyle = colors[2];
        } else {
            this.ctx.fillStyle =  "rgba(51, 51, 51, 1)";
        }

        // Fill the cell without overlapping the borders
        this.ctx.fillRect(x + 1, y + 1, this.cellSideLength - 2, this.cellSideLength - 2);
    }

    stop(): void {
        if (!this.ctx) return;
        this.stopLoop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateSettings(settings: any): void {
        // Implement updateSettings logic for Paths Simulation
    }
}

class Cell extends Point {
    public isWall: boolean;
    public isDeparture: boolean;
    public isArrival: boolean;
    public isObserved: boolean;
    public isValidated: boolean;
    public fCost: number;
    public gCost: number;
    public isClosed: boolean; // Indicates if the cell is in the closed list

    constructor(x: number, y: number) {
        super(x,y);
        this.isWall = false;
        this.isDeparture = false;
        this.isArrival = false;
        this.isObserved = false;
        this.isValidated = false;
        this.fCost = Infinity;
        this.gCost = Infinity;
        this.isClosed = false;
    }
}