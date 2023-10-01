import { useState } from 'react';
import { Card, Carousel, Form } from 'react-bootstrap';

function Show() {

	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex: number) => {
		setIndex(selectedIndex);
	};

	return (
		<Carousel activeIndex={index} onSelect={handleSelect} className='Show'>
			<Carousel.Item>
				<div className='ShowSlide'>
					<div className='ShowSlideText'>
						<span>WHO AM I ?</span>
						<span>Currently ahead of a new personal project I am looking after a new job to fit my passion.</span>
						<span>After years dedicated to maths, economics and optimization algorithms, I also made my way into coding.</span>
						<span>First with research oriented scripts, I ended up working with complex web app code base (Typescript and Java).</span>
						<span>In all projects I carried, I always started by learning new technologies, thus I am not afraid of starting something brand new for me.</span>
						<span>Today I would define my self as fullstack and open for discussion about any engineer to development position: details of the position matter more than the title.</span>
						<span>But the most important thing is... I want to travel the world and find a full remote job !</span>
					</div>
				</div>
			</Carousel.Item>
			<Carousel.Item>
				<div className='ShowSlide'>
					<div className='ShowSlideText'>
						<span>CONTACT ME !</span>
						<span>Why should you contact me ? </span>
						<span> - To offer me a super cool job ?</span>
						<span> - To talk about simulations and how to improve them ?</span>
						<span>The below input box is linked to my personal email, feel free to use it to contact me.</span>
						<span>If you prefer do it yourself, you can find my socials at the end of the page, see you soon !</span>
					</div>
				</div>
			</Carousel.Item>
			<Carousel.Item>
				<div className='ShowSlide'>
					<div className='ShowSlideText'>
						<span>COMMING NEXT ?</span>
						<span> - Relook TSP simulation to make it nicer.</span>
						<span> - Add user interactions through toolbar at the bottom of each simulation popup:</span>
						<span>     - Change boid number and steering rules.</span>
						<span>     - Add different sorting algorithm so user can choose the one he prefers.</span>
						<span>     - Enable zoom for the Sierpinsky triangle.</span>
						<span>     - Allow user to fill the GOL grid with predefined famous patterns.</span>
						<span> - Try some 3D for Perlin noise terrain generation.</span>
					</div>
				</div>
			</Carousel.Item>
		</Carousel>
	);
}

export default Show;