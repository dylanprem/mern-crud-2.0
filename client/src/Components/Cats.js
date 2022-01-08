import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Button, Card, ListGroup, Badge, ProgressBar, Modal, Nav, Form, Accordion } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';

function Cats() {
	const [ cat, setCat ] = useState({});
	const { user, setUser } = useContext(UserContext);
	const [ showCard, setShowCard ] = useState(false);
	const [ showModal, setShowModal ] = useState(false);
	const [ name, setName ] = useState('');
	const [ age, setAge ] = useState('');
	const [ errors, setErrors ] = useState({});
	const [ loadingError, setLoadingError ] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		let done = false;

		const getCat = async () => {
			setShowCard(false);

			try {
				const response = await axios.get('/api/cat/catApi/getCatImages');
				setCat(response.data[0]);
				setShowCard(true);
			} catch (error) {
				console.log(error);
			}
		};

		getCat();

		return () => (done = true);
	}, []);

	const onNextClick = async () => {
		setCat({});
		setShowCard(false);
		setLoadingError(false);
		try {
			const response = await axios.get('/api/cat/catApi/getCatImages');
			console.log(response.data && response.data[0].breeds.length);
			if (response.data && response.data[0].breeds.length) {
				setCat(response.data[0]);
				setShowCard(true);
			} else {
				setLoadingError(true);
			}
		} catch (error) {
			setErrors(error);
		}
	};

	const adoptCat = async () => {
		const formData = {
			name: name,
			age: age,
			info: cat,
			catId: cat.id,
			imageURL: cat.url,
			owner: user.user._id
		};

		try {
			const response = await axios.post('/api/cat/postCats', formData);
			if (response) {
				navigate('/my-pets');
			}
		} catch (error) {
			setErrors(error.response.data);
		}
	};

	return (
		<Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
			<Nav className="justify-content-center">
				<Nav.Item className="mx-3">
					<Link to="/" className="text-light display-6">
						Home
					</Link>
				</Nav.Item>
				{user && user.authenticated ? (
					<Nav.Item className="mx-3">
						<Link to="/my-pets" className="text-light display-6 ">
							My Pets
						</Link>
					</Nav.Item>
				) : null}
			</Nav>
			{loadingError ? (
				<Col className="text-center">
					<h1 className="text-light">Something went wrong. Please try again.</h1>
					<Button onClick={(e) => onNextClick()}>Retry</Button>
				</Col>
			) : (
				<Col md={6}>
					{showCard && cat && cat.breeds.length ? (
						<Card bg="light" text="dark" className="m-3">
							<Card.Body>
								<Col md={{ span: 6, offset: 3 }}>
									<img
										variant="top"
										src={cat.url}
										className="img-fluid rounded mx-auto d-block"
										style={{ height: '10%' }}
									/>
									<Card.Title className="text-center">
										<span>Breed: {cat.breeds[0].name}</span>
										<br />
										{user && user.authenticated ? null : (
											<small className="text-muted text-center">
												(Please login to adopt this cat)
											</small>
										)}
									</Card.Title>
								</Col>

								<small>
									{cat.breeds[0].temperament.toString().split(',').map((t, tIndex) => {
										return (
											<span key={tIndex}>
												<Badge bg="info">{t} </Badge> {' '}
											</span>
										);
									})}
								</small>
							</Card.Body>
							<Accordion>
								<Accordion.Item eventKey="0">
									<Accordion.Header>Stats</Accordion.Header>
									<Accordion.Body>
										<Card.Text>{cat ? <span>{cat.breeds[0].description}</span> : null}</Card.Text>
										<ListGroup variant="flush">
											<ListGroup.Item>
												<small>Adaptability</small>{' '}
												<ProgressBar
													animated
													variant={
														parseFloat(cat.breeds[0].adaptability) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].adaptability) * 20 === 20 ? (
															'danger'
														) : null
													}
													now={parseFloat(cat.breeds[0].adaptability) * 20}
													label={`${parseFloat(cat.breeds[0].adaptability) * 20}%`}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Child friendly</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].child_friendly) * 20}
													label={`${parseFloat(cat.breeds[0].child_friendly) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].child_friendly) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].child_friendly) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Dog friendly</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].dog_friendly) * 20}
													label={`${parseFloat(cat.breeds[0].dog_friendly) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].dog_friendly) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].dog_friendly) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Hypoallergenic</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].hypoallergenic) * 20}
													label={`${parseFloat(cat.breeds[0].hypoallergenic) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].hypoallergenic) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].hypoallergenic) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Affection level</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].affection_level) * 20}
													label={`${parseFloat(cat.breeds[0].affection_level) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].affection_level) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].affection_level) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Energy level</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].energy_level) * 20}
													label={`${parseFloat(cat.breeds[0].energy_level) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].energy_level) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].energy_level) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Grooming</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].grooming) * 20}
													label={`${parseFloat(cat.breeds[0].grooming) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].grooming) * 20 === 100 ? (
															'success'
														) : null || parseFloat(cat.breeds[0].grooming) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
											<ListGroup.Item>
												<small>Intelligence</small>{' '}
												<ProgressBar
													animated
													now={parseFloat(cat.breeds[0].intelligence) * 20}
													label={`${parseFloat(cat.breeds[0].intelligence) * 20}%`}
													variant={
														parseFloat(cat.breeds[0].intelligence) * 20 === 100 ? (
															'success'
														) : null ||
														parseFloat(cat.breeds[0].intelligence) * 20 === 20 ? (
															'danger'
														) : null
													}
												/>
											</ListGroup.Item>
										</ListGroup>
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>

							<Card.Body>
								{user.authenticated ? (
									<Button variant="dark" onClick={(e) => setShowModal(true)}>
										Adopt
									</Button>
								) : null}{' '}
								<Button onClick={onNextClick} variant="dark">
									Next
								</Button>
							</Card.Body>
						</Card>
					) : (
						<Col className="text-center">
							<h1 className="text-center text-light mb-3">Loading...</h1>
							<h2 className="text-light">Taking too long?</h2>
							<Button onClick={(e) => onNextClick()}>Retry</Button>
						</Col>
					)}
				</Col>
			)}

			<Modal
				show={showModal}
				onHide={(e) => setShowModal(false)}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Adopt this cat</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Cats name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Whiskers"
								onChange={(e) => setName(e.target.value)}
								isInvalid={errors && errors.errors && errors.errors.name}
							/>
							{errors && errors.errors && errors.errors.name ? (
								<Form.Control.Feedback type="invalid">
									{errors.errors.name.message}
								</Form.Control.Feedback>
							) : null}
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Age</Form.Label>
							<Form.Control
								type="text"
								placeholder="3"
								onChange={(e) => setAge(e.target.value)}
								isInvalid={errors && errors.errors && errors.errors.age}
							/>
							{errors && errors.errors && errors.errors.age ? (
								<Form.Control.Feedback type="invalid">
									{errors.errors.age.message}
								</Form.Control.Feedback>
							) : null}
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={(e) => setShowModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={(e) => adoptCat()}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</Row>
	);
}

export default Cats;
