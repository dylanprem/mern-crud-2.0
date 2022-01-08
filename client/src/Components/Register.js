import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, InputGroup, Col, Row, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';
import axios from 'axios';

function Register() {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ error, setError ] = useState({});
	const { user, setUser } = useContext(UserContext);

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const userData = {
				username,
				password
			};

			const registerResponse = await axios.post('/api/auth/signup', userData);
			if (registerResponse.status === 200) {
				const loginResponse = await axios.post('/api/auth/login', userData);
				setUser(loginResponse.data);
				if (loginResponse) navigate('/');
			}
		} catch (error) {
			setError(error.response.data);
		}
	};
	return (
		<Row className="" style={{ height: '100vh' }}>
			<Nav className="justify-content-center" activeKey="/home">
				<Nav.Item>
					<Link to="/" className="text-light display-6">
						Home
					</Link>
				</Nav.Item>
				{user && user.authenticated ? (
					<Nav.Item className="m-3">
						<Link to="/pets" className="text-light display-6">
							My Pets
						</Link>
					</Nav.Item>
				) : null}
			</Nav>
			<Col md={{ span: '4', offset: 4 }}>
				<h1 className="text-light">Register</h1>
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group controlId="validationCustomUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="text"
							placeholder="Username"
							aria-describedby="inputGroupPrepend"
							required
							onChange={(e) => setUsername(e.target.value)}
							isInvalid={error.errors && error.errors.username}
						/>
						{error.errors && error.errors.username ? (
							<Form.Control.Feedback type="invalid">
								{error.errors.username.message}
							</Form.Control.Feedback>
						) : null}
					</Form.Group>
					<Form.Group controlId="validationCustomPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="password"
							aria-describedby="inputGroupPrepend"
							required
							onChange={(e) => setPassword(e.target.value)}
							isInvalid={error.errors && error.errors.password}
						/>
						{error.errors && error.errors.password ? (
							<Form.Control.Feedback type="invalid">
								{error.errors.password.message}
							</Form.Control.Feedback>
						) : null}
					</Form.Group>
					<Form.Group className="mt-4 text-center">
						<Button type="submit">Signup</Button>{' '}
					</Form.Group>
				</Form>
			</Col>
		</Row>
	);
}

export default Register;
