import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, ListGroup, Badge, ProgressBar, Modal } from 'react-bootstrap';
import axios from 'axios';

function Cats() {
	const [ cat, setCat ] = useState({});
	const [ showCard, setShowCard ] = useState(false);
	const [ showModal, setShowModal ] = useState(false);

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
		try {
			const response = await axios.get('/api/cat/catApi/getCatImages');
			setCat(response.data[0]);
			setShowCard(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
			<Col md={6}>
				{showCard && cat && cat.breeds ? (
					<Card bg="light" text="dark" className="m-5 ">
						<Card.Img variant="top" src={cat.url} className="img-fluid" style={{ height: '10%' }} />
						<Card.Body>
							<Card.Title>
								<span>Breed: {cat.breeds[0].name}</span>
								<br />
								<small>
									{cat.breeds[0].temperament.toString().split(',').map((t, tIndex) => {
										return (
											<span key={tIndex}>
												<Badge bg="info">{t} </Badge> {' '}
											</span>
										);
									})}
								</small>
							</Card.Title>

							<Card.Text>{cat ? <span>{cat.breeds[0].description}</span> : null};</Card.Text>
						</Card.Body>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<small>Indoor</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].indoor) * 20}
									label={`${parseFloat(cat.breeds[0].indoor) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Adaptability</small>{' '}
								<ProgressBar
									animated
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
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Dog friendly</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].dog_friendly) * 20}
									label={`${parseFloat(cat.breeds[0].dog_friendly) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Hypoallergenic</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].hypoallergenic) * 20}
									label={`${parseFloat(cat.breeds[0].hypoallergenic) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Affection level</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].affection_level) * 20}
									label={`${parseFloat(cat.breeds[0].affection_level) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Energy level</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].energy_level) * 20}
									label={`${parseFloat(cat.breeds[0].energy_level) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Grooming</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].grooming) * 20}
									label={`${parseFloat(cat.breeds[0].grooming) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Health issues</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].health_issues) * 20}
									label={`${parseFloat(cat.breeds[0].health_issues) * 20}%`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>
								<small>Intelligence</small>{' '}
								<ProgressBar
									animated
									now={parseFloat(cat.breeds[0].intelligence) * 20}
									label={`${parseFloat(cat.breeds[0].intelligence) * 20}%`}
								/>
							</ListGroup.Item>
						</ListGroup>
						<Card.Body>
							<Button variant="dark" onClick={(e) => setShowModal(true)}>
								Adopt
							</Button>{' '}
							<Button onClick={onNextClick} variant="dark">
								Next
							</Button>
						</Card.Body>
					</Card>
				) : (
					<h1 className="text-center text-light mb-3">Loading...</h1>
				)}
			</Col>
			<Modal
				show={showModal}
				onHide={(e) => setShowModal(false)}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Centered Modal</h4>
					<p>
						Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
						egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={(e) => setShowModal(false)}>Close</Button>
				</Modal.Footer>
			</Modal>
		</Row>
	);
}

export default Cats;
