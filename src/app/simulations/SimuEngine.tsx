import { RefObject } from "react";

export abstract class SimuEngine {
    protected canvas: HTMLCanvasElement;
    protected canvasRef: RefObject<HTMLCanvasElement>;
    protected ctx: CanvasRenderingContext2D | null;
    protected loopId: any;
    protected loopOn: boolean = false;
    protected readonly FRAMERATE: number = 20;
    protected readonly aspectRatio;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRef: RefObject<HTMLCanvasElement>, aspectRatio: number) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasRef = canvasRef;
        this.aspectRatio = aspectRatio;
    }

    public startLoop(): void {
        if (!this.loopOn) {
            this.loopId = setInterval(() => this.do(), this.FRAMERATE);
            this.loopOn = true;
        }
    }
    abstract do(): void;
    public stopLoop(): void {
        if (this.loopOn) {
            clearInterval(this.loopId);
            this.loopOn = false;
        }
    }
    abstract updateSettings(settings: any): void;
}