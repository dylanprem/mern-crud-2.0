import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge, ListGroup, ProgressBar, Nav, Accordion, Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../Contexts/UserContext';
import moment from 'moment';

function Pets() {
	const [ pets, setPets ] = useState([]);
	const { user, setUser } = useContext(UserContext);
	const [ affection, setAffection ] = useState(0);
	const [ showModal, setShowModal ] = useState(false);
	const [ showDeleteModal, setShowDeleteModal ] = useState(false);
	const [ name, setName ] = useState('');
	const [ age, setAge ] = useState('');
	const [ editingCat, setEditingCat ] = useState({});
	const [ deletingCat, setDeletingCat ] = useState({});
	const [ deleting, setDeleting ] = useState(false);
	const [ deletingProgress, setDeletingProgress ] = useState(0);
	const [ errors, setErrors ] = useState({});

	useEffect(() => {
		let done = false;

		getPets();

		return () => (done = true);
	}, []);

	const getPets = async () => {
		try {
			const response = await axios.get('/api/cat/getCats');

			if (response) {
				setPets(response.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const generateRandom = (min, max) => {
		var num = Math.floor(Math.random() * (max - min + 1)) + min;
		return num;
	};

	const checkIfHungry = (lastFed) => {
		const now = moment();
		return now.diff(moment(lastFed), 'hours') > 8;
	};

	const checkIfCatWantsToPlay = (val) => {
		const now = moment();
		return now.diff(moment(val), 'minutes') > generateRandom(15, 20);
	};

	const checkIfCatWantsToBePet = (val) => {
		const now = moment();
		return now.diff(moment(val), 'minutes') > generateRandom(15, 20);
	};

	const feedCat = async (id, affection) => {
		try {
			animateCSS('#cat-' + id, 'bounce');
			const cat = {
				affection: affection === 100 ? affection : affection + 5
			};
			const response = await axios.post(`/api/cat/feedCat/${id}`, cat);
			if (response) {
				await getPets();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const playWithCat = async (id, affection) => {
		try {
			animateCSS('#cat-' + id, 'bounce');
			const cat = {
				affection: affection === 100 ? affection : affection + 1
			};
			const response = await axios.post(`/api/cat/playWithCat/${id}`, cat);
			if (response) {
				await getPets();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const petCat = async (id, affection) => {
		try {
			animateCSS('#cat-' + id, 'bounce');
			const cat = {
				affection: affection === 100 ? affection : affection + 1
			};
			const response = await axios.post(`/api/cat/petCat/${id}`, cat);
			if (response) {
				await getPets();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const animateCSS = (element, animation, prefix = 'animate__') =>
		// We create a Promise and return it
		new Promise((resolve, reject) => {
			const animationName = `${prefix}${animation}`;
			const node = document.querySelector(element);

			node.classList.add(`${prefix}animated`, animationName);

			// When the animation ends, we clean the classes and resolve the Promise
			function handleAnimationEnd(event) {
				event.stopPropagation();
				node.classList.remove(`${prefix}animated`, animationName);
				resolve('Animation ended');
			}

			node.addEventListener('animationend', handleAnimationEnd, { once: true });
		});

	const onEditClick = (obj) => {
		setErrors({});
		setEditingCat(obj);
		setName(obj.name);
		setAge(obj.age);
		setShowModal(true);
	};

	const onDeleteClick = (obj) => {
		setDeletingCat(obj);
		setShowDeleteModal(true);
	};

	const updateCat = async (id) => {
		try {
			const cat = { name, age };
			const response = await axios.post(`/api/cat/updateCats/${id}`, cat);

			if (response) {
				setShowModal(false);
				setEditingCat({});
				setName('');
				setAge('');
				await getPets();
			}
		} catch (error) {
			setErrors(error.response.data);
		}
	};

	const deleteCat = async (id) => {
		try {
			setDeleting(true);
			const response = await axios.delete(`/api/cat/deleteCats/${id}`);

			if (response) {
				setDeletingProgress(100);

				setTimeout(async () => {
					setDeleting(false);
					setDeletingCat({});
					setShowDeleteModal(false);
					await getPets();
				}, 1000);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
			<Nav className="justify-content-center" activeKey="/home">
				<Nav.Item className="m-3">
					<Link to="/" className="text-light display-6">
						Home
					</Link>
				</Nav.Item>
				{user && user.authenticated ? (
					<Nav.Item className="m-3">
						<Link to="/my-pets" className="text-light display-6">
							My Pets
						</Link>
					</Nav.Item>
				) : null}
			</Nav>
			<Row xs={1} md={2} className="g-4">
				{pets.length ? (
					pets.map((cat, index) => {
						return (
							<Col md={4} id={`cat-` + cat._id} key={index} className="cat-card mb-3">
								<Card bg="light" text="dark" className="">
									<Card.Body>
										<Col md={{ span: 6, offset: 3 }} className="text-center">
											<img
												variant="top"
												src={cat.imageURL}
												className="img-fluid rounded mx-auto d-block"
												style={{ height: '10%' }}
											/>
											<Card.Title className="text-center">
												<span>{cat.name} </span>
											</Card.Title>
											<small>
												{cat.age} {cat.age > 1 ? 'years old' : 'year old'}
											</small>
										</Col>

										<small>
											{cat.info.breeds[0].temperament.toString().split(',').map((t, tIndex) => {
												return (
													<span key={tIndex}>
														<Badge bg="info">{t} </Badge> {' '}
													</span>
												);
											})}
										</small>
										<ListGroup variant="flush" className="mt-2">
											<ListGroup.Item>
												<small>
													Affection level <i className="fas fa-heart text-danger" />
												</small>{' '}
												<ProgressBar
													animated
													variant="danger"
													now={parseFloat(cat.affection)}
													label={`${parseFloat(cat.affection)}%`}
												/>
											</ListGroup.Item>

											{checkIfHungry(cat.lastFed) ? (
												<ListGroup.Item>
													<small className="text-danger">{cat.name} is hungry!</small>
													<Button
														variant="dark"
														className="float-end"
														onClick={(e) => feedCat(cat._id, cat.affection)}
													>
														Feed <i className="fas fa-utensils" />
													</Button>
												</ListGroup.Item>
											) : null}
											{checkIfCatWantsToPlay(cat.lastPlayed) ? (
												<ListGroup.Item>
													<small>{cat.name} wants to play!</small>
													<Button
														variant="dark"
														className="float-end"
														onClick={(e) => playWithCat(cat._id, cat.affection)}
													>
														Play <i className="fal fa-chess" />
													</Button>
												</ListGroup.Item>
											) : null}
											{checkIfCatWantsToBePet(cat.lastPets) ? (
												<ListGroup.Item>
													<small>{cat.name} wants to be pet!</small>
													<Button
														variant="dark"
														className="float-end"
														onClick={(e) => petCat(cat._id, cat.affection)}
													>
														Pet <i className="fas fa-cat" />
													</Button>
												</ListGroup.Item>
											) : null}
											<ListGroup.Item>
												<small>Edit {cat.name}</small>
												<Button
													variant="dark"
													className="float-end"
													onClick={(e) => onEditClick(cat)}
												>
													Edit <i className="fas fa-edit" />
												</Button>
											</ListGroup.Item>
											<ListGroup.Item>
												<small className="text-danger">Send back {cat.name}</small>
												<Button
													variant="danger"
													className="float-end"
													onClick={(e) => onDeleteClick(cat)}
												>
													Release <i className="fas fa-sad-tear" />
												</Button>
											</ListGroup.Item>
										</ListGroup>
									</Card.Body>
									<Accordion>
										<Accordion.Item eventKey="0">
											<Accordion.Header>Stats</Accordion.Header>
											<Accordion.Body>
												<Card.Text>
													{cat ? <span>{cat.info.breeds[0].description}</span> : null};
												</Card.Text>
												<ListGroup variant="flush">
													<ListGroup.Item>
														<small>Adaptability</small>{' '}
														<ProgressBar
															animated
															variant={
																parseFloat(cat.info.breeds[0].adaptability) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].adaptability) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
															now={parseFloat(cat.info.breeds[0].adaptability) * 20}
															label={`${parseFloat(cat.info.breeds[0].adaptability) *
																20}%`}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Child friendly</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].child_friendly) * 20}
															label={`${parseFloat(cat.info.breeds[0].child_friendly) *
																20}%`}
															variant={
																parseFloat(cat.info.breeds[0].child_friendly) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].child_friendly) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Dog friendly</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].dog_friendly) * 20}
															label={`${parseFloat(cat.info.breeds[0].dog_friendly) *
																20}%`}
															variant={
																parseFloat(cat.info.breeds[0].dog_friendly) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].dog_friendly) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Hypoallergenic</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].hypoallergenic) * 20}
															label={`${parseFloat(cat.info.breeds[0].hypoallergenic) *
																20}%`}
															variant={
																parseFloat(cat.info.breeds[0].hypoallergenic) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].hypoallergenic) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Affection level</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].affection_level) * 20}
															label={`${parseFloat(cat.info.breeds[0].affection_level) *
																20}%`}
															variant={
																parseFloat(cat.info.breeds[0].affection_level) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].affection_level) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Energy level</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].energy_level) * 20}
															label={`${parseFloat(cat.info.breeds[0].energy_level) *
																20}%`}
															variant={
																parseFloat(cat.info.breeds[0].energy_level) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].energy_level) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Grooming</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].grooming) * 20}
															label={`${parseFloat(cat.info.breeds[0].grooming) * 20}%`}
															variant={
																parseFloat(cat.info.breeds[0].grooming) * 20 === 100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].grooming) * 20 === 20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
													<ListGroup.Item>
														<small>Intelligence</small>{' '}
														<ProgressBar
															animated
															now={parseFloat(cat.info.breeds[0].intelligence) * 20}
															label={`${parseFloat(cat.info.breeds[0].intelligence) *
																20}%`}
															variant={
																parseFloat(cat.info.breeds[0].intelligence) * 20 ===
																100 ? (
																	'success'
																) : null ||
																parseFloat(cat.info.breeds[0].intelligence) * 20 ===
																	20 ? (
																	'danger'
																) : null
															}
														/>
													</ListGroup.Item>
												</ListGroup>
											</Accordion.Body>
										</Accordion.Item>
									</Accordion>
								</Card>
							</Col>
						);
					})
				) : null}
			</Row>
			<Modal
				show={showModal}
				onHide={(e) => setShowModal(false)}
				aria-labelledby="contained-modal-title-vcenter"
				centered
				size="lg"
				backdrop="static"
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Edit {editingCat.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Cats name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Whiskers"
								onChange={(e) => setName(e.target.value)}
								defaultValue={editingCat.name}
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
								defaultValue={editingCat.age}
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
					<Button variant="primary" onClick={(e) => updateCat(editingCat._id)}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal
				show={showDeleteModal}
				onHide={(e) => setShowDeleteModal(false)}
				size="sm"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				backdrop="static"
			>
				{deleting ? (
					<Modal.Body className="text-center">
						<h1>Releasing {deletingCat.name} </h1>
						<ProgressBar animated now={deletingProgress} label={`${deletingProgress}%`} variant="danger" />
					</Modal.Body>
				) : (
					<Modal.Body className="text-center">
						<p>Are you sure you want to release {deletingCat.name} ?</p>
						<Button variant="secondary" onClick={(e) => setShowDeleteModal(false)}>
							No
						</Button>{' '}
						<Button variant="danger" onClick={(e) => deleteCat(deletingCat._id)}>
							Yes
						</Button>
					</Modal.Body>
				)}
			</Modal>
		</Row>
	);
}

export default Pets;
