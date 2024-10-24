import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import "../css/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeStep, setActiveStep] = useState(0); 
  const [swipeDirection, setSwipeDirection] = useState(null);

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
  const handleMatch = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/match-user-products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: products[activeStep].id,
          user: 1,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error al hacer match:", error);
    }
  }
  
  const handleSwipe = (index) => {
    setSwipeDirection(index > activeStep ? 'right' : 'left');
    setActiveStep(index);
  };


  return (
    <div>
      <div className='product-container'>
      
      <SwipeableViews
        index={activeStep}
        onChangeIndex={handleSwipe}
        enableMouseEvents
      >
        {products.map((product, index) => (
          <div className='info-wrapper'>
          <div key={index} style={{ padding: 24, textAlign: 'center' }}>
            <div className="grid-pod">
              <div className="pod">
                <div className="pod-head">
                  <img src={product.imagen_url} alt={product.marca} />
                </div>
                
              </div>
            </div>
          </div>
          <div className="pod-details">
          <div><b className="title1">{product.marca}</b></div>
          <b className="pod-subTitle">{product.descripcion}</b>
          <div className="prices">{product.precio_actual}</div>
          <button className="button">Agregar al Carro</button>
        </div>
        </div>
          
        ))}
      </SwipeableViews>
      {swipeDirection === 'left' && <div className="animation">💚</div>} 
      {swipeDirection === 'right' && <div className="animation">❌</div>} 
      
    </div>
    </div>
  );
};

export default Home;