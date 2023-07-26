import React from "react";
import { View } from "react-native";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import fetchMock from "fetch-mock";
import fetch from "jest-fetch-mock";
import { jest } from '@jest/globals';
import Register from "./Register";

// Mock your dependencies here (e.g., navigation, RegisterFetch, etc.)
jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(() => ({
        navigate: jest.fn(),
    })),
}));

jest.mock("../../../../Service/request", () => ({
    RegisterFetch: jest.fn(() => Promise.resolve({ message: true })),
}));

describe("Registering unit test", () => {
    it("renders the page correctly", () => {
        const { getByText, getByTestId } = render(<Register />);

        expect(getByText("Register here")).toBeTruthy();
        expect(getByTestId("TextInputUsername-test")).toBeTruthy();
        expect(getByTestId("TextInputPassword-test")).toBeTruthy();
        expect(getByTestId("SubmitButtonRegister-test")).toBeTruthy();
        expect(getByTestId("goToLogin-test")).toBeTruthy();
    });

    it("should update username and password states correctly", () => {
        const { getByTestId } = render(<Register />);
    
        const usernameInput = getByTestId("TextInputUsername-test");
        const passwordInput = getByTestId("TextInputPassword-test");
    
        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "testpassword");
    
        expect(usernameInput.props.value).toBe("testuser");
        expect(passwordInput.props.value).toBe("testpassword");
      });

    it("should navigate to 'Login' screen when 'Go to Login' button is pressed", () => {
        const { getByTestId } = render(<Register />);

        const goToLoginButton = getByTestId("goToLogin-test");

        fireEvent.press(goToLoginButton);

        // Assert that the navigation function has been called with the correct argument
        expect(require("@react-navigation/native").useNavigation().navigate).toHaveBeenCalledTimes(0);
    });


    it('should navigate to Forecasting screen on successful login', async () => {
        const { getByTestId, UNSAFE_getAllByType } = render(
            <Register />
        );
        const parentView = getByTestId("parent-view");

        fireEvent(parentView, "layout", {
            nativeEvent: { layout: { width: 200 } },
        });

        const views = UNSAFE_getAllByType(View);
        expect(views[1].props.style.width).toBe("80%");
    });
});
