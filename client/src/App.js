import './App.css';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Cat from './Components/Cats';

function App() {
	return (
		<Container className="App h-100">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/cats" element={<Cat />} />
			</Routes>
		</Container>
	);
}

export default App;
