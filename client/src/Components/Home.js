import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';

function Home() {
	return (
		<Row className="" style={{ height: '100vh' }} id="home-row">
			<Col md={8} className="p-5">
				<h1 className="display-3 text-light">Adopt a (virtual) Cat</h1>
				<div className="">
					<Link to="/cats" className="btn btn-secondary">
						Browse cats
					</Link>{' '}
					<Button variant="light">Login</Button>
				</div>
			</Col>
		</Row>
	);
}

export default Home;
