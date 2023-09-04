import React from 'react';
import { useState } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { TabCardProps } from './TabCard';
import TabCard from './TabCard'; // Import the TabCard component
import Header from './Header';
import SimulationPopup from './simulations/SimulationPopup';
function App() {

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  const handleTryClick = (tabName: string) => {
    setSelectedSimulation(tabName);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setSelectedSimulation(null);
    setIsPopupVisible(false);
  };

  const tabsProps: TabCardProps[] = [
    {
      tabName: "Boids Simulation",
      description: "Simulates birds flight or fishes moves in 2D Canvas.",
      onTryClick: () => handleTryClick("Boids Simulation")
    },
    {
      tabName: "Sorting algorithms",
      description: "Different sorting algorithms visualization 2D Canvas.",
      onTryClick: () => handleTryClick("Sorting algorithms")
    },
    {
      tabName: "Shortest Paths",
      description: "Simulates different shortest paths algorithms in 2D Canvas.",
      onTryClick: () => handleTryClick("Shortest Paths")
    },
    {
      tabName: "TSP",
      description: "Travelling salesman problem simulation in 2D Canvas.",
      onTryClick: () => handleTryClick("TSP")
    }
  ];
  return (
    <div className="App">
      <Header/>
      <main className="App-main">
        <Container>
          <Row  xs={1} md={4}>
            {tabsProps.map((tab, index) => (
              <Col key={index}>
                <TabCard 
                tabName={tab.tabName} 
                description={tab.description}
                onTryClick={() => handleTryClick(tab.tabName)}
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
          />
        )}
    </div>
  );
}

export default App;
