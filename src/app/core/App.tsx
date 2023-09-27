import { useRef } from 'react';
import { useState } from 'react';
import './App.css';
import Header from './Header';
import SimulationPopup from './../simulations/SimulationPopup';
import { SimuEngine } from './../simulations/SimuEngine';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './mainPage';

function App() {

	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

	// Create a ref to hold the simulation engine instance
	const simuEngineRef = useRef<SimuEngine | null>(null);



	const closePopup = () => {
		setSelectedSimulation(null);
		setIsPopupVisible(false);
		// Stop the simulation when the pop-up is closed
		if (simuEngineRef.current) {
			simuEngineRef.current.stopLoop();
		}
	};

	return (
		<BrowserRouter>
			<div className="App">
				<Header />
				<main className="App-main">
					<Routes>
						<Route path="\#book">
							<MainPage/>
						</Route>
						<Route path="\#contact">
							<div>COUCOU</div>
						</Route>
					</Routes>
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
		</BrowserRouter>
	);
}

export default App;
