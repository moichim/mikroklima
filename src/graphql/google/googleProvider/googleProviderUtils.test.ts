import { expect, jest, describe, test } from '@jest/globals';
import GoogleProviderUtils from './googleProviderUtils';

describe("GoogleProviderUtils", () => {

    test("single cell numerical value validation", () => {

        const data = new Map<(string | number | undefined), (number | undefined)>();
        data.set("9", 9);
        data.set("0", 0.0);
        data.set("1", 1.0);
        data.set("0.000", 0.0);
        data.set("1.000", 1.0);
        data.set("ano", undefined);
        data.set("-32", -32);
        data.set(86, 86);
        data.set("85.945", 85.945);
        data.set("85,945", 85.945);
        data.set("-45.12", -45.12);
        data.set("-45,44.2", -45.44);
        data.set(undefined, undefined);

        data.forEach((expectedResult, testedValue) => {

            expect(GoogleProviderUtils.sanitizeNumericalValue(testedValue)).toEqual(expectedResult);

        });

    });

    test("query range formatter", () => {

        expect(GoogleProviderUtils.formatQueryRange("range", "sheetId")).toEqual("sheetId!range");

    });

    test("input date string parse", () => {

        const data = new Map<string, string>();
        data.set(
            "15.1.2024 10:00:00", 
            "2024-1-15 10:00"
        );
        data.set(
            "13.12.2023 10:00:00", 
            "2023-12-13 10:00"
        );

        data.forEach((expectedValue, testedValue) => {

            expect(
                GoogleProviderUtils.convertInputDateStringToString(testedValue)
            ).toEqual(expectedValue);

        });

    });

});