async function getUserWeather() {
    try {
        const location = await fetchUserLocation();
        console.log("Location: " + location.latitude + ", " + location.longitude);
        
        const weatherData = await fetchWeatherData(location.latitude, location.longitude);

        const weather = await printWeather(weatherData);
        return weather; // Return the weather information as an array of lines
    } catch (error) {
        console.error("Error fetching location:", error);
    }
}

async function formatWeather(weatherData) {
    const currentWeather = weatherData.current;
    /**
     * Formats weather information for printing to the terminal.
     * The ASCII art is selected using the selectPattern() function.
     */

    const temperature = `${Math.round(currentWeather.temperature_2m)}°C`;
    const feelsLike = `${Math.round(currentWeather.apparent_temperature)}°C`;
    const windSpeed = `${Math.round(currentWeather.wind_speed_10m)} kmh`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedAddress = await reverseGeocoding(weatherData.latitude, weatherData.longitude);

    const [asciiArt, description] = await selectPattern(currentWeather);

    const weatherText = [
        `${temperature.padEnd(13)} feels like ${feelsLike}`,
        `${description.padEnd(13)} wind ${windSpeed}`,
        `${time.padEnd(13)} ${formattedAddress}`,
    ];

    return { weatherText, asciiArt };
}

async function reverseGeocoding(latitude, longitude) {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&type=city&limit=1&format=json&apiKey=954a507c914e43de9a20c2a20e52877d`);
    if (!response.ok) {
        throw new Error(`Failed to fetch reverse geocoding data: ${response.statusText}`);
    }
    const responseJson = await response.json();
    return responseJson.results[0].formatted; // Return the results if needed
}

async function printWeather(currentWeather) {
    /**
     * Outputs weather information as an array of lines.
     */

    const { weatherText, asciiArt } = await formatWeather(currentWeather);

    // Combine ASCII art and weather text line by line
    const outputLines = asciiArt.map((line, index) => {
        return `${line}  ${weatherText[index] || ''}`;
    });

    return outputLines; // Return the array of lines
}

// Helper function to fetch the user's location
async function fetchUserLocation() {
    const locationResponse = await fetch("https://ipinfo.io/loc");
    if (!locationResponse.ok) {
        throw new Error("Location response was not ok: " + locationResponse.statusText);
    }
    const data = await locationResponse.text();
    const location = data.split(",");
    return { latitude: location[0].trim(), longitude: location[1].trim() };
}

// Helper function to fetch weather data
async function fetchWeatherData(latitude, longitude) {
    const weatherUrl = constructWeatherUrl(latitude, longitude);

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
        throw new Error("Weather response was not ok: " + weatherResponse.statusText);
    }
    const weatherData = await weatherResponse.json();
    return weatherData;
}

// This function selects the weather pattern based on the current weather data
// It checks for precipitation -> wind speed -> cloud cover -> and day/night status   
// Return format: [ascii art, weather description]
// If no pattern is found, it returns a chaos pattern                                
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
    } else if (currentWeather.is_day) {
            return [weatherPatterns.sunny, "Sunny"];
    } else if (!currentWeather.is_day) {
        return [weatherPatterns.night, "Night"];
    } else {
        return [weatherPatterns.chaos, "????"];
    }
}

function constructWeatherUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,temperature_2m,apparent_temperature,wind_speed_10m,precipitation,snowfall,rain,cloud_cover&timezone=auto&forecast_days=1`;
}

const HIGH_WIND = 25; // km/h
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
        "  -O(   ) ",
        "  / (  )  ",
    ],
    clouds: [
        " (  )( )_ ",
        " (      ) ",
        " (   )( ) "
    ],
    night: [
        "   .   *  ",
        " *    . O  ",
        " . . *  .  "
    ],
    drizzle: [
        " '  '    ' ",
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
        " c__ ''' ' ",
        " ' '' c___ ",
        " c__ ' 'c_ "
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