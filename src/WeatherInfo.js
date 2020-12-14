import React from 'react';
import Loader from "./components/Loader";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weather: {},
            loading: true,
            day: ''
        };
    }

    async componentDidMount() {
        let weather = await (await fetch('http://api.openweathermap.org/data/2.5/forecast?q=Novosibirsk&lang=ru&appid=64ced8a036cd119e302ec9dabf214288&units=metric')).json()
        weather = weather.list.map((obj) => ({
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
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const weatherDay = [];
        const dateByParams = new Date(this.props.match.params.id);
        for (let weatherObj of weather) {
            if (weatherObj.date.getDay() === dateByParams.getDay()) {
                weatherDay.push(weatherObj)
            }
        }
        this.setState({
            weather: weatherDay,
            loading: false,
            day: days[dateByParams.getDay()],
        })
    }

    generateInfoCard(weather) {
        const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(weather.date)
        return (
            <div className="weather-card" key={time}>
                <h3>{time}</h3>
                <div className="weather-card__info">
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather} />
                    <p>{weather.temp.current}'°C'</p>
                </div>
            </div>
        )
    }

    generateCards() {
        const cards = []
        for (let weather of this.state.weather) {
            cards.push(
                this.generateInfoCard(weather)
            )
        }
        return cards
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        } else {
            return (
                <div className="weather-info">
                    <h1>{this.state.day}</h1>
                    <div>
                        <div className="weather-card">
                            <div className="cards-container">
                                {this.generateCards()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Info;