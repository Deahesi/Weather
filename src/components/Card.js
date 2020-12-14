import React from 'react';
import {Link} from 'react-router-dom';

const Card = (props) => {
    return (
        <Link to={'/weather-card/' + props.id}>
            <div className="weather-card">
                <h3>{props.day}</h3>
                <div className="weather-card__info">
                    <img src={`https://openweathermap.org/img/wn/${props.weather[0].icon}@2x.png`} alt={props.weather}/>
                    <p>{props.max}'°C' <br/> <span>{props.min}°C</span></p>
                </div>
            </div>
        </Link>
    )
}

export default Card;