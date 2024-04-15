import { GoogleColumnStats } from "@/graphql/google/google";
import { AvailableWeatherProperties, WeatherProperty } from "@/graphql/weather/definitions/properties";
import { DataGraphResponseEntryType, DataGraphResponseSerieType } from "@/modules/data/graphql/interfaces";
import { GraphDomain, GraphInstanceScales, GraphInstanceState } from "@/modules/graph/reducerInternals/storage";

export type GraphInstanceHeightSetter = (height: GraphInstanceScales) => void;

export type GraphInstanceDomainSetter = (domain: GraphDomain, min?: number | "auto", max?: number | "auto") => void;

export type GraphInstancePropertySetter = (property: AvailableWeatherProperties) => void;

export type GraphInstanceProps = {
    
    graphData?: DataGraphResponseEntryType[],
    graphResourcesMap?: {
        [index: string]: DataGraphResponseSerieType
    }

    images?: {
        [index:number]: {
            [index:string]: number
        }
    },

    viewStats?: GoogleColumnStats[],
    viewStatsLoading: boolean,

    selectionStats?: GoogleColumnStats[],
    selectionStatsLoading: boolean,
    
    state: GraphInstanceState,
    
    setProperty: GraphInstancePropertySetter,
    
    setHeight: GraphInstanceHeightSetter,

    setDomain: GraphInstanceDomainSetter,

    availableProperties: WeatherProperty[],

    loadingData: boolean,
    loadingAnything: boolean

}