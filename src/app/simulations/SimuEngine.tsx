import { RefObject } from "react";

export abstract class SimuEngine {
    protected canvas: HTMLCanvasElement;
    protected canvasRef: RefObject<HTMLCanvasElement>;
    protected ctx: CanvasRenderingContext2D | null;
    protected loopId: any;
    protected loopOn: boolean = false;
    protected readonly FRAMERATE: number = 15;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasRef = canvasRef;
    }
    abstract start(): void;
    public startLoop(): void {
        if (!this.loopOn) {
            this.loopId = setInterval(() => this.do(), this.FRAMERATE);
            this.loopOn = true;
        }
    }
    abstract do(): void;
    abstract stop(): void;
    public stopLoop(): void {
        if (this.loopOn) {
            clearInterval(this.loopId);
            this.loopOn = false;
        }
    }
    abstract updateSettings(settings: any): void;
}