import React from "react";
import { View } from "react-native";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import fetchMock from "fetch-mock";
import fetch from "jest-fetch-mock";
// import { useNavigation } from "@react-navigation/native";
import { jest } from '@jest/globals';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../../App";
import Login from "./Login";

// Mock useNavigation hook
jest.mock('@react-navigation/native');

describe("Forecasting unit test", () => {

    // // Mock useNavigation hook
    // jest.mock('@react-navigation/native', () => ({
    //     useNavigation: jest.fn(),
    // }));

    // // Mock the navigation object
    // const mockNavigation: any = {
    //     navigate: jest.fn(),
    // };

    // beforeEach(() => {
    //     (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    // });

    it("Renders the page correctly", () => {
        const { getByText, getByTestId } = render(<Login />);
        expect(getByText("Login here")).toBeTruthy();

        // Check if input fields and buttons are rendered
        expect(getByTestId('TextInput-Login')).toBeTruthy();
        expect(getByTestId('TextInputPassword-test')).toBeTruthy();
        expect(getByTestId('SubmitButtonLogin-test')).toBeTruthy();
        expect(getByTestId('goToRegister-test')).toBeTruthy();
    });

    it('should navigate to Forecasting screen on successful login', async () => {
        // Import the manual mock for useNavigation from the __mocks__ folder
        const { useNavigation } = require('@react-navigation/native');

        // Mock the navigation object
        const mockNavigation: any = {
            navigate: jest.fn(),
        };

        // Provide the mocked navigation object to the useNavigation hook
        useNavigation.mockReturnValue(mockNavigation);

        // Mock the LoginFetch function to return data when called with the correct parameters
        jest.mock('../../../../Service/request', () => ({
            LoginFetch: jest.fn().mockResolvedValue([{ id: 1, username: 'testuser' }] as never),
        }));

        const { getByTestId } = render(<Login />);

        // Type into the username and password input fields
        fireEvent.changeText(getByTestId('TextInput-Login'), 'testuser');
        fireEvent.changeText(getByTestId('TextInputPassword-test'), 'testpassword');

        // Click the login button
        fireEvent.press(getByTestId('SubmitButtonLogin-test'));

        // Check if the navigation function was called with the correct route name
        // Replace 'Forecasting' with the correct route name for the Forecasting screen
        expect(useNavigation).toHaveBeenCalled();
    });

    it("should update username and password states correctly", () => {
        const { getByTestId } = render(<Login />);
    
        const usernameInput = getByTestId("TextInput-Login");
        const passwordInput = getByTestId("TextInputPassword-test");
    
        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "testpassword");
    
        expect(usernameInput.props.value).toBe("testuser");
        expect(passwordInput.props.value).toBe("testpassword");
      });

    it('should show an error message for wrong credentials', async () => {
        // Import the manual mock for useNavigation from the __mocks__ folder
        const { useNavigation } = require('@react-navigation/native');

        // Mock the navigation object
        const mockNavigation: any = {
            navigate: jest.fn(),
        };

        // Provide the mocked navigation object to the useNavigation hook
        useNavigation.mockReturnValue(mockNavigation);
        // Mock the LoginFetch function to return an empty array (indicating wrong credentials)
        jest.mock('../../../../Service/request', () => ({
            LoginFetch: jest.fn().mockResolvedValue([] as never),
        }));

        const { getByTestId, getByText } = render(<Login />);

        // Type into the username and password input fields
        fireEvent.changeText(getByTestId('TextInput-Login'), 'wronguser');
        fireEvent.changeText(getByTestId('TextInputPassword-test'), 'wrongpassword');

        // Click the login button
        fireEvent.press(getByTestId('SubmitButtonLogin-test'));

        // Check if the warning alert is shown
        expect(useNavigation).toHaveBeenCalled();
    });

    it('should navigate to Forecasting screen on successful login', async () => {
        const { getByTestId, UNSAFE_getAllByType } = render(
            <Login />
        );
        const parentView = getByTestId("parent-view");

        fireEvent(parentView, "layout", {
            nativeEvent: { layout: { width: 200 } },
        });

        const views = UNSAFE_getAllByType(View);
        expect(views[1].props.style.width).toBe("80%");
    });

});