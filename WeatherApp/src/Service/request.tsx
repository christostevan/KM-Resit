
const base_url = "https://api.open-meteo.com/v1/forecast?latitude=52.7792&longitude=6.9069&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&start_date=2023-07-11&end_date=2023-07-20";

export const GeneralFetch = async () => {
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