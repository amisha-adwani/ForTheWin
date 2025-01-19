import React, { useState, useEffect } from 'react';

const Home = () => {
    const [birthChart, setBirthChart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBirthChart = async () => {
            try {
                // Get profile from localStorage
                const savedProfile = localStorage.getItem('userProfile');
                if (!savedProfile) {
                    setError('Please complete your profile first');
                    setLoading(false);
                    return;
                }

                const profile = JSON.parse(savedProfile);
                
                // Extract date and time
                const [year, month, day] = profile.dob.split('-');
                const [hours, minutes] = profile.dobTime.split(':');
                
                // Prepare data for the API
                const data = {
                    year: parseInt(year),
                    month: parseInt(month),
                    date: parseInt(day),
                    hours: parseInt(hours),
                    minutes: parseInt(minutes),
                    seconds: 0,
                    latitude: parseFloat(profile.latitude),
                    longitude: parseFloat(profile.longitude),
                    timezone: 5.5, // Default to IST, you might want to calculate this based on location
                    config: {
                        observation_point: "topocentric",
                        ayanamsha: "lahiri"
                    },
                    "chart_config" :  {
            "font_family":"Mallanna", /* Mallanna / Roboto */
            "hide_time_location":"False", /* True / False */
            "hide_outer_planets":"False", /* True / False */
            "chart_style":"north_india",  /* south_india / north_india */
            //  /*"sign_number_font_color":"#A5243D", */ /* works for north_india chart only */
            "native_name":"Mr. Ram Charan",
            "native_name_font_size": "15px",
            "native_details_font_size":"15px",
            "chart_border_width":1,
            "planet_name_font_size": "15px",
            "chart_heading_font_size":"15px",            
            "chart_background_color":"#FFFFFF",            
            "chart_border_color":"#000000",            
            "native_details_font_color":"#000",            
            "native_name_font_color": "#000000",            
            "planet_name_font_color": "#000000",            
            "chart_heading_font_color":"#000000"
        }

                };

                console.log('Sending data to API:', data);

                const response = await fetch('https://json.apiastro.com/horoscope-chart-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'P50ibNdndgaKOeImeHN91aqNeTk8sEOH79Odc7Kv'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const chartData = await response.json();
                console.log('Birth chart data:', chartData);
                setBirthChart(chartData);
                setLoading(false);

            } catch (err) {
                console.error('Error fetching birth chart:', err);
                setError('Failed to fetch birth chart. Please try again later.');
                setLoading(false);
            }
        };

        fetchBirthChart();
    }, []);

    if (loading) {
        return (
            <div style={{ 
                height: 'calc(100vh - 60px)', 
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Loading your birth chart...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                height: 'calc(100vh - 60px)', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                textAlign: 'center'
            }}>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ 
            height: 'calc(100vh - 60px)', 
            color: 'white',
            padding: '20px',
            overflowY: 'auto'
        }}>
            <h1>Your Birth Chart</h1>
            {birthChart && (
                <div className="birth-chart-data">
                    <img src={birthChart.output} alt="Birth Chart" />
                </div>
            )}
        </div>
    );
};

export default Home;
