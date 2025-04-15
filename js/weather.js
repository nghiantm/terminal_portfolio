async function getUserWeather() {
    try {
        const locationResponse = await fetch("https://ipinfo.io/loc");
        if (!locationResponse.ok) {
          throw new Error("Location response was not ok: " + locationResponse.statusText);
        }
        const data = await locationResponse.text();

        // split into longitude and latitude
        const location = data.split(",");
        console.log("Location: " + location[0] + ", " + location[1]);
        const weatherUrl = constructWeatherUrl(location[0].trim(), location[1].trim());
        console.log("Weather URL: " + weatherUrl);

        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error("Weather response was not ok: " + weatherResponse.statusText);
        }
        const weatherData = await weatherResponse.json();
        console.log("Weather Data: ", weatherData);
        const pattern = await selectPattern(weatherData.current);
        console.log(pattern[0].join("\n"), pattern[1]);
    } catch (error) {
        console.error("Error fetching location:", error);
    }
}

// This function selects the weather pattern based on the current weather data
// It checks for precipitation -> wind speed -> cloud cover -> and day/night status                                       
function selectPattern(currentWeather) {
    if (currentWeather.precipitation > 0) {
        if (currentWeather.snowfall > currentWeather.rain) {
            return [weatherPatterns.snow, "Snowy"];
        } else {
            if (currentWeather.rain > DRIZZLE) {
                return [weatherPatterns.rain, "Rainy"];
            } else {
                return [weatherPatterns.drizzle, "Drizzle"];
            }
        }
    } else if (currentWeather.wind_speed_10m > HIGH_WIND) {
        return [weatherPatterns.wind, "Windy"];
    } else if (currentWeather.cloud_cover > CLOUDY) {
        return [weatherPatterns.clouds, "Cloudy"];
    } else {
        if (currentWeather.is_day) {
            return [weatherPatterns.sunny, "Sunny"];
        }
        return [weatherPatterns.night, "Night"];
    }
}

function constructWeatherUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,temperature_2m,apparent_temperature,wind_speed_10m,precipitation,snowfall,rain,cloud_cover&timezone=auto&forecast_days=1`;
}


const HIGH_WIND = 20; // km/h
const DRIZZLE = 0.5; // mm/h
const CLOUDY = 50; // %
const weatherPatterns = {
    sunny: [
        "  \\ | /   ",
        "  - O -   ",
        "  / | \\   "
    ],
    partial_clouds: [
        "  \\ /(  ) ",
        " - O(    )",
        "  / (  )  ",
    ],
    clouds: [
        "  ( )()_  ",
        " (      ) ",
        "  (  )()  "
    ],
    night: [
        "   .   *  ",
        " *    . O ",
        " . . *  . "
    ],
    drizzle: [
        " '  '    '",
        "  '   ' ' ",
        "'    '   '"
    ],
    rain: [
        " ' '' ' ' ",
        " '' ' ' ' ",
        " ' ' '' ' "
    ],
    thunderstorm: [
        " ''_/ _/' ",
        " ' / _/' '",
        " /_/'' '' "
    ],
    chaos: [
        " c__ ''' '",
        " ' '' c___",
        " c__ ' 'c_"
    ],
    snow: [
        " * '* ' * ",
        " '* ' * ' ",
        " *' * ' * "
    ],
    fog: [
        " -- _ --  ",
        " -__-- -  ",
        " - _--__  "
    ],
    wind: [
        " c__ -- _ ",
        " -- _-c__ ",
        " c --___c "
    ]
};