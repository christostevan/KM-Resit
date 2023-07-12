import React from "react";
import Header from "../Components/Header/Header";
import { render, screen } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";

describe("Header unit test", () => {
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
        const { getByTestId } = render(
                <Header />
        );

        const text1 = getByTestId("title-navigate");
        expect(text1).toBeTruthy(); 
    });
});