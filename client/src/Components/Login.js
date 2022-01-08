import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, InputGroup, Col, Row, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';
import axios from 'axios';

function Login() {
	const [ validated, setValidated ] = useState(false);
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ error, setError ] = useState({});
	const { user, setUser } = useContext(UserContext);

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		try {
			const userData = {
				username,
				password
			};

			const response = await axios.post('/api/auth/login', userData);
			setValidated(response.data.success);
			setUser(response.data);
			if (response) navigate('/');
		} catch (error) {
			setValidated(false);
			setError(error.response.data);
		}
	};
	return (
		<Row className="" style={{ height: '100vh' }}>
			<Nav className="justify-content-center" activeKey="/home">
				<Nav.Item className="m-3">
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
				<h1 className="text-light">Login</h1>
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Group controlId="validationCustomUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="text"
							placeholder="Username"
							aria-describedby="inputGroupPrepend"
							required
							onChange={(e) => setUsername(e.target.value)}
							isInvalid={
								(error.error && error.error.field === 'username') || (error.error && username === '')
							}
						/>
						{error.error && error.error.field === 'username' && username !== '' ? (
							<Form.Control.Feedback type="invalid">{error.error.message}</Form.Control.Feedback>
						) : null}
						{error.error && username === '' ? (
							<Form.Control.Feedback type="invalid">{error.error.message}</Form.Control.Feedback>
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
							isInvalid={
								(error.error && error.error.field === 'password') || (error.error && password === '')
							}
						/>
						{error.error && error.error.field === 'password' && password !== '' ? (
							<Form.Control.Feedback type="invalid">{error.error.message}</Form.Control.Feedback>
						) : null}
						{error.error && password === '' ? (
							<Form.Control.Feedback type="invalid">{error.error.message}</Form.Control.Feedback>
						) : null}
					</Form.Group>
					<Form.Group className="mt-4 text-center">
						<Button variant="primary" type="submit">
							Login
						</Button>{' '}
						<Link to="/register" className="btn btn-light">
							Register
						</Link>{' '}
					</Form.Group>
				</Form>
			</Col>
		</Row>
	);
}

export default Login;
