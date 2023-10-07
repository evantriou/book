import { SimuEngine } from "../SimuEngine";
import { Point } from "../../utils/Point";
import { DrawingUtils } from "../../utils/DrawingUtils";
import { Context } from "vm";

export class SimuEngineGOL extends SimuEngine {

    private cellSideLength: number;
    private cells: Cell[][];
    private numRows: number;
    private numCols: number;

    private eventOn: boolean;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, diagLength: number) {
        super(canvas, ctx, diagLength);
        this.FRAMERATE = 80;
        this.cellSideLength = 10;
        this.numRows = Math.floor(this.canvas.height / this.cellSideLength);
        this.numCols = Math.floor(this.canvas.width / this.cellSideLength);

        this.cells = [];

        this.eventOn = false;

        this.init();
    }

    public getCellsDim(): {width: number, height: number} {
        return {width: this.cells.length, height: this.cells[0].length}
    }

    init(xToYAlive?: Map<string, {i:number, j:number}>): void {
        if (!this.ctx) return;
        this.cells = this.createGrid(xToYAlive);

        // render cells
        for (const row of this.cells) {
            for (const cell of row) {
                cell.renderCell(this.ctx, this.cellSideLength);
            }
        }

        this.addEvent();
    }

    private createGrid(xToYAlive?: Map<string, {i:number, j:number}>): Cell[][] {

        const newCells: Cell[][] = [];

        for (let i = 0; i < this.numCols; i++) {
            const col = [];
            for (let j = 0; j < this.numRows; j++) {
                const cell = new Cell(i, j);
                col.push(cell);
                if (xToYAlive === undefined) continue;
                const coord = xToYAlive.get(i+'-'+j);
                if (coord === null || coord === undefined) continue;
                if (coord.i !== i) continue;
                if (coord.j !== j) continue; 
                cell.alive = true;
            }
            newCells.push(col);
        }

        for (let i = 0; i < this.numCols; i++) {
            for (let j = 0; j < this.numRows; j++) {
                const cell = newCells[i][j];
                this.initNeighbors(cell, newCells);
            }
        }

        return newCells;
    }

    private initNeighbors(cell: Cell, cells: Cell[][]): void {
        const { x, y } = cell;

        const relativeNeighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], /*[0, 0],*/ [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];

        for (const [dx, dy] of relativeNeighbors) {
            const neighborX = x + dx;
            const neighborY = y + dy;

            if (neighborX >= 0 && neighborX < this.numCols && neighborY >= 0 && neighborY < this.numRows) {
                cell.neighbors.push(cells[neighborX][neighborY]);
            }
        }
    }

    private addEvent(): void {
        if (this.canvas) {
            this.eventOn = true;
            this.canvas.addEventListener('mousedown', this.handleMouseDown);
        }
    }
    
    private removeEvent(): void {
        if (this.canvas) {
            this.eventOn = false;
            this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        }
    }
    
    private handleMouseDown = (event: MouseEvent): void => {
        if (!this.ctx) return;

        const pos = this.getMousePos(event);
        const x = pos.x;
        const y = pos.y;

        // Iterate through all cells
        for (const row of this.cells) {
            for (const cell of row) {
                const cellX = cell.x * this.cellSideLength;
                const cellY = cell.y * this.cellSideLength;
    
                if (x >= cellX && x < cellX + this.cellSideLength && y >= cellY && y < cellY + this.cellSideLength) {
                    cell.alive = !cell.alive;
                    cell.renderCell(this.ctx, this.cellSideLength);
                }
            }
        }
    }

    private getMousePos(event: MouseEvent): {x:number,y:number} {
        var rect = this.canvas.getBoundingClientRect(), // abs. size of element
          scaleX = this.canvas.width / rect.width,    // relationship bitmap vs. element for x
          scaleY = this.canvas.height / rect.height;  // relationship bitmap vs. element for y
      
        return {
          x: (event.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
          y: (event.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
      }

    do(): void {
        if (this.eventOn) {
            this.removeEvent();
        }
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const newCells: Cell[][] = this.createGrid();

        // Iterate through all cells and update each one based on the copy of the grid
        for (const row of this.cells) {
            for (const cell of row) {

                const copy = newCells[cell.x][cell.y];
                copy.alive = cell.alive;

                // Update the copied cell based on this.cells
                this.updateCell(copy);
                copy.renderCell(this.ctx, this.cellSideLength);
            }
        }

        // Replace the original grid with the updated copy
        this.cells = newCells;
    }

    // Update cell status based on Conway's Game of Life rules :
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    private updateCell(cell: Cell): void {
        const previousCell: Cell = this.cells[cell.x][cell.y]
        const liveNeighbors = previousCell.neighbors.filter((neighbor) => neighbor.alive).length;

        if (cell.alive) {
            if (liveNeighbors < 2 || liveNeighbors > 3) {
                cell.alive = false;
            }
        } else {
            if (liveNeighbors === 3) {
                cell.alive = true;
            }
        }
    }

    updateSettings(settings: any): void {
        if (!this.ctx) return;
        if (!this.canvas) return;
        this.stopLoop();
        this.removeEvent();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const xToYAlive: Map<string, {i:number, j:number}> = settings;
        this.init(xToYAlive)
    }
}

class Cell extends Point {

    public alive: boolean;
    public neighbors: Cell[];

    constructor(x: number, y: number) {
        super(x,y);
        this.alive = false;
        this.neighbors = [];
    }

    public renderCell(ctx: Context, side: number): void {
        if (!ctx) return;

        let color = "rgb(250, 235, 215)";
        if (!this.alive) {
            color = "rgba(51, 51, 51, 1)";
        }
        DrawingUtils.renderCell(ctx, this, side, color, "rgba(21, 21, 21, 1)");
    }
}
