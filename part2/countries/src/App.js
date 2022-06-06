import axios from 'axios'
import { useEffect, useState } from 'react'


function App() {
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [query, setQuery] = useState("")

  


  useEffect(() => {
    axios
    .get("https://restcountries.com/v3.1/all")
    .then(response => {
      console.log('country promise fulfilled')
      setCountries(response.data)
    })
  }, [])

  const handleQueryChange = (event) => {
    const search = event.target.value
    setQuery(search)
    setCountriesToShow(
      countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
    )
    console.log(countriesToShow)
  }

  const CountryPage =({country}) => {
    return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]} </p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      {Object.values(country.languages).map((language,i) => (<li key={i}>{language}</li>))}
      <img src={country.flags.png} alt="country flag not available"/>
      <Weather city={country.capital[0]}/>
    </div>
    )
  }

  const CountriesList = () => {
    return (
      countriesToShow.map(country => 
      <div key={country.name.common}>
        {country.name.common}
        <button onClick={()=>setCountriesToShow([country])}>show</button>
      </div>
      )
    )
  }

  const Weather = ({city}) => {
    const api_key = process.env.REACT_APP_API_KEY
    const [weather, setWeather] = useState([])
    useEffect(() => {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
      .then(response => {
        console.log('weather promise fulfilled')
        setWeather(response.data)
      })
    }, [])

    if (weather.main){
      return(
        <div>
          <h2>Weather in {city}</h2>
          <p>temperature {weather.main.temp} Celcius</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon not available"/>
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )
    }
  }


  return (
    <div>
      <p>find countries<input value={query} onChange={handleQueryChange}/></p>
      {countriesToShow.length === 1? <CountryPage country={countriesToShow[0]} />: 
      countriesToShow.length > 10? <p>Too many matches, specify another filter</p> : 
      <CountriesList />
      }
    </div>
  );
}

export default App;
