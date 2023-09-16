import React, { useRef } from 'react';
import { useState } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { TabCardProps } from './TabCard';
import TabCard from './TabCard'; // Import the TabCard component
import Header from './Header';
import SimulationPopup from './simulations/SimulationPopup';
import boidsImg from './boids.png'; // relative path to image
import sortImg from './sort.png'; // relative path to image
import pathImg from './path.png'; // relative path to image
import tspImg from './tsp.png'; // relative path to image
import golImg from './gol.png'; // relative path to image
import { SimuEngine } from './simulations/SimuEngine';


function App() {

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  // Create a ref to hold the simulation engine instance
  const simuEngineRef = useRef<SimuEngine | null>(null);

  const handleTryClick = (tabName: string) => {
    setSelectedSimulation(tabName);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setSelectedSimulation(null);
    setIsPopupVisible(false);
    // Stop the simulation when the pop-up is closed
    if (simuEngineRef.current) {
      simuEngineRef.current.stopLoop();
    }
  };

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
      description: "Simulation of Conway's Game of Life.",
      onTryClick: () => handleTryClick("Conway's Game of Life"),
      pathImg: golImg
    },
  ];
  return (
    <div className="App">
      <Header/>
      <main className="App-main">
        <Container>
          <Row  xs={1} md={4}>
            {tabsProps.map((tab, index) => (
              <Col key={index}  style={{ margin: '1rem 0' }}>
                <TabCard 
                tabName={tab.tabName} 
                description={tab.description}
                onTryClick={() => handleTryClick(tab.tabName)}
                pathImg = {tab.pathImg}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
        {/* Render the pop-up conditionally */}
        {isPopupVisible && (
          <SimulationPopup
            onClose={closePopup}
            selectedSimulation={selectedSimulation}
            simuEngineRef={simuEngineRef}
          />
        )}
    </div>
  );
}

export default App;
