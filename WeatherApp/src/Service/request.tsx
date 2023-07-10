
export const ForecastFetch = async (): Promise<any> => {
    let tomorrow: String = dateToString(getDatePlus(1));
    console.log(tomorrow);
    let tenDays: String = dateToString(getDatePlus(10));
    console.log(tenDays);
    const base_url = `https://api.open-meteo.com/v1/forecast?latitude=52.7792&longitude=6.9069&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&start_date=${tomorrow}&end_date=${tenDays}`;
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

export const CityFetch = async (city: String): Promise<any> => {
    try {

        if (city === null) {
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

// Return the Date with days ahead
function getDatePlus(day: number): Date {
    if (day < 0 || day === null) {
        throw new Error("Day cannot be less than 0 or null");
    }
    const currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() + day);
    return currentDate;
}

function dateToString(date_object: Date): string {
    let dateString: string =
        date_object.getFullYear() +
        "-" +
        ((date_object.getMonth() + 1).toString().padStart(2, '0')) +
        "-" +
        date_object.getDate();
    return dateString;
}