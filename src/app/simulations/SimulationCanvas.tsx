import React, { useEffect, useRef, useState } from "react";
import { SimuEngine } from "./SimuEngine";
import { Toolbar } from "./Toolbar";
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

export interface CanvasProps {
    selectedSimulation: string;
    getSimuEngineCallBack: (childEngine: SimuEngine) => void
    getSimuToolbarCallBack: (childToolbar: Toolbar) => void
}

function SimulationCanvas(canvasProps: CanvasProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const selectedSimulation: string = canvasProps.selectedSimulation;
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
        const container: HTMLElement = document.getElementById("CanvasContainer")!;
        const diagLength = adaptCanvas(canvas, container);
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
        else {
            newSimuEngine = new SimuEngineBoids(canvas, context, diagLength);
            newSimuToolbar = new ToolbarBoids(newSimuEngine);
        }
    
        canvasProps.getSimuEngineCallBack(newSimuEngine);
        canvasProps.getSimuToolbarCallBack(newSimuToolbar);

        return () => {};
    }, []);

    // style={{ flex: '1', objectPosition: 'center' }}
    return (
        <>
            <canvas ref={canvasRef} style={{flex: '1', objectPosition: 'center'}}></canvas>
        </>
    );
}

function adaptCanvas(canvas: HTMLCanvasElement, canvasContainer: HTMLElement): number {

    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;

    canvas.style.width = "100%";
    canvas.style.height = "100%";

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

    const diag = Math.sqrt((canvas.height * canvas.height) + (canvas.width * canvas.width));

    return diag;
}
export default SimulationCanvas;
