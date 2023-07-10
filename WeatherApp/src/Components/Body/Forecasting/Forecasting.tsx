import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GeneralFetch } from "../../../Service/request";
import Header from "../../Header/Header";

const Forecasting = () => {
    interface jsonDataTemplate {
        date: string,
        maxTemp: number,
        minTemp: number,
        windSpeed: number,
        windDir: number
      }
    
      const [data, setData] = useState<jsonDataTemplate[]>([]);
    
      useEffect(() => {
    
    
        fetchingAPI();
      }, []);
    
      async function fetchingAPI() {
        const jsonData = await GeneralFetch();
        const ans = [];
        for(let i = 0; i < jsonData["daily"]["time"].length; i++) {
          const data = {
            date: jsonData["daily"]["time"][i],
            maxTemp: jsonData["daily"]["temperature_2m_max"][i],
            minTemp: jsonData["daily"]["temperature_2m_min"][i],
            windSpeed: jsonData["daily"]["windspeed_10m_max"][i],
            windDir: jsonData["daily"]["winddirection_10m_dominant"][i]
          }
          ans.push(data);
        }
        console.log(ans);
      }

      return (
        <Header />
      );
};

const styles = StyleSheet.create({

});

export default Forecasting;
