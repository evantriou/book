import { Button, ButtonGroup } from "react-bootstrap";
import { SimuEngine } from "./SimuEngine";

// Abstract Toolbar class
export abstract class Toolbar {
    protected simuEngine: SimuEngine;
    constructor(simuEngine: SimuEngine) {
        this.simuEngine = simuEngine;
    }
    public getToolbar(): JSX.Element {
        return (
            <ButtonGroup>
                <ButtonGroup style={{ marginRight: '2em' }}>
                    {this && this.getButtons()}
                </ButtonGroup>
                <ButtonGroup>
                    <Button className="ButtonPrimary" onClick={() => this.simuEngine.startLoop()}>Start</Button>
                    <Button variant="secondary" onClick={() => this.simuEngine.stopLoop()}>Stop</Button>        
                </ButtonGroup>
            </ButtonGroup>
        );
    }
    abstract getButtons(): JSX.Element;
}