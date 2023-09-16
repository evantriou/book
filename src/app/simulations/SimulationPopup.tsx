import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Modal, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import 'rc-slider/assets/index.css'; // Import the CSS for the slider
import { SimuEngine } from './SimuEngine';
import { SimuEngineBoids } from './boids/SimuEngineBoid';
import { Toolbar } from './Toolbar';
import { ToolbarBoids } from './boids/ToolbarBoids';
import { SimuEngineSort } from './sort/SimuEngineSort';
import { ToolbarSort } from './sort/ToolbarSort';
import { SimuEnginePaths as SimuEnginePaths } from './paths/SimuEnginePaths';
import { ToolbarPaths } from './paths/ToolbarPaths';
import { SimuEngineTSP } from './tsp/SimuEngineTSP';
import { ToolbarTSP } from './tsp/ToolbarTSP';
import { SimuEngineGOL } from './gol/SimuEngineGOL';
import { ToolbarGOL } from './gol/ToolbarGOL';

interface SimulationPopupProps {
    selectedSimulation: string | null;
    onClose: () => void;
    simuEngineRef:  RefObject<SimuEngine | null>;
}

// Define types for state variables
type SimulationCanvasType = SimuEngine | null;
type ToolbarType = Toolbar | null;

function SimulationPopup({ selectedSimulation, onClose, simuEngineRef }: SimulationPopupProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Define a local state to hold the simulation canvas and toolbar instances
    const [simulationCanvas, setSimulationCanvas] = useState<SimulationCanvasType | null>(null);
    const [toolbar, setToolbar] = useState<ToolbarType | null>(null);

    useEffect(() => {

        const canvas = canvasRef.current;
        const canvasContainer = document.getElementById("CanvasContainer");

        if (!canvas) return;

        if (canvasContainer) {
            // Calculate the canvas dimensions based on the parent's dimensions
            const containerWidth = canvasContainer.clientWidth;
            const containerHeight = canvasContainer.clientHeight;

            canvas.style.width = "100%";
            canvas.style.height = "100%";

            // Set the canvas dimensions to fit the container while maintaining the aspect ratio
            const aspectRatio = canvas.width / canvas.height;
            if (containerWidth / aspectRatio <= containerHeight) {
                // Fit based on width
                canvas.width = containerWidth;
                canvas.height = containerWidth / aspectRatio;
            } else {
                // Fit based on height
                canvas.height = containerHeight;
                canvas.width = containerHeight * aspectRatio;
            }
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let newSimulationCanvas: SimuEngine;

        if (selectedSimulation === 'Boids Simulation') {
            // Create an instance of the Boids simulation canvas class
            newSimulationCanvas = new SimuEngineBoids(canvas, ctx, canvasRef);
            // Create an instance of the Boids simulation toolbar class
            setToolbar(new ToolbarBoids(newSimulationCanvas));
        } else if (selectedSimulation === 'Sorting algorithms') {
            // Create an instance of the Paths simulation canvas class
            newSimulationCanvas = new SimuEngineSort(canvas, ctx, canvasRef);
            // Create an instance of the Paths simulation toolbar class
            setToolbar(new ToolbarSort(newSimulationCanvas));
        }
        else if (selectedSimulation === 'Shortest Paths') {
            // Create an instance of the Paths simulation canvas class
            newSimulationCanvas = new SimuEnginePaths(canvas, ctx, canvasRef);
            // Create an instance of the Paths simulation toolbar class
            setToolbar(new ToolbarPaths(newSimulationCanvas));
        }
        else if (selectedSimulation === 'TSP') {
            // Create an instance of the TSP simulation canvas class
            newSimulationCanvas = new SimuEngineTSP(canvas, ctx, canvasRef);
            // Create an instance of the TSP simulation toolbar class
            setToolbar(new ToolbarTSP(newSimulationCanvas));
        }
        else if (selectedSimulation === "Conway's Game of Life") {
            // Create an instance of the TSP simulation canvas class
            newSimulationCanvas = new SimuEngineGOL(canvas, ctx, canvasRef);
            // Create an instance of the TSP simulation toolbar class
            setToolbar(new ToolbarGOL(newSimulationCanvas));
        }
        else{
            newSimulationCanvas = new SimuEngineTSP(canvas, ctx, canvasRef);
        }
        // Add more simulation logic here for other types

        // Set the local simulation canvas object
        setSimulationCanvas(newSimulationCanvas);

        return () => {
            // Clean up the simulation when the popup is closed
            if (newSimulationCanvas) {
                // Dispose of resources, stop ongoing processes, etc.
                newSimulationCanvas.stop();
            }
        };
    }, [selectedSimulation, simuEngineRef]);

    return (
        <Modal show={!!selectedSimulation} centered className="modal-xl">
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>{selectedSimulation}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="CanvasContainer">
                {/* Render the simulation canvas */}
                <canvas ref={canvasRef} style={{flex: '1', objectPosition: 'center'}} ></canvas>
            </Modal.Body>
            <Modal.Footer>
                {/* Render the toolbar */}
                {toolbar && toolbar.getToolbar()}
            </Modal.Footer>
        </Modal>
    );
}

export default SimulationPopup;



