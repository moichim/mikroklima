import { ScopeProvider, scopeProvider } from "@/graphql/scope/ScopeProvider";
import { randomUUID } from "crypto";
import { google } from "googleapis";
import { WeatherProperty } from "../../weather/definitions/properties";
import { GoogleColumn, GoogleColumnStats, GoogleDataColumnDefinition, GoogleRequest, GoogleScope } from "../google";
import GoogleProviderUtils from "./googleProviderUtils";

export type ValueSerieDefinition = {
    name: string,
    slug: string,
    id: number,
    color: string,
    in: WeatherProperty[]
}

export type GoogleSheetsDefinitionType = {
    name: string,
    sheetId: string
}


export type GooglePropertyResponse = ValueSerieDefinition & {

    min: number,
    max: number,
    avg: number,
    count: number,

    /* Filtered values */
    values: {
        [index: number]: number
    },

}

export type GoogleResponseType = {
    columns: GooglePropertyResponse[]
}


/** Handles Google Sheets communication */
class GoogleSheetsProvider {

    protected static CONFIG_SHEET_ID = "1YNjQNCUYUlw96uaQ6RYTq4MG5zUzhHwW-XM-chJWkjE";

    protected static CONFIG_TAB_NAME = "Config";


    public readonly ID: string;


    public constructor(
        protected readonly scopeProvider: ScopeProvider
    ) {
        this.ID = randomUUID();
    }


    protected static getInstance() {
        return googleSheetsProvider;
    }


    protected async getAuth() {
        return new google.auth.GoogleAuth({
            credentials: {
                type: process.env.GOOGLE_TYPE!,
                project_id: process.env.GOOGLE_PROJECT_ID!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!,
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                token_url: process.env.GOOGLE_TOKEN_URI!,
                universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN!,
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/documents'
            ],
        });
    }


    protected async getDocsClient() {
        const auth = await this.getAuth();

        return google.docs({
            version: "v1",
            auth: auth
        });
    }


    protected async getSheetsClient() {

        const auth = await this.getAuth();

        return google.sheets({
            version: 'v4',
            auth: auth
        });
    }


    /** @deprecated Should use instances or be releted */
    public async fetchScopeDefinition(scope: string) {

        return await this.scopeProvider.fetchScopeDefinition(scope);

    }

    public async fetchAllScopesDefinitions(): Promise<GoogleScope[]> {

        return await this.scopeProvider.fetchAllScopesDefinitions();

    }

    /** @deprecated Should know sheet ID from the context */
    public async fetchScopeValuesInRange(
        args: GoogleRequest
    ): Promise<any> {

        const sheetId = args.sheetId;

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: GoogleProviderUtils.formatQueryRange("A1:Z", args.sheetTab)
        });

        const definitions = GoogleProviderUtils.extractAllColumnDefinitionsFromResponse(response.data.values);

        const from = args.from;
        const to = args.to;

        const result: GoogleColumn[] = definitions.map((column, index) => {

            // Retrieve values from the response
            const values = GoogleProviderUtils.extractSingleColumnValuesFromResponse(
                response.data.values,
                index,
                from,
                to
            );

            const min = values.reduce((state, current) => {
                if (current.value < state) return current.value;
                return state;
            }, Infinity);

            const max = values.reduce((state, current) => {
                if (current.value > state) return current.value;
                return state;
            }, -Infinity);

            const count = values.length;

            const avg = values.reduce((state, current) => current.value + state, 0) / count;

            return {
                ...column,
                values,
                min: min !== Infinity ? min : null,
                max: max !== -Infinity ? max : null,
                avg: count > 0 ? avg : null,
                count
            }
        });

        return result;

    }

    /** A public method for retrieving any kind of statistics */
    public async fetchScopeStatisticsInRange(
        args: GoogleRequest
    ): Promise<GoogleColumnStats[]> {

        const sheetId = args.sheetId;
        const from = args.from;
        const to = args.to;

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: GoogleProviderUtils.formatQueryRange("A1:Z", args.sheetTab)
        });

        const definitions = GoogleProviderUtils.extractAllColumnDefinitionsFromResponse(response.data.values);


        return definitions.map((column, index) => {

            // Retrieve values from the response
            const values = GoogleProviderUtils.extractSingleColumnValuesFromResponse(
                response.data.values,
                index,
                from,
                to
            );

            const min = values.reduce((state, current) => {
                if (current.value < state) return current.value;
                return state;
            }, Infinity);

            const max = values.reduce((state, current) => {
                if (current.value > state) return current.value;
                return state;
            }, -Infinity);

            const count = values.length;

            const avg = values.reduce((state, current) => current.value + state, 0) / count;

            return {
                ...column,
                min: min !== Infinity ? min : null,
                max: max !== -Infinity ? max : null,
                avg: count > 0 ? avg : null,
                count
            }
        });

    }

    /** Fetch Column definitions for a scope */
    public async fetchScopeColumnDefinitions(
        sheetId: string,
        sheetTab: string
    ): Promise<GoogleDataColumnDefinition[]> {

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: GoogleProviderUtils.formatQueryRange("A1:Z", sheetTab)
        });

        return GoogleProviderUtils.extractAllColumnDefinitionsFromResponse(response.data.values);
    }


}

/** Create the global instance of the provider in order to prevent multiple calls */
export const googleSheetsProvider = new GoogleSheetsProvider(scopeProvider);