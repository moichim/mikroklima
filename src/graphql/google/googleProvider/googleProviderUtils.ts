import { ApolloError } from "@apollo/client";
import { GoogleColumnValue, GoogleDataColumnDefinition, GoogleScope } from "../google";
import { AvailableWeatherProperties, Properties } from "@/graphql/weather/definitions/properties";

type PossibleNumericalValues = string | undefined | number


/** Static utility functions written in a testable way. */
export default class GoogleProviderUtils {

    /**
     * Makes sure the value is a valid number or undefined
     */
    public static sanitizeNumericalValue(value: PossibleNumericalValues) {

        if (typeof value === "string") {

            // Make sure the string has a valid format
            value = value.replaceAll(",", ".");

            const parsedFloat = parseFloat(value);

            return isNaN(parsedFloat)
                ? undefined
                : parsedFloat;

        } else if (typeof value === undefined) {
            return undefined;
        }

        return value;

    }


    /**
     * Makes sure the value is sa valid number
     * @uses GoogleProviderUtils.sanitizeNumericalValue
     */
    public static sanitizeNumericalValueRequired(value: PossibleNumericalValues): number {
        return GoogleProviderUtils.sanitizeNumericalValue(value)!
    }


    /** @deprecated should not be used */
    public static isValidNumericalValue(value: PossibleNumericalValues) {

        if (typeof value === "number") return true;
        else if (value === undefined) return false;
        return GoogleProviderUtils.sanitizeNumericalValue(value) !== undefined;
    }

    public static isValidNonEmptyStringValue(
        value: any
    ): boolean {
        return typeof value === "string"
            && value !== ""
            && value !== " "
            && value !== "  "
    }


    public static formatQueryRange(
        range: string,
        sheet: string
    ): string {
        return `${sheet}!${range}`;
    }


    // Scope validators & formatters

    public static isValidScopeDefinition(row: any[]) {

        return GoogleProviderUtils.isValidNonEmptyStringValue(row[0])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[1])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[2])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[3])
            && GoogleProviderUtils.isValidNumericalValue(row[4])
            && GoogleProviderUtils.isValidNumericalValue(row[5])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[6])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[7])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[8])
            && GoogleProviderUtils.isValidNonEmptyStringValue(row[9])

    }


    // Meteo data


    public static extractAllColumnDefinitionsFromResponse(
        data: any[][] | null | undefined
    ): GoogleDataColumnDefinition[] {

        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnsCount = data[0].filter((_, index) => index > 1).length;

        const defs: GoogleDataColumnDefinition[] = [];

        for (let i = 0; i < columnsCount; i++) {
            defs.push(GoogleProviderUtils.extractSingleColumnDefinitionFromResponse(data, i));
        }

        return defs;

    }


    /**
     * Extract a single column definition from the raw response object
     * @param data Array of cell data as recieved from Google Sheets
     * @param index index of the column...
     * @returns 
     */
    public static extractSingleColumnDefinitionFromResponse(
        data: any[][] | null | undefined,
        index: number
    ): GoogleDataColumnDefinition {

        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnIndex = index + 2;

        return {
            name: data[1][columnIndex] as string,
            slug: data[0][columnIndex] as string,
            in: Properties.one(data[2][columnIndex] as AvailableWeatherProperties),
            description: data[3][columnIndex] as string | undefined,
            color: data[4][columnIndex] as string,
        }

    }

    public static extractSingleColumnValuesFromResponse(
        data: any[][] | null | undefined,
        propertyIndex: number,
        filterRowsFromTimestamp: number,
        filterRowsToTimestamp: number
    ): GoogleColumnValue[] {

        if ( ! data )
        throw new ApolloError({
            errorMessage: "Google data error"
        });

        const columnIndex = propertyIndex + 2;

        const result: GoogleColumnValue[] = [];

        data.forEach( (row, rowIndex) => {

            // Take only content rows, not the header
            if ( rowIndex <= 6 ) return;

            // Filter rows by the provided time range
            const time = GoogleProviderUtils.convertInputDateStringToTimestamp( row[0] as string );
            if ( time <= filterRowsFromTimestamp || time >= filterRowsToTimestamp ) return;

            // Add entry only when the row is valid number
            const formattedValue = GoogleProviderUtils.sanitizeNumericalValue( row[columnIndex] );
            if ( formattedValue !== undefined ) {

                result.push( {
                    time: GoogleProviderUtils.convertInputDateStringToTimestamp(row[0] as string),
                    value: GoogleProviderUtils.sanitizeNumericalValueRequired( row[columnIndex] ),
                    note: row[1]
                } );

            }

        } );

        return result;

    }


    public static convertInputDateStringToString(
        input: string
    ): string {

        const [day, hours] = input.split(" ");

        const [D, M, Y] = day.split(".");
        const [H, m] = hours.split(":");

        return `${Y}-${M}-${D} ${H}:${m}`;

    }


    public static convertInputdateStringToDateObject(
        input: string
    ): Date {
        return new Date(GoogleProviderUtils.convertInputDateStringToString(input));
    }


    public static convertInputDateStringToTimestamp(
        input: string
    ): number {
        return GoogleProviderUtils.convertInputdateStringToDateObject(input).getTime();
    }




}