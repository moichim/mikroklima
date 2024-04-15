import { MeteoQueryResponseType } from "@/modules/meteo/processors/query";
import { DataGraphResponseEntryType, DataGraphResponseSerieType, DataGraphResponseType } from "./interfaces";
import { storeKeyNameFromField } from "@apollo/client/utilities";
import { AvailableWeatherProperties, Properties } from "@/graphql/weather/definitions/properties";
import { Sources } from "@/graphql/weather/definitions/source";
import {roundToNearestHours} from "date-fns";

export enum GraphDataType {
    LINE = "line",
    DOT = "dot",
    IMAGE = "thermalimage"
}

export class DataMapping {

    static KEY_SEPARATOR = "___";

    public constructor(
        public readonly response: MeteoQueryResponseType
    ) {

    }


    static getKey(
        type: GraphDataType,
        source: string,
        property: string
    ) {
        return [
            type,
            source,
            property
        ].join( DataMapping.KEY_SEPARATOR );
    }






    /**
     * GraphProcessing
     */



    static processGraph(
        response: MeteoQueryResponseType
    ): DataGraphResponseType {

        const mapper = new DataMapping( response );
        return mapper.getMappedGraphResponse();

    }

    protected bufGraphDataByTime: {
        [ index: number ]: DataGraphResponseEntryType
     } = {};
    protected getGraphDataFromBuffer() {
        return Object.values( this.bufGraphDataByTime )
            .sort( (a,b) => a.time - b.time );
    }



    /** Add a graph time entry record to the buffer */
    protected addGraphDataEntry(
        type: GraphDataType,
        time: number,
        source: string,
        property: string,
        value: number
    ) {

        const ID = DataMapping.getKey( type, source, property );

        if ( time.toString() in this.bufGraphDataByTime ) {
            this.bufGraphDataByTime[time][ID] = value
        } else {
            this.bufGraphDataByTime[time] = {
                time: time,
                [ID]: value
            }
        }

    }


    protected bufGraphResorcesByProperty: {
        [index: string]: {
            [index:string]: DataGraphResponseSerieType
        }
    } = {}


    protected addGraphResource(
        type: GraphDataType,
        property: string,
        source_slug: string,
        name: string,
        color: string,
        unit: string,
        description?: string,
    ) {

        const getResource = (): DataGraphResponseSerieType => ({
            type,
            sourceSlug: source_slug,
            dataKey: DataMapping.getKey( type, source_slug, property ),
            name: name,
            color,
            unit,
            description,
            in: Properties.one( property as AvailableWeatherProperties )
        })

        if ( property in this.bufGraphResorcesByProperty ) {

            if ( source_slug in this.bufGraphResorcesByProperty[property] ) {

            } else {
                this.bufGraphResorcesByProperty[property][source_slug] = getResource()
            }

        } else {

            this.bufGraphResorcesByProperty[ property ] = {
                [source_slug]: getResource()
            }

        }


    }

    protected thermograms: {
        [index:number]: {
            [index:string]: number
        }
    } = {};

    protected addThermogram(
        timestamp: number,
        groupName: string
    ) {

        const roundedTimestamp = roundToNearestHours( timestamp ).getTime();

        if (roundedTimestamp.toString() in this.thermograms ) {

            this.thermograms[ roundedTimestamp ][ groupName ] = timestamp;

        } else {
            this.thermograms[ roundedTimestamp ] = {
                [groupName]: timestamp
            }
        }

    }



    protected mapGraphResponse(): void {

        this.response.rangeMeteo.data.forEach( entry => {

            const source = entry.source;
            const entries = entry.entries;

            entries.forEach(item => {

                Object.entries(item)
                    .filter(([key, _]) => {

                        return !key.startsWith("_")
                            && key !== "time";

                    })
                    .forEach(([key, value]) => {

                        const property = Properties.one( key as AvailableWeatherProperties );

                        this.addGraphDataEntry(GraphDataType.LINE, item.time, source.slug, key, value);

                        this.addGraphResource( GraphDataType.LINE, key, source.slug, source.name, source.color, property.unit ?? "___", source.description );

                    });

            });

        } );


        this.response.rangeGoogle.data.forEach(column => {

            column.values.forEach(value => {

                this.addGraphDataEntry(GraphDataType.DOT, value.time, column.slug, column.in.slug, value.value);

                this.addGraphResource( GraphDataType.DOT, column.in.slug, column.slug, column.name, column.color, column.in.unit ?? "___", column.description ?? "___" );

            })

        });

        this.response.scopeFiles.forEach( group => {

            group.files.forEach( file => {

                this.addThermogram( 
                    file.timestamp * 1000,
                    group.info.name
                );

            } );

        } );



    }

    public getMappedGraphResponse(): DataGraphResponseType {

        this.mapGraphResponse();

        const mappedFromBuffer = this.getGraphDataFromBuffer();

        return {
            data: mappedFromBuffer,
            images: this.thermograms,
            resourcesMap: this.bufGraphResorcesByProperty
        }

    }


}
