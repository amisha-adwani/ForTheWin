import React, { useState, useEffect } from 'react';
import './profile.css';
import { memojis } from './assets/memojis';
import Avatar from 'react-nice-avatar';
import { City, Country, State } from 'country-state-city';

const Profile = () => {
    const [planetData, setPlanetData] = useState(null);
    const [profile, setProfile] = useState(() => {
        const savedProfile = localStorage.getItem('userProfile');

        return savedProfile ? JSON.parse(savedProfile) : {
            name: '',
            dob: '',
            dobTime: '',
            city: '',
            state: '',
            country: '',
            gender: '',
            latitude: '',
            longitude: '',
            selectedMemoji: ''
        };
    });

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMemojiSelect = (memojiId) => {
        setProfile(prev => ({
            ...prev,
            selectedMemoji: memojiId
        }));
    };
    const handleCityChange = (e) => {
        const cityName = e.target.value;
        
        // Get all cities
        const cities = City.getAllCities();
        const cityData = cities.find(city => 
            city.name.toLowerCase() === cityName.toLowerCase()
        );

        console.log('Selected city data:', cityData); // Debug log

        setProfile(prev => ({
            ...prev,
            city: cityName,
            latitude: cityData ? cityData.latitude : '',
            longitude: cityData ? cityData.longitude : ''
        }));
    };

    const handleCountryChange = (e) => {
        const countryName = e.target.value;
        setProfile(prev => ({
            ...prev,
            country: countryName
        }));
    };

    const handleStateChange = (e) => {
        const stateName = e.target.value;
        setProfile(prev => ({
            ...prev,
            state: stateName,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(profile.latitude && profile.longitude) {
            try {
                // First, save to localStorage
                localStorage.setItem('userProfile', JSON.stringify(profile));

                // Prepare data for astrology API
                const [year, month, day] = profile.dob.split('-');
                const [hours, minutes] = profile.dobTime.split(':');
                
                const astroData = {
                    year: parseInt(year),
                    month: parseInt(month),
                    date: parseInt(day),
                    hours: parseInt(hours),
                    minutes: parseInt(minutes),
                    seconds: 0,
                    latitude: parseFloat(profile.latitude),
                    longitude: parseFloat(profile.longitude),
                    timezone: 5.5,
                    config: {
                        observation_point: "topocentric",
                        ayanamsha: "lahiri"
                    }
                };

                // Fetch planet positions
                const planetResponse = await fetch('https://json.apiastro.com/planets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'P50ibNdndgaKOeImeHN91aqNeTk8sEOH79Odc7Kv'
                    },
                    body: JSON.stringify(astroData)
                });

                if (!planetResponse.ok) {
                    throw new Error(`Planet API error! status: ${planetResponse.status}`);
                }

                const planetData = await planetResponse.json();
                console.log('Planet data:', planetData);

                // Now send everything to backend
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: profile.name,
                        dob: profile.dob,
                        dobTime: profile.dobTime,
                        city: profile.city,
                        state: profile.state,
                        country: profile.country,
                        gender: profile.gender,
                        latitude: profile.latitude,
                        longitude: profile.longitude,
                        planetData: planetData.output // Include planet data
                    }),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Profile created successfully:', result);
                alert('Profile saved successfully!');

            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Failed to save profile. Please try again.');
            }
        } else {
            alert('Please select a valid city to get location coordinates.');
        }
    };

    return (
        <div className="profile-container">
            <h2>Profile Settings</h2>
            <div className="profile-card">
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-header">
                        <div className="memoji-selector">
                            {memojis.map((memoji) => (
                                <div 
                                    key={memoji.id}
                                    className={`memoji-item ${profile.selectedMemoji === memoji.id ? 'selected' : ''}`}
                                    onClick={() => handleMemojiSelect(memoji.id)}
                                >
                                    <div className="avatar-container">
                                        <Avatar style={{ width: '50px', height: '50px' }} {...memoji.config} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="name-input"
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={profile.dob}
                            onChange={handleChange}
                            className="form-input"
                            onFocus={(e) => e.target.showPicker()}
                        />
                        <input
                            type="time"
                            id="dobTime"
                            name="dobTime"
                            value={profile.dobTime}
                            onChange={handleChange}
                            className="form-input"
                            onFocus={(e) => e.target.showPicker()}
                        />
                    </div>

                    <div className="gender-selector">
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="" disabled>Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={profile.city}
                            onChange={handleCityChange}
                            placeholder="Enter your city"
                            className="form-input"
                        />
                    </div>

                    <div className="form-row"> 
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={profile.state}
                            onChange={handleStateChange}
                            placeholder="Enter your state"
                            className="form-input"
                        />
                    </div>
                    <div className="form-row"> 
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={profile.country}
                            onChange={handleCountryChange}
                            placeholder="Enter your country"
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="save-button">
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile; 