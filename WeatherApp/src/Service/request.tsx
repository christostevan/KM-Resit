// Forecasting the weather for the next 10 days
export const ForecastFetch = async (latitude: Number, longitude: Number): Promise<any> => {
    // If user hasn't set up the city yet; the initial city is Emmen, NL
    if (latitude === 0 && longitude === 0) {
        latitude = 52.7792;
        longitude = 6.9069;
    }
    let tomorrow: String = dateToString(getDatePlus(1));
    let tenDays: String = dateToString(getDatePlus(10));
    const base_url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toString()}&longitude=${longitude.toString()}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&start_date=${tomorrow}&end_date=${tenDays}`;
    console.log(base_url);
    try {
        const response = await fetch(base_url);
        if (!response.ok) {
            throw new Error("Error while retrieving data");
        }
        return response.json();
    } catch (err: any) {
        throw new Error("Error while fetching: " + err.message);
    }
}

// Fetching the city that the user will input
export const CityFetch = async (city: String): Promise<any> => {
    try {
        if (city === '' || city === null) {
            throw new Error("City cannot be null");
        }
        const base_url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const response = await fetch(base_url);
        if (!response.ok) {
            throw new Error("Error while retrieving data");
        }
        return response.json();
    } catch(err: any) {
        throw new Error("Error while fetching" + err.message);
    }

}

// Getting the Date from today + user input day 
function getDatePlus(day: number): Date {
    if (day < 0 || day === null) {
        throw new Error("Day cannot be less than 0 or null");
    }
    const currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() + day);
    return currentDate;
}

// Convert Date to String in yy-mm-dd format
function dateToString(date_object: Date): String {
    let dateString: string =
        date_object.getFullYear() +
        "-" +

        ((date_object.getMonth() + 1).toString().padStart(2, '0')) +
        "-" +
        date_object.getDate();
    return dateString;
}