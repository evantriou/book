import { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import linkedin from './../../pictures/linkedin.png';
import github from './../../pictures/github.png';
import gmail from './../../pictures/gmail.png';

function Show() {

	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex: number) => {
		setIndex(selectedIndex);
	};

	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = () => {
	  const email = 'triouevan@gmail.com';
	  navigator.clipboard.writeText(email).then(() => {
		setIsCopied(true);
		setTimeout(() => {
		  setIsCopied(false);
		}, 3000);
	  });
	};

	return (
		<Carousel activeIndex={index} onSelect={handleSelect} interval={null} className='Show'>
			<Carousel.Item>
				<div className='ShowSlide'>
					<div className='ShowSlideText'>

						<span className="title">WHO AM I ?</span>
						<span className="">A math and coding lover, let's say a <span className="passion">fullstack</span> engineer from France !</span>
						<span className="">Currently ahead of a new personal and professional project : <span className="passion">coding & traveling</span>.</span>
						<span className="">After years dedicated to maths, economics and <span className="passion">optimization algorithms</span>,
						I also made my way into coding with <span className="passion">complex web app code base (Typescript and Java)</span>.</span>
						<span className="">In all projects I carried, I always started by learning new technologies, thus, I am not afraid of starting something brand new for me.</span>

					</div>
					<Carousel.Caption className='ShowSlideCaption'>
						<h3>Triou Evan</h3>
						<p>Fullstack developer and engineer around the world.</p>
					</Carousel.Caption>
				</div>
			</Carousel.Item>
			<Carousel.Item>
				<div className='ShowSlide'>
					<div className='ShowSlideText'>
						<span className="title">CONTACT ME !</span>
						<span>Why should you contact me ? </span>
						<ul>
							<li><span>To offer me a super cool job ?</span></li>
							<li><span>To talk about simulations and how to improve them ?</span></li>
						</ul>
						<span>The below input box is linked to my personal email, feel free to use it to contact me.</span>
						<span>If you prefer do it yourself, you can find my socials right below, see you soon !</span>
					</div>
					<Carousel.Caption className='ShowSlideCaption'>
						<h3>Click below</h3>
						<a href="https://www.linkedin.com/in/evan-triou/" target="_blank"  rel="noreferrer">
							<img
								src={linkedin}
								alt="LinkedIn"
								style={{
									width: '3rem',
									height: '3rem',
									margin: '0.5rem',
									objectFit: 'cover',
								}}
							/>
						</a>
						<a href="https://github.com/evantriou/book" target="_blank"  rel="noreferrer">
							<img
								src={github}
								alt="GitHub"
								style={{
									width: '3.8rem',
									height: '3.8rem',
									margin: '0.5rem',
									objectFit: 'cover',
								}}
							/>
						</a>
						<div onClick={copyToClipboard}>
							<img
								src={gmail}
								alt="Gmail"
								style={{
									width: '2.7rem',
									height: '2.7rem',
									margin: '0.5rem',
									objectFit: 'cover',
								}}
							/>
						</div>
						{isCopied && <div>Mail copied to clipboard</div>}
					</Carousel.Caption>
				</div>
			</Carousel.Item>
			<Carousel.Item>
				<div className='ShowSlide'>
					<div className='ShowSlideText'>
						<span className="title">COMMING NEXT ?</span>
						<ul>
							<li>Ant colony optimization visualization.</li>
							<li>Fluid simulation.</li>
							<li>Simple neural network apprentissage visualization.</li>
							<li>DNA Driven life evolution simulation.</li>
						</ul>
					</div>
					<Carousel.Caption className='ShowSlideCaption'>
						<h3>Next developments</h3>
						<p>Can not wait to see 3D boids to be honest.</p>
					</Carousel.Caption>
				</div>
			</Carousel.Item>
		</Carousel>
	);
}

export default Show;