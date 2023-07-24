import React from "react";
import { View } from "react-native";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import fetchMock from "fetch-mock";
import fetch from "jest-fetch-mock";
import Historical from "./Historical";
import { mapping } from "./Historical";
import { HistoricalFetch } from "../../../Service/request";

describe("Historical unit test", () => {
    jest.mock('../../../Service/request', () => ({
        HistoricalFetch: jest.fn(),
    }));

    it("Renders text correctly", async () => {
        const { getByText, getByPlaceholderText } = await render(
            <NavigationContainer>
                <Historical />
            </NavigationContainer>
        );
        const element = screen.getAllByTestId("cityName-test");
        expect(element).toBeTruthy();
        expect(getByText('Current city: Emmen, NL')).toBeTruthy();
        expect(getByText('Average temp (°C)')).toBeTruthy();
        expect(getByPlaceholderText('Input your city here....')).toBeTruthy();
        expect(getByText('Set units in Celcius')).toBeTruthy();
        expect(getByText('Apply')).toBeTruthy();
        expect(getByText('Date')).toBeTruthy();
        expect(getByText('Average Precipitation (mm)')).toBeTruthy();
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it("Mapping test test", async () => { 
        const jsonData = {
            daily: {
              time: ["2003-07-01"],
              temperature_2m_mean: [16.5],
              precipitation_sum: [8],
            },
          };

          const isCelcius = true;
          const result = mapping(jsonData, isCelcius);
      
          // Assertions for the expected output
          expect(result.size).toBe(1);
          expect(result.get('July-2003')).toEqual({
            temperature: 16.5,
            precipitation: 8,
            days: 1,
          });  
    });

    it("calls handleLayout and sets the parent width state", async () => {
        const { getByTestId, UNSAFE_getAllByType } = await render(
            <NavigationContainer>
                <Historical />
            </NavigationContainer>
        );
        const parentView = getByTestId("parent-view");

        fireEvent(parentView, "layout", {
            nativeEvent: { layout: { width: 200 } },
        });

        const views = UNSAFE_getAllByType(View);
        expect(views[1].props.style.width).toBe("100%");
    });

});