import './App.css';
import { Container, Nav } from 'react-bootstrap';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './Components/Home';
import Cat from './Components/Cats';
import Login from './Components/Login';
import Register from './Components/Register';
import Pets from './Components/Pets';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './Contexts/UserContext';

function App() {
	const [ user, setUser ] = useState({});

	useEffect(() => {
		let done = false;

		const getUser = async () => {
			try {
				const response = await axios.get('/api/auth/getUser', { withCredentials: true });
				if (response) setUser(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		getUser();

		return () => (done = true);
	}, []);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Container className="App h-100">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/cats" element={<Cat />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/my-pets" element={<Pets />} />
					</Routes>
				</BrowserRouter>
			</Container>
		</UserContext.Provider>
	);
}

export default App;
