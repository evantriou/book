import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import emailjs from '@emailjs/browser';

function Email() {

	const [message, setMessage] = useState('');
	const [mailAdress, setMailAdress] = useState('');
	const [isSent, setIsSent] = useState(false);

	const handleClick = async () => {

		var templateParams = {
			name: mailAdress,
			text: message
		};

		if (templateParams.name.length === 0) return;
		if (templateParams.text.length === 0) return;

		emailjs.send('service_xkqa5hu', 'template_8d7eb2h', templateParams, 'A5wqQGaaVAoe6Kpjq')
			.then((result) => {
				console.log(result.text);
				setIsSent(true);
				setTimeout(() => {
					setIsSent(false);
				}, 3000);
			}, (error) => {
				console.log(error.text);
			});
	};

	const handleMessageAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
	};
	const handleMailAdressAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMailAdress(event.target.value);
	};

	return (
		<Form className='Form'>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<div className="FormLabel">
					<Form.Label>Email address</Form.Label>
					<Form.Text className="text-muted" style={{ marginLeft: '1em' }}>
						We'll never share your email with anyone else.
					</Form.Text>
				</div>
				<Form.Control
					type="email"
					placeholder="Enter email"
					value={mailAdress}
					onChange={handleMailAdressAreaChange}
					className="Input"
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
				<Form.Control
					as="textarea"
					rows={3}
					placeholder="Your message"
					value={message}
					onChange={handleMessageAreaChange}
					className="Input"
				/>
			</Form.Group>
			<Button variant="primary" type="button" onClick={handleClick} className="ButtonPrimary">
				Send
			</Button>
			{isSent && <div>Mail sent with succes !</div>}
		</Form>
	);
}

export default Email;