import React from "react";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import Alarm from "./Alarm";
import { scheduleNotificationAsync } from "../../../__mocks__/expo-notifications";
import { jest } from '@jest/globals';
import { scheduleNotification, fecthAPIDaily, fetchAPIHourly } from "./Alarm";
import { PrecipicationHourlyForecasting } from "../../../Service/request";

jest.mock('expo-notifications');

jest.mock('../../../Service/request', () => ({
    PrecipicationHourlyForecasting: jest.fn(),
    DailyForecasting: jest.fn(),
}));

describe("Forecasting unit test", () => {
    // it("Renders text correctly", async () => {
    //     await render(<Alarm cityName="Emmen" />);
    //     const element = screen.getAllByTestId("alarm-test");
    //     expect(element).toBeTruthy();
    // });

    it("Schedule notification test", () => {
        const time = new Date('2023-07-25T12:00:00');
        const description = 'Heavy rain';

        // Call the function to be tested
        scheduleNotification(time, description);

        // Assert that scheduleNotificationAsync was called with the correct arguments
        expect(scheduleNotificationAsync).toHaveBeenCalledWith({
            content: {
                title: 'Bad weather',
                body: description + ' is expected',
            },
            trigger: {
                date: time,
            },
        });
    });

    it("Fetching function test", async () => {
        const cityName = 'Test City';
        const jsonData = {
            result: false,
            // type: 'Weather Type', // Commented out for this test as we don't need the type property
        };
        // Mock the API function to return the expected data
        (require('./../../../Service/request').DailyForecasting as jest.Mock).mockResolvedValue(jsonData as never);

        // Call the function
        await fecthAPIDaily(cityName);

        // Assert that scheduleNotification was not called
        expect(scheduleNotificationAsync).toHaveBeenCalled();

    });

    it('should call scheduleNotification when the API response is valid', async () => {
        let cityName = 'Test City';
        let jsonData = {
            report: "null",
            timezone: "GMT",
            time: "11:00"
        };
        // Mock the API function to return the expected data
        (require('./../../../Service/request').PrecipicationHourlyForecasting as jest.Mock).mockResolvedValue(jsonData as never);

        // Call the function
        await fetchAPIHourly(cityName);
        expect(scheduleNotificationAsync).toHaveBeenCalled();


        let jsonDataFalse = {
            report: true,
        };
        // Mock the API function to return the expected data
        (require('./../../../Service/request').PrecipicationHourlyForecasting as jest.Mock).mockResolvedValue(jsonDataFalse as never);

        // Call the function
        await fetchAPIHourly(cityName.toString());
        // Assert that scheduleNotification was not called
        expect(scheduleNotificationAsync).toBeCalledTimes(2);
    });

});