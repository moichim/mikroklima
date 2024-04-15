import { GoogleRequest, GoogleScopeData } from "@/graphql/google/google";
import { WeatherResponse } from "@/graphql/weather/weather";
import { ProjectFilesQueryResponse } from "@/modules/thermal/context/useProjectLoader";

export type MeteoRequestType = GoogleRequest & {
  hasNtc: boolean
};

export type MeteoQueryResponseType = ProjectFilesQueryResponse & {
  rangeGoogle: GoogleScopeData,
  rangeMeteo: WeatherResponse,
}


