import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import NavigationContainer from "@react-navigation/native";
import Header from "./Header";

// Mock the hook
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

describe("Header unit test", () => {
    it("Should navigate correctly", () => {
        const renderHeader = () =>
            render(
                <Header />
            )

        const navigationMock = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({ navigate: navigationMock });
        const { getByTestId } = renderHeader();
        fireEvent.press(getByTestId("historical-navigate"));
        waitFor(() => {
            expect(navigationMock).toBeCalledWith("Historical");
        });
    });

});