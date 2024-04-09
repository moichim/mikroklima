import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties"
import { GraphTools } from "../data/tools";
import { WeatherProperty } from "@/graphql/weather/definitions/properties";
import { Properties } from "@/graphql/weather/definitions/properties";

export enum GraphDomain {
    DEFAULT = "default",
    AUTO = "auto",
    MANUAL = "manual"
}

export const graphInstanceHeights = {
    sm: 100, 
    md: 300, 
    lg: 500, 
    xl: 750, 
    "2xl": 1000
};

export type GraphInstanceScales = keyof typeof graphInstanceHeights;

export type GraphInstanceState = {
    weight: number,
    scale: GraphInstanceScales,
    domain: GraphDomain,
    domainMin: number|"auto",
    domainMax: number|"auto",
    isSelecting: boolean,
    /** @deprecated should be flat, so it is advided this is converted into string */
    property: WeatherProperty,
    id?: string
}

export type GraphStackState = {
    sharedScale?: GraphInstanceScales,
    isSelecting: boolean,
    selectionStart?: number,
    selectionEnd?: number,
    activeTool: GraphTools,
    tourPassed?: boolean,
    tourActive: boolean,
    tourCurrentStep: number,
    graphs: {
        [T in AvailableWeatherProperties]?: GraphInstanceState
    }
    availableGraphs: WeatherProperty[],
    barExpanded: boolean,
    barContent?: React.ReactNode
}

export class GraphStateFactory {

    public static defaultState(
        properties: AvailableWeatherProperties[] = [ "temperature", "radiance", "humidity" ]
    ): GraphStackState {
        return {
            sharedScale: "md",
            isSelecting: false,
            activeTool: GraphTools.SELECT,
            tourActive: false,
            tourCurrentStep: 0,
            graphs: Object.fromEntries( properties.map( property => {
                const definition = GraphStateFactory.defaultInstanceState(property);
                return [ property, definition ];
            } ) ),
            selectionStart: undefined,
            selectionEnd: undefined,
            availableGraphs: Properties.all().filter( property => ! properties.includes( property.slug ) ),
            barExpanded: false,
            barContent: undefined
        }
    }

    public static defaultInstanceState( 
        property: AvailableWeatherProperties,
        height: GraphInstanceScales = "md",
        weight: number = 999
    ): GraphInstanceState {
        const definition = Properties.one( property );
        return {
            property: definition,
            weight: weight,
            domain: GraphDomain.AUTO,
            domainMin: definition.min!,
            domainMax: definition.max!,
            isSelecting: false,
            scale: height
        }
    }

}