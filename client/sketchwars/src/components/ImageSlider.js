import React, { useState, useEffect } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import './ImageSlider.css';

const ImageSlider = () => {

  const [current, setCurrent] = useState(0);

  const slides = [
    require("../images/stockDrawing.jpeg"),
    require("../images/Doodling.jpg"),
    require("../images/stockDrawing.jpeg"),
    require("../images/stockDrawing.jpeg")
  ]

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  if (!Array.isArray(slides) || slides.length <= 0)
    return null;

  return (
    <section className='slider'>
      <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
      <FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} />
      {slides.map((slide, index) => 
          <div className={index === current ? 'slide active' : 'slide'} key={index} >
            {index === current && (<img src={slide} className='image' />)}
          </div>
      )}
    </section>
  );
};

export default ImageSlider;