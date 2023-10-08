import { SimuEngine } from "../SimuEngine";
import { interpolateRgbBasisClosed } from "d3-interpolate";
import { DrawingUtils } from "../../utils/DrawingUtils";

// Paths Simulation engine

export class SimuEngineSort extends SimuEngine {
    private readonly numBars: number;
    private readonly maxBarValue: number;
    private readonly valueToHeightRatio: number;
    private readonly barWidth: number;
    private displayedBars: Bar[];
    private sortedBars: Bar[];
    private moves: Move[];
    private timer: number;
    private algoName: string;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, diagLength: number) {
        super(canvas, ctx, diagLength);
        this.FRAMERATE = 15;
        this.numBars = 50;
        this.maxBarValue = 50;
        this.valueToHeightRatio = this.canvas.height / this.maxBarValue;
        this.barWidth = this.canvas.width / this.numBars;
        this.algoName = 'Bubble';
        this.displayedBars = [];
        this.sortedBars = [];
        this.moves = [];
        this.timer = 0;
        this.init();
    }

    init(): void {
        if (!this.ctx) return;
        for (let i = 0; i < this.numBars; i++) {
            const value = Math.floor(Math.random() * (this.maxBarValue)) + Math.floor(0.001 * this.diagLength);
            const bar = new Bar(i, value);
            this.displayedBars.push(bar);
            this.sortedBars.push(bar.clone());
        }

        DrawingUtils.clearCanvas(this.ctx, this.canvas);

        // Loop through the bars and render each one
        for (const bar of this.displayedBars) {
            this.renderBar(bar);
        }
        this.sort(); // Call the sorting algorithm at the end of init
    }

    renderBar(bar: Bar): void {
        if (!this.ctx) return;
        const x = bar.index * this.barWidth;
        const y = this.canvas.height;
        const width = this.barWidth;
        const height = - bar.value * this.valueToHeightRatio;

        this.ctx.fillStyle = this.getColorBasedOnDistance(bar.value, 0, this.maxBarValue);
        this.ctx.fillRect(x, y, width, height);
    }

    // Function to calculate the circle color based on this.r
    private getColorBasedOnDistance(height: number, minHeight: number, maxHeight: number): string {

        const colors = DrawingUtils.getColors();

        // Create an interpolation function for colors
        const interpolateRes = interpolateRgbBasisClosed(colors);

        // Interpolate the color based on radius
        const color = interpolateRes((height - minHeight) / (minHeight - maxHeight));

        return color;
    }

    sort(): void {
        if (this.algoName === 'Bubble') {
            this.bubbleSort();
        }
        else {
            this.fusionSort(0, this.sortedBars.length - 1);
            const toRmv: Set<Move> = new Set();
            for (let i = 1; i < this.moves.length; i ++) {
                const move = this.moves[i-1];
                const nextMove = this.moves[i];
                if (move.sourceIndex === nextMove.targetIndex && move.targetIndex === nextMove.sourceIndex) {
                    toRmv.add(nextMove);
                }
            }
            for (const nextMove of toRmv) {
                this.moves.splice(this.moves.indexOf(nextMove),1);
            }
        }
    }

    bubbleSort(): void {
        // Implement your sorting algorithm here (e.g., bubble sort)
        const n = this.sortedBars.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (this.sortedBars[j].value > this.sortedBars[j + 1].value) {

                    const movingBar = this.sortedBars[j];
                    const targetedBar = this.sortedBars[j + 1];

                    this.sortedBars[j + 1] = movingBar;

                    this.sortedBars[j] = targetedBar;

                    // Record the move
                    this.moves.push(new Move(j, j + 1));
                }
            }
        }
    }

    private fusionSort(left: number, right: number): void {
        if (left < right) {
            const mid = Math.floor(left + ((right - left) / 2));

            this.fusionSort(left, mid);
            this.fusionSort(mid + 1, right);

            this.merge(left, mid, right);
        }
    }

    // TODO re think to avoid all n to n comparisons.
    private merge(left: number, mid: number, right: number): void {
        const n1 = mid - left + 1;
        const n2 = right - mid;

        const leftArray: Bar[] = this.sortedBars.slice(left, left + n1);
        const rightArray: Bar[] = this.sortedBars.slice(mid + 1, mid + 1 + n2);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < n1 && j < n2) {
            let source: Bar;
            let target: Bar;
            if (leftArray[i].value <= rightArray[j].value) {
                source = leftArray[i];
                target = this.sortedBars[k];
                i++;
            } else {
                source = rightArray[j];
                target = this.sortedBars[k];
                j++;
            }
            this.sortedBars[source.index] = target;
            this.sortedBars[source.index].index = source.index;

            this.sortedBars[k] = source;
            this.sortedBars[k].index = k;

            this.moves.push(new Move(target.index, k));
            k++;
        }

        while (i < n1) {
            const source = leftArray[i];
            const target = this.sortedBars[k];

            this.sortedBars[source.index] = target;
            this.sortedBars[source.index].index = source.index;

            this.sortedBars[k] = source;
            this.sortedBars[k].index = k;

            this.moves.push(new Move(target.index, k));
            i++;
            k++;
        }

        while (j < n2) {
            const source = rightArray[j];
            const target = this.sortedBars[k];

            this.sortedBars[source.index] = target;
            this.sortedBars[source.index].index = source.index;

            this.sortedBars[k] = source;
            this.sortedBars[k].index = k;

            this.moves.push(new Move(target.index, k));
            j++;
            k++;
        }
    }

    do(): void {
        if (!this.ctx) return;

        DrawingUtils.clearCanvas(this.ctx, this.canvas);

        // Check if there are moves left to play
        if (this.timer < this.moves.length) {
            const move = this.moves[this.timer];
            // Swap the indices of the bars
            const movingBar = this.displayedBars[move.sourceIndex];
            const targetedBar = this.displayedBars[move.targetIndex];

            const tempIndex = movingBar.index;

            this.displayedBars[move.targetIndex] = movingBar;
            movingBar.index = move.targetIndex;

            this.displayedBars[tempIndex] = targetedBar;
            targetedBar.index = tempIndex;

            this.timer++;
        }

        // Loop through the bars and render each one
        for (const bar of this.displayedBars) {
            this.renderBar(bar);
        }
    }

    stop(): void {
        if (!this.ctx) return;
        this.stopLoop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateSettings(settings: any): void {
        this.algoName = settings;
        this.displayedBars = [];
        this.sortedBars = [];
        this.moves = [];
        this.timer = 0;
        this.init();
    }
}

class Bar {
    public index: number;
    public value: number;

    constructor(index: number, value: number) {
        this.index = index;
        this.value = value;
    }

    public clone(): Bar {
        return new Bar(this.index, this.value);
    }
}

class Move {
    constructor(public sourceIndex: number, public targetIndex: number) { }
}
