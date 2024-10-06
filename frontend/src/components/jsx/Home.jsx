import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import "../css/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeStep, setActiveStep] = useState(0); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Función para ir al producto anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  return (
    <div>
      <h1>Match Your Style</h1>
      <SwipeableViews
        index={activeStep}
        onChangeIndex={(index) => setActiveStep(index)}
        enableMouseEvents
      >
        {products.map((product, index) => (
          <div key={index} style={{ padding: 24, textAlign: 'center' }}>
            <div className="grid-pod">
              <div className="pod">
                <div className="pod-head">
                  <img src={product.imagen_url} alt={product.marca} />
                </div>
                <div className="pod-details">
                  <div><b className="title1">{product.marca}</b></div>
                  <b className="pod-subTitle">{product.descripcion}</b>
                  <div className="prices">{product.precio_actual}<span className="discount-badge">-31%</span></div>
                  <button className="button">Agregar al Carro</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </SwipeableViews>
    </div>
  );
};

export default Home;