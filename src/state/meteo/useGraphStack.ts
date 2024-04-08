import { GoogleScope } from "@/graphql/google/google";
import { useMeteoGraphData } from "./useMeteoGraphData"
import { AvailableWeatherProperties, Properties } from "@/graphql/weather/definitions/properties";
import { useMemo } from "react";
import { useGraphContext } from "../graph/graphContext";

export const useGraphStack = (
    activeGraphs: AvailableWeatherProperties[],
    scope: GoogleScope,
    from: number,
    to: number,
    selectionFrom?: number,
    selectionTo?: number
) => {

    const data = useMeteoGraphData(scope, from, to, selectionFrom, selectionTo );

    const graph = useGraphContext();

    const availableGraphs = useMemo( () => {

        return Properties.all()
            .map( property => property.slug )
            .filter( property => ! activeGraphs.includes( property ) );

    }, [activeGraphs] );

    const instances = useMemo( () => {

        return activeGraphs.map( graphId => {

            const graphData = data.data
                ? data.data[ graphId ]
                : undefined;

            

        } );

    }, [activeGraphs] );

}