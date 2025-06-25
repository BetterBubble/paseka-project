import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManufacturersList.css';

const ManufacturersList = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await axios.get('/api/manufacturers/');
                // Проверяем, есть ли results в ответе
                const manufacturersData = response.data.results || response.data;
                setManufacturers(Array.isArray(manufacturersData) ? manufacturersData : []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching manufacturers:', err);
                setError('Не удалось загрузить список производителей');
                setLoading(false);
            }
        };

        fetchManufacturers();
    }, []);

    if (loading) return <div className="manufacturers-loading">Загрузка...</div>;
    if (error) return <div className="manufacturers-error">{error}</div>;
    if (!manufacturers.length) return null; // Не показываем секцию, если нет производителей

    return (
        <div className="manufacturers-section">
            <h2 className="manufacturers-title">Наши производители</h2>
            <div className="manufacturers-grid">
                {manufacturers.map((manufacturer) => (
                    <div key={manufacturer.id} className="manufacturer-card">
                        <h3>{manufacturer.name}</h3>
                        {manufacturer.description && (
                            <p>{manufacturer.description}</p>
                        )}
                        {manufacturer.website && (
                            <a 
                                href={manufacturer.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="manufacturer-website"
                            >
                                Посетить сайт
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManufacturersList; 