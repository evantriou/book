import { useRef } from 'react';
import { useState } from 'react';
import './App.css';
import Header from './Header';
import SimulationPopup from './../simulations/SimulationPopup';
import { SimuEngine } from './../simulations/SimuEngine';
import { Route, Routes } from 'react-router-dom';
import MainPage from './book/MainPage';
import Contact from './contact/Contact';

function App() {
	return (
		<div className="App">
			<Header />
			<main className="App-main">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/book" element={<MainPage />} />
					<Route path="/contact" element={<Contact />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
