import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axiosInstance from '../PageElements/axiosInstance';

const ProductSwiper = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState(0);
  const [animation, setAnimation] = useState(null);
  const [user, setUser] = useState(null);
  const ID = user ? parseInt(user.user_id, 10) : null;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/recommend-products', { params: { user: user } });
      let data = response.data;
      setProducts(data.sort(() => Math.random() - 0.5));
      setCurrentIndex(0); // Reset index on new fetch
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setReady(true);
    }
  };


  const handleMatch = async (productId) => {
    try {
      await axiosInstance.post('/match-user-products/', { user: ID, product: productId });
    } catch (error) {
      console.error("Error matching product:", error);
    }
  };

  const handleDragStart = (e) => {
    setDragStart(e.clientX);
  };

  const handleDragMove = (e) => {
    if (dragStart === null) return;
    const currentOffset = e.clientX - dragStart;
    setOffset(currentOffset);
  };

  const handleDragEnd = () => {
    if (offset < -100) {
      handleSwipe('right');
    } else if (offset > 100) {
      handleSwipe('left');
    }
    setDragStart(null);
    setOffset(0);
  };

  const handleSwipe = (direction) => {
    setAnimation(direction);

    if (direction === 'left' && products[currentIndex]) {
      handleMatch(products[currentIndex].id);
    }

    setTimeout(() => {
      setAnimation(null);
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 300);
  };

  if (products.length === 0) return <div>Loading...</div>;
  if (currentIndex >= products.length) return <div>No more products available</div>;

  const currentProduct = products[currentIndex];

  if (!ready) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '40vh', marginTop: "75px" }}>
      <div
        className="info-wrapper"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{
          transform: `translateX(${offset}px) rotate(${offset * 0.05}deg)`,
          transition: dragStart ? 'none' : 'all 0.3s ease',
        }}
      >
        <div className="grid-pod">
          <div className="pod-head">
            <img src={currentProduct.imagen_url} alt={currentProduct.marca} />
          </div>
        </div>
        <div className="pod-details">
          <div><b className="title1">{currentProduct.marca}</b></div>
          <b className="pod-subTitle">{currentProduct.descripcion}</b>
          <div className="prices">${currentProduct.precio_actual}</div>
        </div>

        {animation && (
          <div className="animation">
            {animation === 'left' ? '💚' : '❌'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={() => handleSwipe('right')}
          className="button"
          style={{ backgroundColor: '#dc3545' }}
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe('left')}
          className="button"
          style={{ backgroundColor: '#28a745' }}
        >
          ♥
        </button>
      </div>
    </div>
  );
};

export default ProductSwiper;
