import { RefObject } from "react";
import { SimuEngine } from "../SimuEngine";

export class SimuEngineGOL extends SimuEngine {

    private cellSideLength: number;
    private cells: Cell[][];
    private numRows: number;
    private numCols: number;

    private eventOn: boolean;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        super(canvas, ctx, canvasRef);

        this.cellSideLength = 15;
        this.numRows = Math.floor(this.canvas.height / this.cellSideLength);
        this.numCols = Math.floor(this.canvas.width / this.cellSideLength);

        this.cells = [];

        this.eventOn = false;

        this.start();
    }

    // Méthode pour démarrer la simulation
    start(): void {

        this.cells = this.createGrid();

        // render cells
        for (const row of this.cells) {
            for (const cell of row) {
                this.updateCell(cell);
                this.renderCell(cell);
            }
        }

        this.addEvent();
    }

    private createGrid(): Cell[][] {

        const newCells: Cell[][] = [];

        for (let i = 0; i < this.numCols; i++) {
            const row = [];
            for (let j = 0; j < this.numRows; j++) {
                const cell = new Cell(i, j);
                row.push(cell);
            }
            newCells.push(row);
        }

        // Initialisation des voisins pour chaque cellule
        for (let i = 0; i < this.numCols; i++) {
            for (let j = 0; j < this.numRows; j++) {
                const cell = newCells[i][j];
                this.initNeighbors(cell, newCells);
            }
        }

        return newCells;
    }

    // Méthode pour initialiser les voisins d'une cellule (Voisinage de Moore)
    private initNeighbors(cell: Cell, cells: Cell[][]): void {
        const { x, y } = cell;

        // Définis les coordonnées relatives des voisins (8 voisins possibles)
        const relativeNeighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], /*[0, 0],*/ [0, 1],  // Note: Le voisin au centre (0, 0) n'est pas inclus.
            [1, -1], [1, 0], [1, 1],
        ];

        // Parcours les coordonnées relatives des voisins et ajoute les cellules voisines à la liste de voisins de cette cellule.
        for (const [dx, dy] of relativeNeighbors) {
            const neighborX = x + dx;
            const neighborY = y + dy;

            // Vérifie si le voisin est dans les limites de la grille
            if (neighborX >= 0 && neighborX < this.numCols && neighborY >= 0 && neighborY < this.numRows) {
                cell.neighbors.push(cells[neighborX][neighborY]);
            }
        }
    }

    private addEvent(): void {
        if (this.canvasRef.current) {
            this.eventOn = true;
            this.canvasRef.current.addEventListener('mousedown', this.handleMouseDown);
        }
    }
    
    private removeEvent(): void {
        if (this.canvasRef.current) {
            this.eventOn = false;
            this.canvasRef.current.removeEventListener('mousedown', this.handleMouseDown);
        }
    }
    
    private handleMouseDown = (event: MouseEvent): void => {
        if (!this.ctx) return;

        // Get the mouse coordinates relative to the canvas
        const pos = this.getMousePos(event);
        // const x = event.clientX - this.canvas.getBoundingClientRect().left;
        // const y = event.clientY - this.canvas.getBoundingClientRect().top;
    
        const x = pos.x;
        const y = pos.y;

        // Iterate through all cells
        for (const row of this.cells) {
            for (const cell of row) {
                const cellX = cell.x * this.cellSideLength;
                const cellY = cell.y * this.cellSideLength;
    
                // Check if the mouse coordinates are inside the current cell
                if (x >= cellX && x < cellX + this.cellSideLength && y >= cellY && y < cellY + this.cellSideLength) {
                    // Toggle the 'alive' state of the clicked cell
                    cell.alive = !cell.alive;
    
                    // Redraw the cell to reflect the new state
                    this.renderCell(cell);
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
        // This method is called in an animation loop.
        if (!this.ctx) return;
        // Clear the canvas before rendering the next frame.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create new grid
        const newCells: Cell[][] = this.createGrid();

        // Iterate through all cells and update each one based on the copy of the grid
        for (const row of this.cells) {
            for (const cell of row) {

                const copy = newCells[cell.x][cell.y];
                copy.alive = cell.alive;

                // Update the copied cell based on this.cells
                this.updateCell(copy);
                this.renderCell(copy);
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

    // Modify the render method to take a cell as an argument
    private renderCell(cell: Cell): void {
        if (!this.ctx) return;

        const x = cell.x * this.cellSideLength;
        const y = cell.y * this.cellSideLength;
    
        // Draw cell based on its type
        if (!cell.alive) {
            this.ctx.fillStyle = 'white';
        }
        else {
            this.ctx.fillStyle = 'black';
        }
    
        // Fill the cell without overlapping the borders
        this.ctx.fillRect(x, y, this.cellSideLength, this.cellSideLength);
    
        // Draw cell border
        this.ctx.strokeStyle = 'grey'; // Border color
        this.ctx.lineWidth = 1; // Border width
        this.ctx.strokeRect(x, y, this.cellSideLength, this.cellSideLength);
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

class Cell {

    public x: number;
    public y: number;
    public alive: boolean;
    public neighbors: Cell[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.alive = false;
        this.neighbors = [];
    }
}
