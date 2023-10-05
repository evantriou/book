import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'rc-slider/assets/index.css'; // Import the CSS for the slider
import { SimuEngine } from './SimuEngine';
import { Toolbar } from './Toolbar';
import { SimuEngineSort } from './sort/SimuEngineSort';
import { ToolbarSort } from './sort/ToolbarSort';
import { SimuEnginePaths } from './paths/SimuEnginePaths';
import { ToolbarPaths } from './paths/ToolbarPaths';
import { SimuEngineTSP } from './tsp/SimuEngineTSP';
import { ToolbarTSP } from './tsp/ToolbarTSP';
import { SimuEngineGOL } from './gol/SimuEngineGOL';
import { ToolbarGOL } from './gol/ToolbarGOL';
import { SimuEngineFractal } from './fractal/SimuEngineFractal';
import { ToolbarFractal } from './fractal/ToolbarFractal';
import { SimuEnginePerlin } from './perlin/SimuEnginePerlin';
import { ToolbarPerlin } from './perlin/ToolbarPerlin';
import { SimuEngineDLA } from './dla/SimuEngineDLA';
import { ToolbarDLA } from './dla/ToolbarDLA';
import { ToolbarBoids } from './boids/ToolbarBoids';
import { SimuEngineBoids } from './boids/SimuEngineBoids';

interface SimulationPopupProps {
    selectedSimulation: string | null;
    closePopup: () => void
}


type SimulationCanvasType = SimuEngine | null;
type ToolbarType = Toolbar | null;

function SimulationPopup({ selectedSimulation, closePopup }: SimulationPopupProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [simulationCanvas, setSimulationCanvas] = useState<SimulationCanvasType | null>(null);
    const [toolbar, setToolbar] = useState<ToolbarType | null>(null);

    	
	const close = () => {
        closePopup()
		setSimulationCanvas(null);
		// Stop the simulation when the pop-up is closed
		if (simulationCanvas) {
			simulationCanvas.stopLoop();
		}
	};

    useEffect(() => {

        const canvas = canvasRef.current;
        const canvasContainer = document.getElementById("CanvasContainer");
        if (!canvas) return;
        if (!canvasContainer) return;

        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        adaptCanvas(canvas, canvasContainer, ctx);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let newSimulationCanvas: SimuEngine;

        if (selectedSimulation === 'Boids Simulation') {

            newSimulationCanvas = new SimuEngineBoids(canvas, ctx, canvasRef);
            setToolbar(new ToolbarBoids(newSimulationCanvas));

        } else if (selectedSimulation === 'Sorting algorithms') {

            newSimulationCanvas = new SimuEngineSort(canvas, ctx, canvasRef);
            setToolbar(new ToolbarSort(newSimulationCanvas));

        }
        else if (selectedSimulation === 'Shortest Paths') {

            newSimulationCanvas = new SimuEnginePaths(canvas, ctx, canvasRef);
            setToolbar(new ToolbarPaths(newSimulationCanvas));

        }
        else if (selectedSimulation === 'TSP') {

            newSimulationCanvas = new SimuEngineTSP(canvas, ctx, canvasRef);
            setToolbar(new ToolbarTSP(newSimulationCanvas));

        }
        else if (selectedSimulation === "Conway's Game of Life") {

            newSimulationCanvas = new SimuEngineGOL(canvas, ctx, canvasRef);
            setToolbar(new ToolbarGOL(newSimulationCanvas));

        }
        else if (selectedSimulation === "Fractal Simulation") {

            newSimulationCanvas = new SimuEngineFractal(canvas, ctx, canvasRef);
            setToolbar(new ToolbarFractal(newSimulationCanvas));

        }
        else if (selectedSimulation === "Perlin Noise") {

            newSimulationCanvas = new SimuEnginePerlin(canvas, ctx, canvasRef);
            setToolbar(new ToolbarPerlin(newSimulationCanvas));

        }
        else if (selectedSimulation === "Blob Simulation") {

            newSimulationCanvas = new SimuEngineDLA(canvas, ctx, canvasRef);
            setToolbar(new ToolbarDLA(newSimulationCanvas));

        }
        else {
            // Should never happen.
            newSimulationCanvas = new SimuEngineTSP(canvas, ctx, canvasRef);
        }

        // Set the local simulation canvas object
        setSimulationCanvas(newSimulationCanvas);

        return () => {};
    }, [selectedSimulation]);

    return (
        <Modal show={!!selectedSimulation} centered className="modal-xl">
            <Modal.Header closeButton onClick={close} style={{backgroundColor:'#555', color:'antiquewhite'}}>
                <Modal.Title>{selectedSimulation}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="CanvasContainer" style={{backgroundColor:'#555', color:'antiquewhite'}}>
                <canvas ref={canvasRef} style={{flex: '1', objectPosition: 'center'}}></canvas>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:'#555', color:'antiquewhite'}}>
                {toolbar && toolbar.getToolbar()}
            </Modal.Footer>
        </Modal>
    );
}

function adaptCanvas(canvas: HTMLCanvasElement, canvasContainer: HTMLElement, ctx: CanvasRenderingContext2D): void {

    // const initialCanvasWidth: number = canvas.width;
    // const initialCanvasHeight: number = canvas.height;

    // const aspectRatio = initialCanvasWidth / initialCanvasHeight;

    // const containerWidth = canvasContainer.clientWidth;
    // const containerHeight = canvasContainer.clientHeight;

    // let newWidth: number = 0;
    // let newHeight: number = 0;

    // if (containerWidth / aspectRatio <= containerHeight) {
    //     // Fit based on width
    //     newWidth = containerWidth;
    //     newHeight = containerWidth / aspectRatio;
    // } else {
    //     // Fit based on height
    //     newHeight = containerHeight;
    //     newWidth = containerHeight * aspectRatio;
    // }

    // canvas.style.width = newWidth+"px";
    // canvas.style.height = newHeight+"px";

    // const scalingFactorWidth: number = newWidth / initialCanvasWidth;
    // const scalingFactorHeight: number = newHeight / initialCanvasHeight;

    // ctx.scale(scalingFactorWidth, scalingFactorHeight);


    // Calculate the canvas dimensions based on the parent's dimensions
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;

    console.log("canvas.clientWidth ", canvas.clientWidth)
    console.log("canvas.clientHeight ", canvas.clientHeight)

    const initialCanvasWidth: number = canvas.clientWidth;
    const initialCanvasHeight: number = canvas.clientHeight;

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    let newWidth: number = canvas.clientWidth;
    let newHeight: number = canvas.clientHeight;

    console.log("canvas.clientWidth ", canvas.clientWidth)
    console.log("canvas.clientHeight ", canvas.clientHeight)

    const aspectRatio = newWidth / newHeight;
    if (newWidth / aspectRatio <= newHeight) {
        // Fit based on width
        newWidth = newWidth;
        newHeight = newWidth / aspectRatio;
    } else {
        // Fit based on height
        newHeight = newHeight;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    const scalingFactorWidth: number = newWidth / initialCanvasWidth;
    const scalingFactorHeight: number = newHeight / initialCanvasHeight;

    ctx.scale(scalingFactorWidth, scalingFactorHeight);


    // console.log("canvas.style.width ",  canvas.style.width)
    // console.log(" canvas.style.height ",  canvas.style.height)


    // // Set the canvas dimensions to fit the container while maintaining the aspect ratio
    // const aspectRatio = canvas.width / canvas.height;
    // if (containerWidth / aspectRatio <= containerHeight) {
    //     // Fit based on width
    //     canvas.width = containerWidth;
    //     canvas.height = containerWidth / aspectRatio;
    // } else {
    //     // Fit based on height
    //     canvas.height = containerHeight;
    //     canvas.width = containerHeight * aspectRatio;
    // }

    // canvas.width = canvas.width * window.devicePixelRatio;
    // canvas.height = canvas.height * window.devicePixelRatio;

    // // Normalize coordinate system to use css pixels.
    // ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // console.log("canvas real w ", canvas.width)
    // console.log("canvas real h ", canvas.height)

    return;
}

export default SimulationPopup;



