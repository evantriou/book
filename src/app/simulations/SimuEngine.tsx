export abstract class SimuEngine {
    
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected loopId: any;
    protected loopOn: boolean = false;
    protected FRAMERATE: number = 20;
    protected readonly diagLength: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, diagLength: number) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.diagLength = diagLength;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
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