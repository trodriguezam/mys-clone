import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axiosInstance from '../PageElements/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const ID = user ? parseInt(user.user_id, 10) : null;
  const [ready, setReady] = useState(true);
  const navigate = useNavigate();

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
        preferred_colores: JSON.stringify(preferences.colores),
        preferred_tipos: JSON.stringify(preferences.tipos),
        preferred_marcas: JSON.stringify(preferences.marcas),
      });
      user.preferred_colores = JSON.stringify(preferences.colores);
      user.preferred_tipos = JSON.stringify(preferences.tipos);
      user.preferred_marcas = JSON.stringify(preferences.marcas);

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

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
export default Preferences;
