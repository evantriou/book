import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import { SimuEngine } from './SimuEngine';
import { Toolbar } from './Toolbar';
import { useRef } from "react";
import { SimuEngineBoids } from "./boids/SimuEngineBoids";
import { ToolbarBoids } from "./boids/ToolbarBoids";
import { SimuEngineDLA } from "./dla/SimuEngineDLA";
import { ToolbarDLA } from "./dla/ToolbarDLA";
import { SimuEngineFractal } from "./fractal/SimuEngineFractal";
import { ToolbarFractal } from "./fractal/ToolbarFractal";
import { SimuEngineGOL } from "./gol/SimuEngineGOL";
import { ToolbarGOL } from "./gol/ToolbarGOL";
import { SimuEnginePaths } from "./paths/SimuEnginePaths";
import { ToolbarPaths } from "./paths/ToolbarPaths";
import { SimuEnginePerlin } from "./perlin/SimuEnginePerlin";
import { ToolbarPerlin } from "./perlin/ToolbarPerlin";
import { SimuEngineSort } from "./sort/SimuEngineSort";
import { ToolbarSort } from "./sort/ToolbarSort";
import { SimuEngineTSP } from "./tsp/SimuEngineTSP";
import { ToolbarTSP } from "./tsp/ToolbarTSP";
import { ToolbarAnts } from './ants/ToolbarAnts';
import { SimuEngineAnts } from './ants/SimuEngineAnts';

interface SimulationPopupProps {
    selectedSimulation: string;
    closePopup: () => void
}

function SimulationPopup({ selectedSimulation, closePopup }: SimulationPopupProps) {

    const [simuEngine, setSimuEngine] = useState<SimuEngine | null>(null);
    const [simuToolbar, setSimuToolbar] = useState<Toolbar | null>(null);

    const close = () => {
        closePopup()
		// Stop the simulation when the pop-up is closed
		if (simuEngine) {
			simuEngine.stopLoop();
		}
	};

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
        const container: HTMLElement = document.getElementById("CanvasContainer")!;
        const diagLength = adaptCanvas(canvas, context, container);
        let newSimuEngine: SimuEngine;
        let newSimuToolbar: Toolbar;
    
        if (selectedSimulation === 'Boids Simulation') {
    
            newSimuEngine = new SimuEngineBoids(canvas, context, diagLength);
            newSimuToolbar = new ToolbarBoids(newSimuEngine);
    
        } else if (selectedSimulation === 'Sorting algorithms') {
    
            newSimuEngine = new SimuEngineSort(canvas, context, diagLength);
            newSimuToolbar = new ToolbarSort(newSimuEngine);
        }
        else if (selectedSimulation === 'Shortest Paths') {
    
            newSimuEngine = new SimuEnginePaths(canvas, context, diagLength);
            newSimuToolbar = new ToolbarPaths(newSimuEngine);
    
        }
        else if (selectedSimulation === 'TSP') {
    
            newSimuEngine = new SimuEngineTSP(canvas, context, diagLength);
            newSimuToolbar = new ToolbarTSP(newSimuEngine);
    
        }
        else if (selectedSimulation === "Conway's Game of Life") {
    
            newSimuEngine = new SimuEngineGOL(canvas, context, diagLength);
            newSimuToolbar = new ToolbarGOL(newSimuEngine);
    
        }
        else if (selectedSimulation === "Fractal Simulation") {
    
            newSimuEngine = new SimuEngineFractal(canvas, context, diagLength);
            newSimuToolbar = new ToolbarFractal(newSimuEngine);
    
        }
        else if (selectedSimulation === "Perlin Noise") {
    
            newSimuEngine = new SimuEnginePerlin(canvas, context, diagLength);
            newSimuToolbar = new ToolbarPerlin(newSimuEngine);
    
        }
        else if (selectedSimulation === "Blob Simulation") {
    
            newSimuEngine = new SimuEngineDLA(canvas, context, diagLength);
            newSimuToolbar = new ToolbarDLA(newSimuEngine);
    
        }
        else if (selectedSimulation === "Ant Colony Simulation") {
    
            newSimuEngine = new SimuEngineDLA(canvas, context, diagLength);
            newSimuToolbar = new ToolbarDLA(newSimuEngine);
    
        }
        else {
            newSimuEngine = new SimuEngineBoids(canvas, context, diagLength);
            newSimuToolbar = new ToolbarBoids(newSimuEngine);
        }
    
        setSimuEngine(newSimuEngine);
        setSimuToolbar(newSimuToolbar);

        return () => {
            newSimuEngine.stopLoop();
        }

    }, [selectedSimulation]);

    return (
        <Modal show={!!selectedSimulation} centered className="modal-xl">
            <Modal.Header closeButton onClick={close} style={{ backgroundColor: '#555', color: 'antiquewhite' }}>
                <Modal.Title>{selectedSimulation}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="CanvasContainer" style={{ backgroundColor: '#555', color: 'antiquewhite' }}>
                <canvas ref={canvasRef} style={{height: '100%', width: '100%', flex: '1', objectPosition: 'center'}}></canvas>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#555', color: 'antiquewhite' }}>
                {simuToolbar && simuToolbar.getToolbar()}
            </Modal.Footer>
        </Modal>
    );
}

function adaptCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasContainer: HTMLElement): number {

    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;

    canvas.width = containerWidth * devicePixelRatio;
    canvas.height = containerHeight * devicePixelRatio;

    const diag = Math.sqrt((canvas.height * canvas.height) + (canvas.width * canvas.width));

    return diag;
}

export default SimulationPopup;



