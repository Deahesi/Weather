import React from 'react';
import Card from "./components/Card";
import {Route, BrowserRouter} from "react-router-dom";
import Loader from "./components/Loader";
import Info from "./WeatherInfo";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherInfo: {},
            weatherFormatted: {},
            loading: true
        }
    }
    
    async componentDidMount() {
        let weatherInfoState = Object.assign({}, this.state.weatherInfo);
        const weather = await (await fetch('http://api.openweathermap.org/data/2.5/forecast?q=Novosibirsk&lang=ru&appid=64ced8a036cd119e302ec9dabf214288&units=metric')).json()
        weatherInfoState = weather.list.map((obj) => ({
            clouds: obj.clouds,
            date: new Date(obj.dt_txt),
            tempFeelsLike: obj.main.feels_like,
            pressure: obj.main.pressure,
            temp: {
                min: obj.main.temp_min,
                max: obj.main.temp_max,
                current: obj.main.temp,
            },
            wind: {
                ...obj.wind
            },
            weather: obj.weather
        }));
        
        const weatherDays = [];
        
        weatherDays[0] = weatherInfoState[0]
        
        weatherInfoState.reduce((accumulator, current) => {
            if (accumulator.date.getDay() !== current.date.getDay()) {
                weatherDays.push(current)
                return current
            } else {
                return accumulator
            }
        });
        
        this.setState({weatherInfo: weatherInfoState, weatherFormatted: weatherDays, loading: false});
    }
    
    generateCard(weather) {
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        return (
            <Card id={weather.date.toJSON()} day={days[weather.date.getDay()]} key={weather.date.toJSON()}
                  min={weather.temp.min} max={weather.temp.max} weather={weather.weather}/>
        )
    }
    
    generateCards() {
        const cards = []
        for (let weather of this.state.weatherFormatted) {
            cards.push(
                this.generateCard(weather)
            )
        }
        return cards
    }
    
    render() {
        if (this.state.loading) {
            return <Loader/>
        } else {
            return (
                <BrowserRouter>
                    <Route exact path="/" component={() =>
                        <div className="cards-container">
                            {this.generateCards()}
                        </div>
                    }/>
                    <Route exact path="/weather-card/:id" component={Info}/>
                </BrowserRouter>
            )
        }
        
    }
}

export default App;
