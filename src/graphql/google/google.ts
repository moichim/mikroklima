import gql from "graphql-tag"
import { WeatherProperty } from "../weather/definitions/properties"
import { googleSheetsProvider } from "./googleProvider/googleProvider"

export type GoogleScope = {
    /** Name of the scope */
    name: string,
    slug: string,
    /** ID of the scope's data sheet */
    sheetId: string,
    sheetTab: string,
    lat: number,
    lon: number,
    hasNtc: boolean,
    isDefault: boolean,
    team: string,
    locality: string,
    description: string,
    start?: string,
    count: number
}

export type GoogleDataColumnDefinition = {
    name: string,
    slug: string,
    color: string,
    description?: string,
    in: WeatherProperty
}

export type GoogleColumnValue = {
    time: number,
    value: number,
    note?: string
}

export type GoogleColumn = GoogleDataColumnDefinition & {
    
    values: GoogleColumnValue[],

    min: number|null,
    max: number|null,
    avg: number|null,
    count: number

}

export type GoogleColumnStats = GoogleDataColumnDefinition & {

    min: number|null,
    max: number|null,
    avg: number|null,
    count: number

}

export type GoogleScopeData = {
    data: GoogleColumn[]
}

export const googleTypeDefs = gql`

    extend type Query {
        rangeGoogle( scope: String, lat: Float!, lon: Float!, from:Float, to:Float, sheetId: String!, sheetTab: String! ): GoogleScopeData
        statisticsGoogle(scope: String, lat: Float!, lon: Float!, from:Float, to:Float, sheetId: String!, sheetTab: String!): [GoogleColumnStats]
    }

    type GoogleScopeData {
        data: [GoogleColumn]
    }

    type GoogleColumnDefinition {
        name: String!
        slug: String!
        color: String!
        in: Property!
        description: String
    }

    type GoogleColumn {
        name: String!
        slug: String!
        color: String!
        in: Property!
        description: String
        values: [GoogleColumnValue]
        min: Float
        max: Float
        avg: Float
        count: Float
    }

    type GoogleColumnStats {
        name: String!
        slug: String!
        color: String!
        in: Property!
        description: String
        min: Float
        max: Float
        avg: Float
        count: Float
    }

    type GoogleColumnValue {
        time: Float!
        value: Float!
        note: String
    }

`;

export type GoogleRequest = {
    scope: string,
    sheetId: string,
    sheetTab: string,
    lat: number,
    lon: number,
    from: number,
    to: number
}

export const googleResolvers = {

    Query: {
        rangeGoogle: async (
            parent: any,
            args: GoogleRequest
        ) => {

            const data = await googleSheetsProvider.fetchScopeValuesInRange( args );

            return {
                data
            }

        },

        statisticsGoogle: async (
            parent: any,
            args: GoogleRequest
        ) => {
            return await googleSheetsProvider.fetchScopeStatisticsInRange( args );
        }
    }

}