import { useState } from 'react';
import { Card, Carousel, Form } from 'react-bootstrap';

function Show() {

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className = 'Show'>
      <Carousel.Item>
        <div className = 'ShowSlide'>
          <span>WHO AM I ?</span>
          <span>Currently ahead of a new personal project I am looking after a new job to fit my passion.</span>
          <span>After years dedicated to maths, economics and optimization algorithms, I also made my way into coding.</span>
          <span>First with research oriented scripts, I ended up working with complex web app code base.</span>
          <span>First with research oriented scripts, I ended up working with complex web app code base.</span>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className = 'ShowSlide'>
          <span>CONTACT ME !</span>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className = 'ShowSlide'>
          <span>ABOUT SIMULATIONS ?</span>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default Show;