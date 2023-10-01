import './App.css';
import Header from './Header';
import { Route, Routes } from 'react-router-dom';
import MainPage from './book/MainPage';
import Contact from './contact/Contact';

function App() {
	return (
		<div className="App">
			<Header />
			<main className="AppMain">
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
