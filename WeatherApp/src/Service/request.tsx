// Basic fetching function
const forecasting = async (base_url: RequestInfo) => {
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

// Forecasting for the audible alarm (hourly and daily forecast)
export const DailyForecast = async () => {
    const base_url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation,rain,snowfall,snow_depth&daily=weathercode&timezone=auto&start_date=2023-07-12&end_date=2023-07-13`;
    return forecasting(base_url);
};

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
    return forecasting(base_url);
};

// Fetching the city that the user will input
export const CityFetch = async (city: String): Promise<any> => {
    if (city === '' || city === null) {
        throw new Error("City cannot be null");
    }
    const base_url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const response = await fetch(base_url);
    return forecasting(base_url);
};

// Getting the Date from today + user input day 
function getDatePlus(day: number): Date {
    if (day < 0 || day === null) {
        throw new Error("Day cannot be less than 0 or null");
    }
    const currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() + day);
    return currentDate;
};

// Convert Date to String in yy-mm-dd format
function dateToString(date_object: Date): String {
    let dateString: string =
        date_object.getFullYear() +
        "-" +

        ((date_object.getMonth() + 1).toString().padStart(2, '0')) +
        "-" +
        (date_object.getDate()).toString().padStart(2, '0');
    return dateString;
};

// Forecasting historical data for avg temp and precipitation for the last 20 years
export const HistoricalFetch = async (latitude: Number, longitude: Number): Promise<any> => {
    // If user hasn't set up the city yet; the initial city is Emmen, NL
    if (latitude === 0 && longitude === 0) {
        latitude = 52.7792;
        longitude = 6.9069;
    }

    // For determining the date (always date 1 for the start date, and date 31/30/29/28 for the end date)
    let today: Date = new Date();
    today.setMonth(today.getMonth() - 1);
    if (today.getMonth() === 2) {
        if (determineLeapYear(today.getFullYear())) {
            today.setDate(29);
        } else {
            today.setDate(28);
        }
    } else {
        if (determineMonth(today.getMonth())) {
            today.setDate(31);
        } else {
            today.setDate(30);
        }
    }
    let todayString: String = dateToString(today);
    let twentyYears: Date = today;
    twentyYears.setFullYear(today.getFullYear() - 3);
    twentyYears.setDate(1);
    let twentyYearsString: String = dateToString(twentyYears);

    const base_url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${twentyYearsString}&end_date=${todayString}&daily=temperature_2m_mean,precipitation_sum&timezone=GMT`;
    return forecasting(base_url);
};

// For determining which days does a month has
export function determineMonth(month: number): boolean {
    switch (month) {
        case 0: // Jan
            return true;
            break;
        case 1: // Feb
            return false;
            break;
        case 2: // Mar
            return true;
            break;
        case 3: // April
            return false;
            break;
        case 4: // May
            return true;
            break;
        case 5: // Jun
            return false;
            break;
        case 6: // Jul
            return true;
            break;
        case 7: // Aug
            return true;
            break;
        case 8: // Sep
            return false;
            break;
        case 9: // Oct
            return true;
            break;
        case 10: // Nov
            return false;
            break;
        case 11: // Dec
            return true;
            break;
        default:
            return false;
            break;
    }


};

// Determine if it is a leap year or not
export function determineLeapYear(year: number): boolean {
    return (year % 4) === 0;
};