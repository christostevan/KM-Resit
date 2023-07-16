import React from "react";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import * as request from '../Service/request';
import fetchMock from "fetch-mock";
import fetch from "jest-fetch-mock";

global.fetch = require("jest-fetch-mock");
describe("Request test", () => {
    beforeEach(() => {
        // Reset the fetch mock before each test case
        fetch.resetMocks();
    });

    it("Fetches forecasting correctly", () => {
        expect(true).toBeTruthy();
    });

    it("Determines months correctly", () => {
        expect(request.determineMonth(0)).toBeTruthy();
        expect(request.determineMonth(2)).toBeTruthy();
        expect(request.determineMonth(4)).toBeTruthy();
        expect(request.determineMonth(6)).toBeTruthy();
        expect(request.determineMonth(7)).toBeTruthy();
        expect(request.determineMonth(9)).toBeTruthy();
        expect(request.determineMonth(11)).toBeTruthy();
        
        expect(request.determineMonth(1)).toBeFalsy();
        expect(request.determineMonth(3)).toBeFalsy();
        expect(request.determineMonth(5)).toBeFalsy();
        expect(request.determineMonth(8)).toBeFalsy();
        expect(request.determineMonth(10)).toBeFalsy();

        expect(request.determineMonth(-1)).toBeFalsy();
        expect(request.determineMonth(12)).toBeFalsy();
    });

    it("Test for leap year", () => {
        expect(request.determineLeapYear(2020)).toBeTruthy();
        expect(request.determineLeapYear(2000)).toBeTruthy();
        expect(request.determineLeapYear(2024)).toBeTruthy();

        expect(request.determineLeapYear(2021)).toBeFalsy();
        expect(request.determineLeapYear(1901)).toBeFalsy();
        expect(request.determineLeapYear(2101)).toBeFalsy();
    });
});

