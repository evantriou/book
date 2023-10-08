import { SimuEngine } from "../SimuEngine";
import { Toolbar } from "../Toolbar";
import { ButtonGroup } from "react-bootstrap";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Toolbar for Boids Simulation
export class ToolbarPaths extends Toolbar {
    private userCoef: number;

    constructor(simuEngine: SimuEngine) {
        super(simuEngine)
        this.userCoef = 1;
    }

    getButtons(): JSX.Element {
        return (
            <ButtonGroup style={{width:'100%', justifyContent:'space-between'}}>
                <Slider style={{margin:'0.5rem'}} marks={{0.00 : <div style={{color:'antiquewhite', marginLeft:'0.5rem'}}>DIJKSTRA</div>, 1.00 : <div style={{color:'antiquewhite', marginRight:'0.5rem'}}>ASTAR</div>}} min={0.0} max={1.0} step={0.01} defaultValue={this.userCoef} onChange={(evt)=>{this.exportToEngine(evt)}}></Slider>
            </ButtonGroup>
        );
    }

    exportToEngine(val: number | number[]): void {
        if (typeof val === 'number') {
            this.userCoef = val;
            this.simuEngine.updateSettings(this.userCoef);      
        }
    }
}