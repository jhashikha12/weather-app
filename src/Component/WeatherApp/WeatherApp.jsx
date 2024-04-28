import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import searchIcon from "../assets/search.png";
import clearIcon from "../assets/clear.png";
import cloudIcon from "../assets/cloud.png";
import drizzleIcon from "../assets/drizzle.png";
import humidityIcon from "../assets/humidity.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";
import windIcon from "../assets/wind.png";
import { GoogleMap, LoadScript } from '@react-google-maps/api'; // Import Google Map components

export const WeatherApp = () => {
    const containerStyle = {
        width: '80%',
        height: '200px',
    };
    let apiKey = "29a0198503c024b9c09632a963efa877";
    const [wicon, setWicon] = useState(null); // Initial state of weather icon set to null
    const [weatherData, setWeatherData] = useState(null); // Initial state of weather data set to null
    const [error, setError] = useState(null); // State to handle errors
    const [mapKey, setMapKey] = useState(0); // Key to force remount of the map component

    const search = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const element = document.getElementsByClassName("cityInput")[0].value;
        if (element === "") {
            setWeatherData(null); // Reset weather data if input is empty
            setError(null); // Reset error if input is empty
            return;
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element}&units=Metric&appid=${apiKey}`
        let response = await fetch(url);
        let data = await response.json();

        if (data.cod === "404") {
            setError("Location not found!!"); // Set error message if location is not found
            setWeatherData(null); // Reset weather data if location is not found
            return;
        }

        setWeatherData(data); // Update weather data if input is not empty
        setError(null); // Reset error if input is valid

        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
            setWicon(clearIcon);
        } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
            setWicon(cloudIcon);
        } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n" || data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
            setWicon(drizzleIcon);
        } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n" || data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
            setWicon(rainIcon);
        } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
            setWicon(snowIcon);
        } else {
            setWicon(clearIcon);
        }

        setMapKey(prevKey => prevKey + 1); // Increment key to force remount of the map component
    }

    return (
        <div className='container' style={{ height: weatherData ? '1050px' : '800px' }}>
            <form onSubmit={search}> {/* Apply onSubmit event to the form */}
                <div className="top-bar">
                    <input type="text" className='cityInput' placeholder='Enter City name' />
                    <button type="submit" className="search-icon"> {/* Use button instead of div */}
                        <img src={searchIcon} alt="" />
                    </button>
                </div>
            </form>

            {error ? ( // Display error message if error exists
                <div className="error-message">{error}</div>
            ) : weatherData ? (
                <>
                    <div className="weather-image">
                        <img src={wicon} alt="" />
                    </div>

                    <div className="temp">{weatherData.main.temp}°C</div>
                    <div className="location">{weatherData.name}</div>

                    <div className="data-container">
                        <div className="element">
                            <img src={humidityIcon} alt="" className='icon' />
                            <div className="data">
                                <div className="humidity">{weatherData.main.humidity}%</div>
                                <div className="text">Humidity</div>
                            </div>
                        </div>

                        <div className="element">
                            <img src={windIcon} alt="" className='icon' />
                            <div className="data">
                                <div className="wind-speed">{Math.floor(weatherData.wind.speed)} km/h</div>
                                <div className="text">Wind Speed</div>
                            </div>
                        </div>
                    </div>
                    <div className="map">
                        <LoadScript googleMapsApiKey="AIzaSyBu6lP_IxzDlbobpv-8OIOnVvWxUcweyrI&q=Space+Needle,Seattle+WA">
                            <GoogleMap
                                key={mapKey} // Key to force remount of the map component
                                mapContainerStyle={containerStyle}
                                center={{ lat: weatherData.coord.lat, lng: weatherData.coord.lon }}
                                zoom={10}
                            />
                        </LoadScript>
                    </div>
                </>
            ) : (
                <div className="weather-dashboard">Weather Dashboard</div>
            )}
        </div>
    )
}
