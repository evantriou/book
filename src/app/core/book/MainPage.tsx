import { Col, Container, Row } from "react-bootstrap";
import TabCard, { TabCardProps } from "./TabCard";
import { useState } from "react";
import boidsImg from './../../pictures/boids.png';
import sortImg from './../../pictures/sort.png';
import pathImg from './../../pictures/path.png';
import tspImg from './../../pictures/tsp.png';
import golImg from './../../pictures/gol.png';
import fractalImg from './../../pictures/fractal.png';
import perlinImg from './../../pictures/perlin.png';
import blobImg from './../../pictures/blob.png';
import SimulationPopup from "../../simulations/SimulationPopup";

function MainPage() {
	
    const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedSimulation, setSelectedSimulation] = useState<string>("");
	
    const handleTryClick = (tabName: string) => {
		setSelectedSimulation(tabName);
		setIsPopupVisible(true);
	};

    const tabsProps: TabCardProps[] = [
		{
			tabName: "Boids Simulation",
			description: "Simulates birds flight or fishes moves in 2D Canvas.",
			handleTryClick: () => handleTryClick("Boids Simulation"),
			pathImg: boidsImg
		},
		{
			tabName: "Sorting algorithms",
			description: "Different sorting algorithms visualization 2D Canvas.",
			handleTryClick: () => handleTryClick("Sorting algorithms"),
			pathImg: sortImg
		},
		{
			tabName: "Shortest Paths",
			description: "Simulates different shortest paths algorithms in 2D Canvas.",
			handleTryClick: () => handleTryClick("Shortest Paths"),
			pathImg: pathImg
		},
		{
			tabName: "TSP",
			description: "Travelling salesman problem simulation in 2D Canvas.",
			handleTryClick: () => handleTryClick("TSP"),
			pathImg: tspImg
		},
		{
			tabName: "Conway's Game of Life",
			description: "Simulation of Conway's Game of Life in 2D canvas.",
			handleTryClick: () => handleTryClick("Conway's Game of Life"),
			pathImg: golImg
		},
		{
			tabName: "Fractal Simulation",
			description: "Sierpinsky triangle simulation in 2D canvas.",
			handleTryClick: () => handleTryClick("Fractal Simulation"),
			pathImg: fractalImg
		},
		{
			tabName: "Perlin Noise",
			description: "Perlin noise flat simulation in 2D canvas (work in progress).",
			handleTryClick: () => handleTryClick("Terrain generation"),
			pathImg: perlinImg
		},
		{
			tabName: "Blob Simulation",
			description: "Diffusion-Limited Aggregation in 2D canvas.",
			handleTryClick: () => handleTryClick("Fractal Simulation"),
			pathImg: blobImg
		},
		{
			tabName: "Fluid Simulation",
			description: "Comming soon.",
			handleTryClick: () => handleTryClick("Fluid Simulation"),
			pathImg: blobImg
		},
		{
			tabName: "Ant Colony Simulation",
			description: "Comming soon.",
			handleTryClick: () => handleTryClick("Ant colony Simulation"),
			pathImg: blobImg
		}
	];

	const closePopup = () => {
		setIsPopupVisible(false);
	}

    return (
		<Container>
			<Row xs={1} md={4}>
				{tabsProps.map((tab, index) => (
					<Col key={index} style={{ margin: '1rem 0' }}>
						<TabCard
							tabName={tab.tabName}
							description={tab.description}
							handleTryClick={() => handleTryClick(tab.tabName)}
							pathImg={tab.pathImg}
						/>
					</Col>
				))}
			</Row>
			{isPopupVisible && (
				<SimulationPopup
					selectedSimulation={selectedSimulation}
					closePopup={closePopup}
				/>
			)}
		</Container>
    );
}

export default MainPage;