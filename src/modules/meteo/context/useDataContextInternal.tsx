import { GoogleColumn, GoogleColumnStats, GoogleScope } from "@/graphql/google/google";
import { AvailableWeatherProperties, WeatherProperty } from "@/graphql/weather/definitions/properties";
import { WeatherSourceType } from "@/graphql/weather/definitions/source";
import { StackActions } from "@/modules/graph/reducerInternals/actions";
import { GraphDomain, GraphInstanceScales, GraphInstanceState } from "@/modules/graph/reducerInternals/storage";
import { useGraphInternal } from "@/modules/graph/useGraphInternal";
import { BufferEntryType } from "@/modules/meteo/processors/responseProcessing";
import { useMemo } from "react";
import { useData } from "../useData";
import { useGraphContext } from "@/modules/graph/graphContext";
import { DataGraphResponseEntryType, DataGraphResponseSerieType, DataGraphResponseType } from "@/modules/data/graphql/interfaces";

export type GraphInstanceHeightSetter = (height: GraphInstanceScales) => void;

export type GraphInstanceDomainSetter = (domain: GraphDomain, min?: number | "auto", max?: number | "auto") => void;

export type GraphInstancePropertySetter = (property: AvailableWeatherProperties) => void;

export type GraphInstanceProps = {
    
    graphData?: DataGraphResponseEntryType[],
    graphResourcesMap?: {
        [index: string]: DataGraphResponseSerieType
    }

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