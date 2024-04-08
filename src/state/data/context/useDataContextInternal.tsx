import { GoogleColumn, GoogleColumnStats, GoogleScope } from "@/graphql/google/google";
import { AvailableWeatherProperties, WeatherProperty } from "@/graphql/weather/definitions/properties";
import { WeatherSourceType } from "@/graphql/weather/definitions/source";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphDomain, GraphInstanceScales, GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { useGraphInternal } from "@/state/graph/useGraphInternal";
import { BufferEntryType } from "@/state/data/processors/responseProcessing";
import { useMemo } from "react";
import { useData } from "../useData";
import { useGraphContext } from "@/state/graph/graphContext";

export type GraphInstanceHeightSetter = (height: GraphInstanceScales) => void;

export type GraphInstanceDomainSetter = (domain: GraphDomain, min?: number | "auto", max?: number | "auto") => void;

export type GraphInstancePropertySetter = (property: AvailableWeatherProperties) => void;

export type GraphInstanceProps = {
    
    graphData?: {
        dots: GoogleColumn[],
        lines: WeatherSourceType[],
        data: BufferEntryType[]
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

export const useDataContextInternal = (
    scope: GoogleScope,
    fixedTime?: { from: number, to: number }
) => {

    const data = useData( scope, fixedTime );

    const graph = useGraphContext();

    const instances = useMemo( (): GraphInstanceProps[] => {

        return Object.values( graph.graphState.graphs ).map( instance => {

            const graphData = data.graphData.data
                ? data.graphData.data[ instance.property.slug ]
                : undefined;


            // View Statistics
            
            let viewStats: GoogleColumnStats[] | undefined = undefined;
            let viewStatsLoading = data.viewStats.loading;

            if ( data.viewStats.data ) {
                
                // Google Statistics
                const statistics = Object.values( data.viewStats.data.dots ).filter( dot => dot.in.slug === instance.property.slug ).filter( dot => dot.count > 0 );

                // MeteoStatistics
                const lines = Object.values( data.viewStats.data.lines ).filter( line => line.in.slug === instance.property.slug ).filter( line => line.count > 0 );

                viewStats = [
                    ...statistics,
                    ...lines
                ]

            }



            // Selection Statistics
            let selectionStats: GoogleColumnStats[] | undefined = undefined;
            let selectionStatsLoading = data.selectionStats.loading;

            if ( data.selectionStats.data ) {
                // Google Statistics
                const statistics = Object.values( data.selectionStats.data.dots ).filter( dot => dot.in.slug === instance.property.slug ).filter( dot => dot.count > 0 );

                // MeteoStatistics
                const lines = Object.values( data.selectionStats.data.lines ).filter( line => line.in.slug === instance.property.slug ).filter( line => line.count > 0 );

                selectionStats = [
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
                graphData,
                state,
                setProperty,
                setHeight,
                setDomain,
                availableProperties,
                loadingData: data.loading,
                loadingAnything: false,
                viewStats,
                viewStatsLoading,
                selectionStats,
                selectionStatsLoading
            }

        } );


    }, [ 
        data.graphData,
        data.viewStats.data,
        data.loading,
        graph.graphState.graphs,
        graph.graphDispatch
    ] );

    return {
        data,
        graph,
        instances
    }

}