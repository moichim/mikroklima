import { GoogleScope } from "@/graphql/google/google";
import { useGraphData } from "./useGraphData";
import { useGraphStatistics } from "./useGraphStatitics";
import { useTimeContext } from "../time/timeContext";
import { useEffect, useMemo } from "react";

/** @deprecated */
export const useData = (
    scope: GoogleScope,
    fixedTime?: { from: number, to: number }
) => {

    // Read the time
    const { timeState: time } = useTimeContext();

    const range = useMemo( () => {

        if ( fixedTime )
            return fixedTime;

        return {
            from: time.from,
            to: time.to
        }

    }, [ fixedTime, time.from, time.to ] );

    console.log( range );

    // Initialise the queries
    const graphData = useGraphData( scope );
    const viewStats = useGraphStatistics( scope );
    const selectionStats = useGraphStatistics( scope );

    // Fire the initial query
    useEffect( () => {

        graphData.fetch( range.from, range.to );

    }, [] );



    // Hook the range change to the main data query
    useEffect( () => {

        graphData.fetch( range.from, range.to );
        viewStats.clear();
        selectionStats.clear();

    }, [ range.from, range.to ] );



    // The main query response triggers loading of the statistics
    useEffect( () => {

        if ( graphData.data !== undefined ) {
            viewStats.fetch( range.from, range.to );
        }

    }, [ graphData.data ] );



    // Change of the selection triggers request for a statistic
    useEffect( () => {

        if ( time.selectionFrom !== undefined && time.selectionTo !== undefined ) {
            selectionStats.fetch( time.selectionFrom, time.selectionTo );
        }

    }, [ time.selectionFrom, time.selectionTo ] );



    const loading = graphData.loading || viewStats.loading || selectionStats.loading;

    return {
        loading,
        graphData,
        viewStats,
        selectionStats
    }



}