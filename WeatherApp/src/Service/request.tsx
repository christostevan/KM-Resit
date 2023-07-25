import axios from "axios";
// Basic fetching function
export const forecasting = async (base_url: RequestInfo) => {
    try {
        const response = await fetch(base_url);
        if (!response.ok) {
            throw new Error("Error while retrieving data");
        }
        return response.json();
    } catch (err: any) {
        throw new Error("Error while fetching: " + err.message);
    }
};

export const UserFetch = async (base_url: RequestInfo, username: string, password: string) => {
    // try {
    //     const response = await fetch(base_url, {
    //         method: 'POST',
    //         body: JSON.stringify({username: "username", password: "password"}),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (!response.ok) {
    //         throw new Error("Fetching failed");
    //     }
    //     return response.json();
    // } catch(err: any) {
    //     throw new Error("Error while fetching: " + err.message);
    // }
    try {
        const response = await axios.post(base_url.toString(), {
          username: username,
          password: password
        });
        return response.data;
      } catch (error: any) {
        throw new Error("Error while fetching data: " + error.message);
      }
    
};

// Epic 1 Hourly forecasting
export const PrecipicationHourlyForecasting = async (city: string): Promise<any> => {
    const base_url = `https://km-resit-weatherapp.azurewebsites.net/currentWeather?city=${city}`;
    return forecasting(base_url);
};

export const DailyForecasting = async (city: string): Promise<any> => {
    const base_url = `https://km-resit-weatherapp.azurewebsites.net/nextDayWeather?city=New%20York`;
    return forecasting(base_url);
};

// Epic 2: Forecasting the weather for the next 10 days
export const ForecastFetch = async (city: string, days: number): Promise<any> => {
    let tomorrow: String = dateToString(getDatePlus(1));
    let tenDays: String = dateToString(getDatePlus(10));
    const base_url = `https://km-resit-weatherapp.azurewebsites.net/weatherForecast?city=${city}&days=${days}`;
    return forecasting(base_url);
};

// Fetching the city that the user will input
export const CityFetch = async (city: String): Promise<any> => {
    if (city === '' || city === null) {
        throw new Error("City cannot be null");
    }
    const base_url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    return forecasting(base_url);
};

// User authentication functionality
export const LoginFetch = async (username: string, password: string): Promise<any> => {
    if (username === '' || username === null) {
        throw new Error("Username cannot be null");
    }
    const base_url = `http://localhost:3000/database/login`;
    return UserFetch(base_url, username, password);
}

// Getting the Date from today + user input day 
export function getDatePlus(day: number): Date {
    if (day < 0 || day === null) {
        throw new Error("Day cannot be less than 0 or null");
    }
    const currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() + day);
    return currentDate;
};

// Convert Date to String in yy-mm-dd format
export function dateToString(date_object: Date): String {
    let dateString: string =
        date_object.getFullYear() +
        "-" +

        ((date_object.getMonth() + 1).toString().padStart(2, '0')) +
        "-" +
        (date_object.getDate()).toString().padStart(2, '0');
    return dateString;
};

// Forecasting historical data for avg temp and precipitation for the last 20 years
export const HistoricalFetch = async (city: string): Promise<any> => {
    const base_url = `https://km-resit-weatherapp.azurewebsites.net/weatherHistory?city=${city}`;
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
    const leapYear: Number[] = [1700, 1800, 1900, 2100];
    if (leapYear.includes(year)) {
        return false;
    } 
    return (year % 4) === 0;
};