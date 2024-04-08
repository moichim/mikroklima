"use client";

import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties";
import { MeteoContextProps, useMeteoGraphData } from "./useMeteoGraphData";
import { useMemo } from "react";
import { GraphInstanceProps } from "../data/context/useDataContextInternal";
import { useGraphContext } from "../graph/graphContext";

type GraphStackProps = MeteoContextProps & {
    defailtGraphs: AvailableWeatherProperties[]
}

export const GraphStack: React.FC<GraphStackProps> = props => {


    const data = useMeteoGraphData( 
        props.scope,
        props.from,
        props.to,
        props.selectionFrom,
        props.selectionTo,
        props.hasZoom
    );

    const {graphState} = useGraphContext();

    graphState.graphs

    const instances = useMemo( () => {}, [
        data.data,
        data.loadingMain,
        data.statistics,
        data
    ] );

}