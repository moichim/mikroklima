import { WeatherProperty } from "@/graphql/weather/definitions/properties"
import { GraphDataType } from "./dataMapping"

/** Graph data */

export type DataGraphResponseEntryType = {
    time: number,
    note?: string
} & {
    [index:string]: number
}

export type DataGraphResponseSerieType = {
    name: string,
    color: string,
    description?: string,
    unit: string,
    /** The source slug internal */
    sourceSlug: string,
    /** Identifies the data key in the global data object */
    dataKey: string,
    type: GraphDataType,
    in: WeatherProperty,

}

export type DataGraphResponseType = {

    resourcesMap: {
        [index:string]: {
            [index: string]: DataGraphResponseSerieType,
        }
    },

    data: DataGraphResponseEntryType[],
    images: {
        [index:number]: {
            [index:string]: number
        }
    }

}





/** Graph statistics */

export type DataStatisticsResponseEntryType = {

    dataKey: string,
    avg: number,
    min: number,
    max: number,
    count: number

}

export type DataGraphStatisticsRowType = {
    dataKey: string,
    name: string,
    color: string,
    in: WeatherProperty,
    description?: string
}


export type DataStatisticsResponseType = {

    data: DataStatisticsResponseEntryType[],

}