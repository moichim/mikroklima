import { GoogleRequest, GoogleScopeData } from "@/graphql/google/google";
import { WeatherResponse } from "@/graphql/weather/weather";

export type MeteoRequestType = GoogleRequest & {
  hasNtc: boolean
};

export type MeteoQueryResponseType = {
  rangeGoogle: GoogleScopeData,
  rangeMeteo: WeatherResponse
}


