const key = 'c776801ab12832a291a494178fce4a15'
const urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`
const urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`

// WIDGET MAIN ----------------------------------------------------------------------------
fetch(urlWetherCurrent)
  .then((response) => response.json())
  .then((data) => createWeatherCurrentItemValue(data))
  .catch(() => {})

// ---------------------------------------------------------------------------
function createWeatherCurrentItemValue(value) {
  const [
    city,
    windDeg,
    windSpeed,
    countryCode,
    time,
    temp,
    description,
    iconSrc,
    humidity,
    pressure,
    dayName,
    date,
  ] = [
    value.name,
    value.wind.deg,
    Math.round(value.wind.speed),
    value.sys.country,
    (new Date(value.dt * 1000).getHours() < 10 ? '0' : '') +
      new Date(value.dt * 1000).getHours() +
      ':' +
      (new Date(value.dt * 1000).getMinutes() < 10 ? '0' : '') +
      new Date(value.dt * 1000).getMinutes(),
    Math.round(value.main.temp - 273.15),
    value.weather[0].description,
    `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`,
    value.main.humidity,
    value.main.pressure,
    new Date(value.dt * 1000).toLocaleString('en-us', { weekday: 'long' }),
    new Date(value.dt * 1000).toLocaleString('en-us', {
      day: 'numeric',
    }) +
      ' ' +
      new Date(value.dt * 1000).toLocaleString('en-us', {
        month: 'short',
        year: 'numeric',
      }),
  ]

  let windName
  switch (true) {
    case windDeg > 337 && windDeg <= 22:
      windName = 'North'
      break
    case windDeg > 22 && windDeg <= 67:
      windName = 'North-East'
      break
    case windDeg > 67 && windDeg <= 112:
      windName = 'East'
      break
    case windDeg > 112 && windDeg <= 157:
      windName = 'East-South'
      break
    case windDeg > 157 && windDeg <= 202:
      windName = 'South'
      break
    case windDeg > 202 && windDeg <= 267:
      windName = 'South-West'
      break
    case windDeg > 267 && windDeg <= 292:
      windName = 'West'
      break
    case windDeg > 292 && windDeg <= 337:
      windName = 'West-North'
      break
  }

  new WidgetCurrent(
    city,
    countryCode,
    time,
    temp,
    description,
    iconSrc,
    dayName,
    date,
    pressure,
    humidity,
    windName,
    windSpeed
  )
}

// ---------------------------------------------------------------
class WidgetCurrent {
  constructor(
    city,
    countryCode,
    time,
    temp,
    description,
    iconSrc,
    dayName,
    date,
    pressure,
    humidity,
    windName,
    windSpeed
  ) {
    this.city = city
    this.countryCode = countryCode
    this.time = time
    this.description = description
    this.iconSrc = iconSrc
    this.dayName = dayName
    this.date = date
    this.pressure = pressure
    this.humidity = humidity
    this.windName = windName
    this.windSpeed = windSpeed
    this.resultTemp = temp == 0 ? '' + temp : temp > 0 ? '+' + temp : temp

    this.render()
  }

  createTemplate() {
    return `
    <div class="weather-side">
      <div class="weather-gradient"></div>
      <div class="date-container">
          <h2 class="date-dayname">${this.dayName}</h2>
          <span class="date-day">${this.date}</span>
          <span class="time">${this.time}</span>
          <i class="fas fa-map-marker-alt location-icon"></i>
          <span class="location">${this.city}, ${this.countryCode}</span>
      </div>
      <div class="weather-container">
          <img class="weather-icon" src="${this.iconSrc}" alt="weather icon">
          <h1 class="weather-temp">${this.resultTemp}&#8451;</h1>
          <h3 class="weather-desc">${this.description}</h3>
      </div>
    </div>
    <div class="info-side">
        <div class="today-info-container">
          <div class="today-info">
            <div class="pressure">
                <span class="title">PRESSURE</span>
                <span class="value">${this.pressure} hPa</span>
            </div>
            <div class="humidity">
                <span class="title">HUMIDITY</span>
                <span class="value">${this.humidity} %</span>
            </div>
            <div class="wind">
                <span class="title">WIND: ${this.windName}</span>
                <span class="value">${this.windSpeed} m/s</span>
            </div>
          </div>
        </div>
        <div class="week-container">
            <ul class="week-list"></ul>
        </div>
    </div>
  `
  }

  render() {
    document.querySelector('.container').innerHTML = this.createTemplate()
  }
}

// WIDGET ITEMS --------------------------------------------------------------------
fetch(urlWetherByDays)
  .then((response) => response.json())
  .then((data) => data.list.filter((item, index) => index % 8 == 4))
  .then((data) => createWeatherByDaysItemValue(data))

  .catch(() => {})

// -------------------------------------------------------------------
function createWeatherByDaysItemValue(days) {
  days.map((item) => {
    const [dayName, date, time, iconSrc, temp] = [
      new Date(item.dt * 1000).toLocaleString('en-us', {
        weekday: 'short',
      }),
      new Date(item.dt * 1000).toLocaleString('en-us', {
        day: 'numeric',
      }) +
        ' ' +
        new Date(item.dt * 1000).toLocaleString('en-us', {
          month: 'short',
        }),
      (new Date(item.dt * 1000).getHours() < 10 ? '0' : '') +
        new Date(item.dt * 1000).getHours() +
        ':' +
        (new Date(item.dt * 1000).getMinutes() < 10 ? '0' : '') +
        new Date(item.dt * 1000).getMinutes(),
      `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      Math.round(item.main.temp - 273.15),
    ]

    new WidgetByDays(dayName, date, time, iconSrc, temp)
  })
}

// ------------------------------------------------------------------
class WidgetByDays {
  constructor(dayName, date, time, iconSrc, temp) {
    this.dayName = dayName
    this.date = date
    this.time = time
    this.iconSrc = iconSrc
    this.temp = temp
    this.resultTemp = temp == 0 ? '' + temp : temp > 0 ? '+' + temp : temp

    this.render()
  }

  createItemTemplate() {
    return `
      <li class="active">
          <span class="day-name">${this.dayName}</span>
          <span class="month">${this.date}</span>
          <span class="time">${this.time}</span>
          <img class="day-icon" src="${this.iconSrc}" alt="weather icon">
          <span class="day-temp">${this.resultTemp}&#8451;</span>
      </li>
      `
  }

  render() {
    document.querySelector('.week-list').innerHTML += this.createItemTemplate()
  }
}
