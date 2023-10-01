import { Col, Container, Row } from "react-bootstrap";
import TabCard, { TabCardProps } from "./TabCard";
import { useRef, useState } from "react";
import boidsImg from './../../pictures/boids.png'; // relative path to image
import sortImg from './../../pictures/sort.png'; // relative path to image
import pathImg from './../../pictures/path.png'; // relative path to image
import tspImg from './../../pictures/tsp.png'; // relative path to image
import golImg from './../../pictures/gol.png'; // relative path to image
import fractalImg from './../../pictures/fractal.png'; // relative path to image
import perlinImg from './../../pictures/perlin.png'; // relative path to image
import blobImg from './../../pictures/blob.png'; // relative path to image
import { SimuEngine } from "../../simulations/SimuEngine";
import SimulationPopup from "../../simulations/SimulationPopup";

function MainPage() {
	
    const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
	
    const handleTryClick = (tabName: string) => {
		setSelectedSimulation(tabName);
		setIsPopupVisible(true);
	};

	const closePopup = () => {
		setIsPopupVisible(false);
	}

    const tabsProps: TabCardProps[] = [
		{
			tabName: "Boids Simulation",
			description: "Simulates birds flight or fishes moves in 2D Canvas.",
			onTryClick: () => handleTryClick("Boids Simulation"),
			pathImg: boidsImg
		},
		{
			tabName: "Sorting algorithms",
			description: "Different sorting algorithms visualization 2D Canvas.",
			onTryClick: () => handleTryClick("Sorting algorithms"),
			pathImg: sortImg
		},
		{
			tabName: "Shortest Paths",
			description: "Simulates different shortest paths algorithms in 2D Canvas.",
			onTryClick: () => handleTryClick("Shortest Paths"),
			pathImg: pathImg
		},
		{
			tabName: "TSP",
			description: "Travelling salesman problem simulation in 2D Canvas.",
			onTryClick: () => handleTryClick("TSP"),
			pathImg: tspImg
		},
		{
			tabName: "Conway's Game of Life",
			description: "Simulation of Conway's Game of Life in 2D canvas.",
			onTryClick: () => handleTryClick("Conway's Game of Life"),
			pathImg: golImg
		},
		{
			tabName: "Fractal Simulation",
			description: "Sierpinsky triangle simulation in 2D canvas.",
			onTryClick: () => handleTryClick("Fractal Simulation"),
			pathImg: fractalImg
		},
		{
			tabName: "Perlin Noise",
			description: "Perlin noise flat simulation in 2D canvas (work in progress).",
			onTryClick: () => handleTryClick("Terrain generation"),
			pathImg: perlinImg
		},
		{
			tabName: "Blob Simulation",
			description: "Diffusion-Limited Aggregation in 2D canvas.",
			onTryClick: () => handleTryClick("Fractal Simulation"),
			pathImg: blobImg
		}
	];

    return (
		<Container>
			<Row xs={1} md={4}>
				{tabsProps.map((tab, index) => (
					<Col key={index} style={{ margin: '1rem 0' }}>
						<TabCard
							tabName={tab.tabName}
							description={tab.description}
							onTryClick={() => handleTryClick(tab.tabName)}
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