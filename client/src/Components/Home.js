import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../Contexts/UserContext';

function Home() {
	const { user, setUser } = useContext(UserContext);
	const logout = async () => {
		try {
			await axios.post('/api/auth/logout');
			setUser({});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Row className="" style={{ height: '100vh' }} id="home-row">
			<Col md={8} className="p-5">
				<h1 className="display-3 text-light">Adopt a (virtual) Cat</h1>
				<div className="">
					<Link to="/cats" className="btn btn-secondary">
						Browse cats
					</Link>{' '}
					{user && user.authenticated ? (
						<Link to="/my-pets" className="btn btn-light">
							My pets
						</Link>
					) : null}{' '}
					{user && user.authenticated ? (
						<Button className="btn-danger" onClick={logout}>
							Logout
						</Button>
					) : (
						<Link to="/login" className="btn btn-light">
							Login
						</Link>
					)}{' '}
				</div>
			</Col>
		</Row>
	);
}

export default Home;
