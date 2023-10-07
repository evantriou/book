import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Toolbar } from "../Toolbar";
import { ButtonGroup } from "react-bootstrap";
import { SimuEngine } from '../SimuEngine';

export class ToolbarBoids extends Toolbar {

    private userCoefs: {mass:number, separation:number, alignement:number};

    constructor(simuEngine: SimuEngine) {
        super(simuEngine)
        this.userCoefs = {mass:1, separation:1, alignement:1};
    }

    getButtons(): JSX.Element {
        return (
            <ButtonGroup style={{width:'100%', justifyContent:'space-between'}}>
                <Slider style={{margin:'0.5rem'}} marks={{1.00 : <div style={{color:'antiquewhite'}}>MASS</div>}} min={0.0} max={2.0} step={0.01} defaultValue={this.userCoefs.mass} onChange={(evt)=>{this.exportToEngineMass(evt)}}></Slider>
                <Slider style={{margin:'0.5rem'}} marks={{1.00 : <div style={{color:'antiquewhite'}}>ALIGN</div>}} min={0.0} max={2.0} step={0.01} defaultValue={this.userCoefs.alignement} onChange={(evt)=>{this.exportToEngineAlign(evt)}}></Slider>
                <Slider style={{margin:'0.5rem'}} marks={{1.00 : <div style={{color:'antiquewhite'}}>SEPARATION</div>}} min={0.0} max={2.0} step={0.01} defaultValue={this.userCoefs.separation} onChange={(evt)=>{this.exportToEngineSep(evt)}}></Slider>
            </ButtonGroup>
        );
    }

    exportToEngineMass(val: number | number[]): void {
        if (typeof val === 'number') {
            this.userCoefs.mass = val;
            this.simuEngine.updateSettings(this.userCoefs);      
        }
    }
    exportToEngineAlign(val: number | number[]): void {
        if (typeof val === 'number') {
            this.userCoefs.alignement = val;
            this.simuEngine.updateSettings(this.userCoefs);      
        }
    }
    exportToEngineSep(val: number | number[]): void {
        if (typeof val === 'number') {
            this.userCoefs.separation = val;
            this.simuEngine.updateSettings(this.userCoefs);      
        }
    }
}