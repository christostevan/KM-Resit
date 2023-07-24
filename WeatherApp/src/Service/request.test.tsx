import React from "react";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import * as request from '../Service/request';
import fetchMock from "fetch-mock";
import fetch from "jest-fetch-mock";
import { determineLeapYear, determineMonth, dateToString, forecasting, DailyForecasting } from "../Service/request";

global.fetch = require("jest-fetch-mock");
describe("Request test", () => {
    beforeEach(() => {
        // Reset the fetch mock before each test case
        fetch.resetMocks();
    });

    it("Basic fetching function from API test", async () => {
        let mockResponse: Partial<Response> = {
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ data: 'mocked data' })
        };

        jest.spyOn(global, 'fetch').mockResolvedValueOnce(
            Promise.resolve(mockResponse as Response)
        );

        const base_url = `https://example.com/api/forecast`;
        const result = await request.forecasting(base_url);

        expect(fetch).toHaveBeenCalledWith(base_url);
        expect(result).toEqual({ data: 'mocked data' });

        // Should throw an error if the response is not successfull
        mockResponse = {
            ok: false,
            status: 404,
            statusText: 'Not found',
        };
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(
            Promise.resolve(mockResponse as Response)
        );
        await expect(request.forecasting(base_url)).rejects.toThrow(
            'Error while retrieving data'
        );

        // Should throw an error if there's an error during fetching
        // Mock the fetch function to throw error
        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
        await expect(request.forecasting(base_url)).rejects.toThrow(
            'Error while fetching: Network error'
        );

        jest.resetAllMocks();
    });

    it("Daily forecast function test", async () => {

    });

    it("Historical fetch function test", async () => {
        // jest.spyOn(global, determineLeapYear).mockReturnValueOnce(true);
        // jest.spyOn(global, 'determineMonth').mockReturnValueOnce(true);
        // jest.spyOn(global, 'dateToString').mockReturnValueOnce('mocked todayString');
        // jest.spyOn(global, 'dateToString').mockReturnValueOnce('mocked twentyYearsString');

        // // Mock the forecasting function to return a successful response
        // jest.spyOn(global, 'forecasting').mockResolvedValueOnce({ data: 'mocked data' });

        // const latitude = 52.7792;
        // const longitude = 6.9069;
        // const result = await request.HistoricalFetch(latitude, longitude);

        // const today = new Date();
        // const twentyYears = new Date();
        // twentyYears.setFullYear(today.getFullYear() - 20);
        // twentyYears.setDate(1);
        // const todayString = 'mocked todayString';
        // const twentyYearsString = 'mocked twentyYearsString';
        // const base_url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${twentyYearsString}&end_date=${todayString}&daily=temperature_2m_mean,precipitation_sum&timezone=GMT`;
        // expect(result).toEqual({ data: 'mocked data' });
        // expect(determineLeapYear).toHaveBeenCalledWith(today.getFullYear());
        // expect(determineMonth).toHaveBeenCalledWith(today.getMonth());
        // expect(dateToString).toHaveBeenCalledTimes(2);
        // expect(dateToString).toHaveBeenCalledWith(today);
        // expect(dateToString).toHaveBeenCalledWith(twentyYears);
        // expect(forecasting).toHaveBeenCalledWith(base_url);

        // // Restore the original functions
        // jest.restoreAllMocks();
    });

    it("Get city function test", async () => {
        // let mockResponse: Partial<Response> = {
        //     ok: true,
        //     json: jest.fn().mockResolvedValueOnce({
        //         results: [{id: 2643743}]
        //     })
        // };
        // jest.spyOn(global, 'fetch').mockResolvedValueOnce(
        //     Promise.resolve(mockResponse as Response)
        // );

        // const city = "London";
        // const result = await request.CityFetch(city);

        // const base_url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        // expect(fetch).toHaveBeenCalledWith(base_url);
        // expect(result).toEqual({
        //     results: [{id: 2643743}]
        // });

        const emptyCity = '';
        await expect(request.CityFetch(emptyCity)).rejects.toThrow('City cannot be null');

        jest.restoreAllMocks();
    });

    // it("Daily forecasting test", async () => {
    //     const cityName = 'ValidCity';
    //     const mockData = { result: false };
    //     const mockForecasting = jest.fn().mockResolvedValue(mockData);
    
    //     // Mock the 'forecasting' function used inside 'DailyForecasting'
    //     jest.mock('../Service/request', () => ({
    //       forecasting: mockForecasting,
    //     }));
    
    //     // Call the 'DailyForecasting' function
    //     const result = await DailyForecasting(cityName);
    
    //     // Assertions for the expected output
    //     expect(mockForecasting).toHaveBeenCalledTimes(1);
    //     expect(mockForecasting).toHaveBeenCalledWith(
    //       `https://km-resit-weatherapp.azurewebsites.net/nextDayWeather?city=${cityName}`
    //     );
    //     // expect(result).toEqual(mockData);
    // }); 

    it("throws an error when fetch fails", async () => {
        // Mock a failed response by setting response.ok to false
        fetch.mockResponseOnce(JSON.stringify({}), { status: 404 });
    
        // Set up a mock function for handleTypeChange
        const handleTypeChangeMock = jest.fn();
    
        // Invoke the function being tested with a non-empty input
        await expect(
          forecasting("https://km-resit-weatherapp.azurewebsites.net/nextDayWeather?city=Emmen")
        ).rejects.toThrow("Error while fetching: Error while retrieving data");
    
        // Assert that handleTypeChange was not called
        expect(handleTypeChangeMock).not.toHaveBeenCalled();
      });

    it("Determines months correctly", () => {
        expect(request.determineMonth(0)).toBe(true);
        expect(request.determineMonth(2)).toBe(true);
        expect(request.determineMonth(4)).toBe(true);
        expect(request.determineMonth(6)).toBe(true);
        expect(request.determineMonth(7)).toBe(true);
        expect(request.determineMonth(9)).toBe(true);
        expect(request.determineMonth(11)).toBe(true);

        expect(request.determineMonth(1)).toBe(false);
        expect(request.determineMonth(3)).toBe(false);
        expect(request.determineMonth(5)).toBe(false);
        expect(request.determineMonth(8)).toBe(false);
        expect(request.determineMonth(10)).toBe(false);

        expect(request.determineMonth(-1)).toBe(false);
        expect(request.determineMonth(12)).toBe(false);
    });

    it("Test for leap year", () => {
        expect(request.determineLeapYear(2020)).toBeTruthy();
        expect(request.determineLeapYear(2000)).toBeTruthy();
        expect(request.determineLeapYear(2024)).toBeTruthy();

        expect(request.determineLeapYear(2021)).toBeFalsy();
        expect(request.determineLeapYear(1901)).toBeFalsy();
        expect(request.determineLeapYear(2101)).toBeFalsy();
        expect(request.determineLeapYear(1900)).toBeFalsy();
        expect(request.determineLeapYear(2100)).toBeFalsy();
    });

    it("Date to string function test", () => {
        let date: Date = new Date('2023-07-16');
        expect(request.dateToString(date)).toBe('2023-07-16');

        date = new Date('2023-02-03');
        expect(request.dateToString(date)).toBe('2023-02-03');
    });

    it("Get date plus function test", () => {
        const today = new Date();
        const tomorrow = request.getDatePlus(1);
        const nextWeek = request.getDatePlus(7);

        expect(tomorrow.getDate()).toEqual(new Date(today.setDate(today.getDate() + 1)).getDate());
        expect(nextWeek.getDate()).toEqual(new Date(today.setDate(today.getDate() + 6)).getDate());

        expect(() => request.getDatePlus(-1)).toThrow('Day cannot be less than 0 or null');
    });
});

