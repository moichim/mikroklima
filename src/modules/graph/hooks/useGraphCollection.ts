import { GoogleColumnStats, GoogleScope } from "@/graphql/google/google";
import { useGraphData } from "../../meteo/useGraphData";
import { useGraphStatistics } from "../../meteo/useGraphStatitics";
import { Dispatch, useEffect, useMemo } from "react";
import { useGraphContext } from "../graphContext";
import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties";
import { StackActions } from "../reducerInternals/actions";
import { GraphInstanceProps } from "../../meteo/context/useDataContextInternal";
import { GraphDomain, GraphInstanceScales } from "../reducerInternals/storage";
import { TimeStorageType } from "../../time/reducerInternals/storage";
import { TimeEventsType } from "../../time/reducerInternals/actions";

export const useGraphCollection = (
    defaultGraphs: AvailableWeatherProperties[],
    scope: GoogleScope,
    hasZoom: boolean = true,
    state: TimeStorageType,
    dispatch: Dispatch<TimeEventsType>
) => {

    const graph = useGraphContext();

    // Mount the graphs upon every activeGraphs change
    useEffect( () => {

        graph.graphDispatch( StackActions.removeAllGraphs() );

        defaultGraphs.forEach( item => graph.graphDispatch( StackActions.addGraph( item ) ) );


    }, [ defaultGraphs ] );


    const graphData = useGraphData( scope );
    const viewStats = useGraphStatistics( scope );
    const selectionStats = useGraphStatistics( scope );

    // when the main range changes, clear everything and fetch the main data
    useEffect( () => {

        // if ( state.from !== undefined && state.to !== undefined ) {
            graphData.fetch( state.from, state.to );
            viewStats.clear();
            selectionStats.clear();
        // }

    }, [ state.from, state.to ] );


    // whenever the main data are fetched, fetch the view statistics as well
    useEffect( () => {

        if ( graphData !== undefined && state.from !== undefined && state.to !== undefined ) {
            viewStats.fetch( state.from, state.to );
        }

    }, [ graphData.data ] );


    // Whenever the selection changes, fetch the selection statistics
    useEffect( () => {

        if ( state.selectionFrom !== undefined && state.selectionTo !== undefined ) {

            selectionStats.fetch( state.selectionFrom, state.selectionTo );

        }

    }, [ state.selectionFrom, state.selectionTo ] );

    const loading = graphData.loading || viewStats.loading || selectionStats.loading;


    const instances = useMemo( (): GraphInstanceProps[] => {

        return Object.values( graph.graphState.graphs ).map( instance => {

            const gd = graphData.data
                ? graphData.data[ instance.property.slug ]
                : undefined;


            // View Statistics
            
            let vs: GoogleColumnStats[] | undefined = undefined;
            let viewStatsLoading = viewStats.loading;

            if ( viewStats.data ) {
                
                // Google Statistics
                const statistics = Object.values( viewStats.data.dots ).filter( dot => dot.in.slug === instance.property.slug ).filter( dot => dot.count > 0 );

                // MeteoStatistics
                const lines = Object.values( viewStats.data.lines ).filter( line => line.in.slug === instance.property.slug ).filter( line => line.count > 0 );

                vs = [
                    ...statistics,
                    ...lines
                ]

            }



            // Selection Statistics
            let ss: GoogleColumnStats[] | undefined = undefined;
            let selectionStatsLoading = selectionStats.loading;

            if ( selectionStats.data ) {
                // Google Statistics
                const statistics = Object.values( selectionStats.data.dots ).filter( dot => dot.in.slug === instance.property.slug ).filter( dot => dot.count > 0 );

                // MeteoStatistics
                const lines = Object.values( selectionStats.data.lines ).filter( line => line.in.slug === instance.property.slug ).filter( line => line.count > 0 );

                ss = [
                    ...statistics,
                    ...lines
                ]
            }


            // Properties to which this instance may switch
            const availableProperties = graph.graphState.availableGraphs.filter( property => {

                if ( property.slug === instance.property.slug ) {
                    return false;
                }

                if ( graph.graphState.graphs[ property.slug ] !== undefined ) { 
                    return false;
                }

                return true;

            } );

            const state = instance;

            const setProperty = ( 
                property: AvailableWeatherProperties 
            ) => graph.graphDispatch( StackActions.setInstanceProperty( 
                instance.property.slug, 
                property 
            ) );

            const setHeight = (
                height: GraphInstanceScales
            ) => {
                graph.graphDispatch( StackActions.setInstanceHeight( 
                    instance.property.slug,
                    height
                ) )
            }

            const setDomain = (
                domain: GraphDomain,
                min?: number|"auto",
                max?: number|"auto"
            ) => {
                graph.graphDispatch( StackActions.setInstanceDomain(
                    instance.property.slug,
                    domain,
                    min,
                    max
                ) );
            }

            return {
                graphData: gd,
                state,
                setProperty,
                setHeight,
                setDomain,
                availableProperties,
                loadingData: loading,
                loadingAnything: false,
                viewStats: vs,
                viewStatsLoading,
                selectionStats: ss,
                selectionStatsLoading
            }

        } );


    }, [ 
        graphData,
        viewStats.data,
        loading,
        graph.graphState.graphs,
        graph.graphDispatch
    ] );


    return {
        loading,
        graphData,
        viewStats,
        selectionStats,
        hasZoom,
        instances
    }


}