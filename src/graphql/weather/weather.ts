import { MeteoRequestType } from "@/state/data/processors/query";
import gql from "graphql-tag";
import { GoogleColumnStats, GoogleRequest } from "../google/google";
import { Properties } from "./definitions/properties";
import { Sources, WeatherSourceType } from "./definitions/source";
import { AbstractWeatherProvider } from "./weatherProviders/abstractProvider";
import { NtcProvider } from "./weatherProviders/ntcProvider";
import { OpenmeteoForecastProvider } from "./weatherProviders/openmeteoForecastProvider";
import { OpenMeteoHistoryProvider } from "./weatherProviders/openmeteoHistoryProvider";

export type WeatherEntryMetaType = {
    time: number,
}

export type WeatherEntryDataType = {
    temperature: number,
    wind_dir?: number,
    wind_speed?: number,
    bar?: number,
    rain?: number,
    clouds?: number,
    humidity?: number,
    uv?: number,
    radiance?: number,
    snow_depth?: number,
    evapotranspiration?: number
}

export type WeatherStatistic = {
    slug: string,
    min?: number,
    max?: number,
    avg?: number,
    count: number,
    type: "line" | "dot",
    in?: string,
    name: string,
    color: string
}

export type WeatherStatistics = {
    temperature?: WeatherStatistic,
    wind_dir?: WeatherStatistic,
    wind_speed?: WeatherStatistic,
    bar?: WeatherStatistic,
    rain?: WeatherStatistic,
    clouds?: WeatherStatistic,
    humidity?: WeatherStatistic,
    uv?: WeatherStatistic,
    radiance?: WeatherStatistic,
    snow_depth?: WeatherStatistic,
    evapotranspiration?: WeatherStatistic
}

export type WeatherEntryType = WeatherEntryMetaType & WeatherEntryDataType;

export type WeatherSerieIndexType = {
    [index: number]: WeatherEntryType
}

export type WeatherSerie = {
    source: WeatherSourceType,
    entries: WeatherEntryType[]
}

export type WeatherProviderRequest = GoogleRequest;

export type WeatherResponse = {
    data: WeatherSerie[],
    request: WeatherProviderRequest
}

export const weatherTypeDefs = gql`

    extend type Query {
        rangeMeteo(scope: String, lat: Float!, lon: Float!, from:Float,to:Float, hasNtc: Boolean!): WeatherResponse
        statisticsMeteo(scope: String, lat: Float!, lon: Float!, from:Float,to:Float, hasNtc: Boolean!): [Statistic]
    }

    type Statistic {
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

    type Statistics {
        time: Statistic
        temperature: Statistic
        wind_dir: Statistic
        wind_speed: Statistic
        bar: Statistic
        rain: Statistic
        clouds: Statistic
        humidity: Statistic
        uv: Statistic
        radiance: Statistic
        evapotranspiration: Statistic
        snow_depth: Statistic
    }

    type Serie {
        source: Source!
        entries:[Entry]
        statistics: Statistics
    }

    type Entry {
        time: Float!
        temperature: Float!
        wind_dir: Float
        wind_speed: Float
        bar: Float
        rain: Float
        clouds: Float
        humidity: Float
        uv: Float
        radiance: Float
        evapotranspiration: Float
        snow_depth: Float
    }

    type Property {
        type: String!
        unit: String
        name: String!
        field: String
        in: [String],
        color: String!,
        slug: String,
        min: Float,
        max: Float
    }

    type Source {
        name: String!
        color: String!
        stroke: String!
        slug: String!
        props:[String]
        description: String
    }

    type WeatherRequest {
        scope: String!
        lat: Float!
        lon: Float!
        from: Float!
        to: Float!
    }

    type WeatherResponse {
        request: WeatherRequest!
        data: [Serie]!
    }

`;

export const openMeteoForecastProvider = new OpenmeteoForecastProvider;
export const openMeteoHistoryProvider = new OpenMeteoHistoryProvider;
export const ntcProvider = new NtcProvider;

export const weatherResolvers = {

    Query: {
        rangeMeteo: async (
            parent: any,
            args: MeteoRequestType,
        ): Promise<WeatherResponse> => {


            const providers: AbstractWeatherProvider[] = [openMeteoForecastProvider, openMeteoHistoryProvider];

            if (args.hasNtc) {
                providers.push(ntcProvider);
            }

            return Promise.all(providers.map(p => p.fetch(args)))
                .then(result => {
                    return {
                        data: result,
                        request: args
                    }
                });

        },

        statisticsMeteo: async (
            parent: any,
            args: MeteoRequestType
        ) => {

            const providers: AbstractWeatherProvider[] = [openMeteoForecastProvider, openMeteoHistoryProvider];

            if (args.hasNtc) {
                providers.push(ntcProvider);
            }

            const response =  await Promise.all(providers.map(p => p.fetchStatistics(args)));

            let result: GoogleColumnStats[] = [];

            response.forEach( resp => {
                result = [
                    ...result,
                    ...resp
                ]
            } );

            return result;

        },


        sources: () => Sources.all(),
        properties: () => Properties.all()
    }

}