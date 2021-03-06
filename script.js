const key = 'c776801ab12832a291a494178fce4a15'
const urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`
const urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`

const widgetContainerElement = document.querySelector('.container')

// WIDGET MAIN ----------------------------------------------------------------------------
fetch(urlWetherCurrent)
  .then((response) => response.json())
  .then((data) => {
    const city = data.name
    const windDeg = data.wind.deg
    const windSpeed = Math.round(data.wind.speed)
    const countryCode = data.sys.country
    const time =
      (new Date(data.dt * 1000).getHours() < 10 ? '0' : '') +
      new Date(data.dt * 1000).getHours() +
      ':' +
      (new Date(data.dt * 1000).getMinutes() < 10 ? '0' : '') +
      new Date(data.dt * 1000).getMinutes()
    const temp = Math.round(data.main.temp - 273.15)
    const description = data.weather[0].description
    const iconSrc = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    const humidity = data.main.humidity
    const pressure = data.main.pressure
    const dayName = new Date(data.dt * 1000).toLocaleString('en-us', {
      weekday: 'long',
    })
    const date =
      new Date(data.dt * 1000).toLocaleString('en-us', {
        day: 'numeric',
      }) +
      ' ' +
      new Date(data.dt * 1000).toLocaleString('en-us', {
        month: 'short',
        year: 'numeric',
      })

    new WidgetCurrent(widgetContainerElement, {
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
    })
  })
  .catch(() => {})

// ---------------------------------------------------------------------------
class WidgetCurrent {
  constructor(containerElement, data) {
    this.containerElement = containerElement
    this.data = data

    this.render()
  }

  windName() {
    const windDeg = this.data.windDeg

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

    return windName
  }

  get template() {
    const windName = this.windName()
    const temp = this.data.temp
    const resultTemp = temp == 0 ? '' + temp : temp > 0 ? '+' + temp : temp

    return `
    <div class="weather-side">
      <div class="weather-gradient"></div>
      <div class="date-container">
          <h2 class="date-dayname">${this.data.dayName}</h2>
          <span class="date-day">${this.data.date}</span>
          <span class="time">${this.data.time}</span>
          <i class="fas fa-map-marker-alt location-icon"></i>
          <span class="location">${this.data.city}, ${this.data.countryCode}</span>
      </div>
      <div class="weather-container">
          <img class="weather-icon" src="${this.data.iconSrc}" alt="weather icon">
          <h1 class="weather-temp">${resultTemp}&#8451;</h1>
          <h3 class="weather-desc">${this.data.description}</h3>
      </div>
    </div>
    <div class="info-side">
        <div class="today-info-container">
          <div class="today-info">
            <div class="pressure">
                <span class="title">PRESSURE</span>
                <span class="value">${this.data.pressure} hPa</span>
            </div>
            <div class="humidity">
                <span class="title">HUMIDITY</span>
                <span class="value">${this.data.humidity} %</span>
            </div>
            <div class="wind">
                <span class="title">WIND: ${windName}</span>
                <span class="value">${this.data.windSpeed} m/s</span>
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
    this.containerElement.insertAdjacentHTML('beforeend', this.template)
  }
}

// WIDGET ITEMS --------------------------------------------------------------------
fetch(urlWetherByDays)
  .then((response) => response.json())
  .then((data) => data.list.filter((item, index) => index % 8 == 4))
  .then((data) =>
    data.map((item) => {
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

      new WidgetByDays({ dayName, date, time, iconSrc, temp })
    })
  )
  .catch(() => {})

// ------------------------------------------------------------------
class WidgetByDays {
  constructor(data) {
    this.data = data

    this.render()
  }

  get template() {
    const temp = this.data.temp
    const resultTemp = temp == 0 ? '' + temp : temp > 0 ? '+' + temp : temp
    return `
      <li class="active">
          <span class="day-name">${this.data.dayName}</span>
          <span class="month">${this.data.date}</span>
          <span class="time">${this.data.time}</span>
          <img class="day-icon" src="${this.data.iconSrc}" alt="weather icon">
          <span class="day-temp">${resultTemp}&#8451;</span>
      </li>
      `
  }

  render() {
    document
      .querySelector('.week-list')
      .insertAdjacentHTML('beforeend', this.template)
  }
}
