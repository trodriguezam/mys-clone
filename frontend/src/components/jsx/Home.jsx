import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axiosInstance from '../PageElements/axiosInstance';

const ProductSwiper = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState(0);
  const [animation, setAnimation] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const ID = user ? parseInt(user.user_id, 10) : null;
  const [ready, setReady] = useState(true);

  const [preferences, setPreferences] = useState({
    colores: [],
    tipos: [],
    marcas: [],
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedPreferences = JSON.parse(localStorage.getItem('preferences'));
  
    if (storedUser) {
      setUser(storedUser);
    }
  
    if (storedPreferences) {
      setPreferences(storedPreferences);
      if (storedPreferences.colores.length === 0 || storedPreferences.tipos.length === 0 || storedPreferences.marcas.length === 0) {
        setReady(false);
      } else {
        setReady(true);
      }
    }
  }, []);

  useEffect(() => {
    const preferredColors = JSON.parse(user?.preferred_colores || "[]");
    const preferredBrands = JSON.parse(user?.preferred_marcas || "[]");
    const preferredTypes = JSON.parse(user?.preferred_tipos || "[]");
  
    const newPreferences = {
      colores: preferredColors,
      tipos: preferredTypes,
      marcas: preferredBrands,
    };
  
    setPreferences(newPreferences);
  
    if (preferredColors.length === 0 || preferredBrands.length === 0 || preferredTypes.length === 0) {
      setReady(false);
    } else {
      setReady(true);
    }

    localStorage.setItem('preferences', JSON.stringify(newPreferences));
  }, [user]);

  useEffect(() => {
    if (ready) {
      fetchProducts();
    }
  }, [ready]);

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

  const handlePreferenceChange = (e) => {
    const { name, value, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked ? [...prev[name], value] : prev[name].filter((pref) => pref !== value),
    }));
  };

  const submitPreferences = async () => {
    try {
      await axiosInstance.put(`/users/${user.user_id}/`, {
        preferred_colores: preferences.colores,
        preferred_tipos: preferences.tipos,
        preferred_marcas: preferences.marcas,
      });
      // Reload user data after saving preferences
      const updatedUser = await axiosInstance.get(`/users/${user.user_id}/`);
      localStorage.setItem('user', JSON.stringify(updatedUser.data));
      setUser(updatedUser.data);
      setReady(true);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  if (!ready) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '40vh', marginTop: "75px" }}>
        <h1>Please update your preferences to view product recommendations.</h1>
        <form onSubmit={(e) => { e.preventDefault(); submitPreferences(); }}>
          <div>
            <label>Select Colors:</label>
            <label><input type="checkbox" name="colores" value="azul" onChange={handlePreferenceChange} /> Azul</label>
            <label><input type="checkbox" name="colores" value="verde" onChange={handlePreferenceChange} /> Verde</label>
            {/* Add other colors as needed */}
          </div>
          <div>
            <label>Select Types:</label>
            <label><input type="checkbox" name="tipos" value="blusa" onChange={handlePreferenceChange} /> Blusa</label>
            <label><input type="checkbox" name="tipos" value="pantalon" onChange={handlePreferenceChange} /> Pantalón</label>
            {/* Add other types as needed */}
          </div>
          <div>
            <label>Select Brands:</label>
            <label><input type="checkbox" name="marcas" value="MANGO" onChange={handlePreferenceChange} /> MANGO</label>
            <label><input type="checkbox" name="marcas" value="ZARA" onChange={handlePreferenceChange} /> ZARA</label>
            <label><input type="checkbox" name="marcas" value="BASEMENT" onChange={handlePreferenceChange} /> BASEMENT</label>
            {/* Add other brands as needed */}
          </div>
          <button type="submit">Save Preferences</button>
        </form>
      </div>
    );
  }

  if (products.length === 0) return <div>Loading...</div>;
  if (currentIndex >= products.length) return <div>No more products available</div>;

  const currentProduct = products[currentIndex];

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
