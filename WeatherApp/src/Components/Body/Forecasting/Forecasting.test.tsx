import React from "react";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Forecasting from "./Forecasting";
import { CityFetch, ForecastFetch } from "../../../Service/request";
import { between } from "./Forecasting";
import { determineWindDirection } from "./Forecasting";

describe("Forecasting unit test", () => {
    jest.mock('../../../Service/request', () => ({
        CityFetch: jest.fn(),
        ForecastFetch: jest.fn(),
      }));

    let navigationMock;
    beforeEach(() => {
        navigationMock = {
            navigate: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Renders text correctly", () => {
        render(
            <NavigationContainer>
                <Forecasting />
            </NavigationContainer>
        );
        const element = screen.getAllByTestId("Date-test");
        expect(element).toBeTruthy();
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

    // test('handles form submission correctly', async () => {
    //     const mockedCityFetch = CityFetch as jest.MockedFunction<typeof CityFetch>;
    //     const mockedForecastFetch = ForecastFetch as jest.MockedFunction<typeof ForecastFetch>;
      
    //     mockedCityFetch.mockResolvedValue({
    //       results: [
    //         {
    //           latitude: 52.78,
    //           longitude: 6.9,
    //           name: 'Emmen',
    //           country_code: 'NL',
    //         },
    //       ],
    //     });
      
    //     mockedForecastFetch.mockResolvedValue({
    //       daily: {
    //         time: [123456789],
    //         temperature_2m_max: [22.5],
    //         temperature_2m_min: [13.4],
    //         winddirection_10m_dominant: [18.9],
    //         windspeed_10m_max: [194],
    //       },
    //     });
      
    //     const { getByTestId } = render(<Forecasting />);
    //     const submitButton = getByTestId('SubmitButton-test');
    //     const textInput = getByTestId('TextInput-test');
      
    //     fireEvent.changeText(textInput, 'New York');
    //     fireEvent.press(submitButton);
      
    //     // Add your assertions here to verify the component behavior after form submission
    //   });

    // it("Fetches data correctly for city fetch", async () => {
    //     const mockCityFetch = jest.fn().mockResolvedValueOnce({
    //         results: [
    //             {
    //                 latitude: 40.71427,
    //                 longitude: -74.00597,
    //                 name: 'New York',
    //                 country_code: 'US',
    //             },
    //         ],
    //     });
    //     jest.mock("../../../Service/request", () => {
    //         CityFetch: mockCityFetch;
    //     })

    //     const { getByTestId, getByText } = render(
    //         <NavigationContainer><Forecasting /></NavigationContainer>);

    //     const input = getByTestId('TextInput-test');
    //     fireEvent.changeText(input, 'New York');

    //     const submitButton = getByTestId("SubmitButton-test");
    //     fireEvent.press(submitButton);

    //     await Promise.resolve(); // Resolve any pending promises

    //     // Check if the component state is updated correctly
    //     expect(input.props.value).toBe('New York');
    //     expect(mockCityFetch).toHaveBeenCalledWith('New York');
    // });

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