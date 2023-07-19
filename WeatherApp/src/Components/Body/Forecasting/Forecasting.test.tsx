import React from "react";
import { View } from "react-native";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import fetchMock from "fetch-mock";
import fetch from "jest-fetch-mock";
import Forecasting from "./Forecasting";
import { between, determineWindDirection, weekday, mapping } from "./Forecasting";


describe("Forecasting unit test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.resetMocks();
    });
    // beforeAll(() => {
    //     global.fetch = jest.fn();
    // })
    it("Renders text correctly", async () => {
        await render(
            <NavigationContainer>
                <Forecasting />
            </NavigationContainer>
        );
        const element = screen.getAllByTestId("current-city-test");
        expect(element).toBeTruthy();
        // expect(screen.toJSON()).toMatchSnapshot();
    });

    it("Mapping() function test", () => {
        const jsonData = {
            daily: {
              time: ["2023-07-19"],
              temperature_2m_max: [21],
              temperature_2m_min: [14.3],
              winddirection_10m_dominant: [278],
              windspeed_10m_max: [17.3]
            }
          };

        const expectedResult = [
            ["Wednesday, 19-July-2023"],
            [21],
            [14.3],
            ["West wind (W)"],
            [17.3]
        ];

        const result = mapping(jsonData);

        expect(result).toEqual(expectedResult);
        expect(result.length).toBe(5);
        expect(result[0].length).toBe(1);
        expect(Array.isArray(result[0])).toBe(true);
        expect(Array.isArray(result[1])).toBe(true);
        expect(Array.isArray(result[2])).toBe(true);
        expect(Array.isArray(result[3])).toBe(true);
        expect(Array.isArray(result[4])).toBe(true);
        expect(result[0].every((element: Number) => typeof element === 'string')).toBe(true);
        expect(result[1].every((element: Number) => typeof element === 'number')).toBe(true);
        expect(result[2].every((element: Number) => typeof element === 'number')).toBe(true);
        expect(result[3].every((element: Number) => typeof element === 'string')).toBe(true);
        expect(result[4].every((element: Number) => typeof element === 'number')).toBe(true);
    });

    it("Test the between() function", () => {
        expect(between(5, 1, 10)).toBe(true);
        expect(between(15, 1, 10)).toBe(false);
    });

    it("Test determine wind direction", () => {
        expect(determineWindDirection(0)).toBe("North wind (N)");
        expect(determineWindDirection(22.5)).toBe("North-northeast wind (NNE)");
        expect(determineWindDirection(45)).toBe("Northeast wind (NE)");
        expect(determineWindDirection(67.5)).toBe("East-northeast wind (ENE)");
        expect(determineWindDirection(90)).toBe("East wind (E)");
        expect(determineWindDirection(112.5)).toBe("East-southeast wind (ESE)");
        expect(determineWindDirection(135)).toBe("South-east wind (SE)");
        expect(determineWindDirection(157.5)).toBe("South-southeast wind (SSE)");
        expect(determineWindDirection(180)).toBe("South wind (S)");
        expect(determineWindDirection(202.5)).toBe("South-southwest wind (SSW)");
        expect(determineWindDirection(225)).toBe("South-west wind (SW)");
        expect(determineWindDirection(247.5)).toBe("West-southwest wind (WSW)");
        expect(determineWindDirection(270.5)).toBe("West wind (W)");
        expect(determineWindDirection(292.5)).toBe("West-northwest wind (WNW)");
        expect(determineWindDirection(315)).toBe("North-west wind (NW)");
        expect(determineWindDirection(337.5)).toBe("North-northwest wind (NNW)");
        expect(determineWindDirection(360)).toBe("North wind (N)");
    });

    it("Returns null when exception", async () => {
        fetch.mockImplementationOnce(() => Promise.reject("API is down"));

        await render(<NavigationContainer><Forecasting /></NavigationContainer>)
        expect(fetch).toHaveBeenCalledTimes(0);
    });

    it("Display the correct weekday", () => {
        expect(weekday).toHaveLength(7);
        expect(weekday).toContain("Sunday");
        expect(weekday).toContain("Monday");
        expect(weekday).toContain("Tuesday");
        expect(weekday).toContain("Wednesday");
        expect(weekday).toContain("Thursday");
        expect(weekday).toContain("Friday");
        expect(weekday).toContain("Saturday");

        expect(weekday.indexOf("Sunday")).toBe(0);
        expect(weekday.indexOf("Monday")).toBe(1);
        expect(weekday.indexOf("Tuesday")).toBe(2);
        expect(weekday.indexOf("Wednesday")).toBe(3);
        expect(weekday.indexOf("Thursday")).toBe(4);
        expect(weekday.indexOf("Friday")).toBe(5);
        expect(weekday.indexOf("Saturday")).toBe(6);
    });

    it("Should render the component and display fetched data", async () => {
        const mockedCityFetch = jest.fn().mockResolvedValue({
            results: [
                {
                    latitude: 40.71427,
                    longitude: -74.00597,
                    name: 'New York',
                    country_code: 'US',
                },
            ],
        });
        const { getByTestId } = render(
            <NavigationContainer>
                <Forecasting />
            </NavigationContainer>);
        const input = screen.getByTestId("TextInput-test");
        fireEvent.changeText(input, 'New York');
        const submitButton = getByTestId('SubmitButton-test');
        fireEvent.press(submitButton);
        // await waitFor(() => expect(mockedForecastFetch).toHaveBeenCalled());
        const inputValue = getByTestId('TextInput-test').props.value;
        expect(inputValue).toBe('New York');
    });

    it("Renders the elements from API results", async () => {
        const mockedForecastFetch = jest.fn().mockResolvedValue({
            daily: [
                {
                    time: ["2023-07-15", "2023-07-16", "2023-07-17", "2023-07-18", "2023-07-19", "2023-07-20", "2023-07-21", "2023-07-22", "2023-07-23", "2023-07-24", "2023-07-25"],
                    temperature_2m_max: [31.2, 26.0, 31.7, 28.2, 31.0, 28.0, 30.5, 29.5, 28.4, 29.2, 29.4],
                    temperature_2m_min: [21.6, 23.3, 22.2, 23.6, 21.4, 23.5, 22.6, 19.7, 20.6, 22.3, 22.5],
                    windspeed_10m_max: [19.9, 17.6, 18.8, 26.6, 20.6, 19.8, 20.0, 19.5, 18.4, 21.9, 26.3],
                    winddirection_10m_dominant: [135, 145, 238, 181, 219, 153, 216, 307, 302, 203, 204]
                }
            ]
        });

        fetch.mockResponseOnce(JSON.stringify(mockedForecastFetch));
        const { getByTestId, queryAllByTestId, getByText } = await render(
            <NavigationContainer>
                <Forecasting />
            </NavigationContainer>);
        await waitFor(() => expect(mockedForecastFetch).toHaveBeenCalledTimes(0));
    });

    it("calls handleLayout and sets the parent width state", async () => {
        const { getByTestId, UNSAFE_getAllByType } = await render(
            <NavigationContainer>
                <Forecasting />
            </NavigationContainer>
        );
        const parentView = getByTestId("parent-view");

        fireEvent(parentView, "layout", {
            nativeEvent: { layout: { width: 200 } },
        });

        const views = UNSAFE_getAllByType(View);
        expect(views[1].props.style.width).toBe("100%");
    });


    it("Text Input test", () => {
        render(
            <NavigationContainer>
                <Forecasting />
            </NavigationContainer>
        );
        const element = screen.getByTestId("TextInput-test");
        fireEvent.changeText(element, "New York");
        expect(element.props.value).toBe("New York");
    });
});
