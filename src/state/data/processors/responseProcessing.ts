import { Properties } from "@/graphql/weather/definitions/properties";
import { Sources } from "@/graphql/weather/definitions/source";
import { MeteoQueryResponseType } from "./query";

export type BufferEntryType = {
    [index:string]: number|undefined
} & {
    time: number,
    note?: string
}

type BufferType = {
    [index: string]: BufferEntryType
}

const properties = Properties.all();

export class MeteoResponseProcessor {

    public static process(
        response: MeteoQueryResponseType
    ) {

        let drive = MeteoResponseProcessor.generateTheDrive( response );

        // Namapovat google values na index podle času
        const googleIndex = MeteoResponseProcessor.dumpGoogleDataToTimeEntries( response.rangeGoogle );
        const weatherIndex = MeteoResponseProcessor.dumpWeatherSerieToTimeEntries( response.rangeMeteo );

        // Iteruje všechny properties a vrátí index namapovaných dat pro graf
        const graphData = Object.fromEntries( properties.map(property => {

            // pro každou property najít její zdroje
            const propertySources = property.in;

            // pro každou property najít sloupce v Googlu, které sem patří
            const propertyColumns = response.rangeGoogle.data.filter( column => column.in.slug === property.slug );

            // Pro každou property iterovat drive
            const propertyGraphData = drive.map( leadEntry => {

                // extract leading time
                const leadTimestamp = leadEntry.time;

                // create graph entry
                const currentTimeEntry: BufferEntryType = {
                    time: leadTimestamp,
                    note: undefined
                }

                // extract value for each source of this property
                for ( let propertySource of propertySources ) {

                    const indexOfEntriesForThisSource = weatherIndex[ propertySource ];

                    if ( indexOfEntriesForThisSource ) {

                        const entryForThisTimestamp = indexOfEntriesForThisSource[ leadTimestamp ];

                        if ( entryForThisTimestamp ) {

                            const currentValue = entryForThisTimestamp[ property.slug ]!;

                            currentTimeEntry[ propertySource ] = currentValue;

                        } else {
                            currentTimeEntry[ propertySource ] = undefined;
                        }

                    } else {
                        currentTimeEntry[ propertySource ] = undefined;
                    }

                };

                // Extract value for each google value
                for ( let propertyColumn of propertyColumns ) {

                    const entryForThisTimestamp = googleIndex[ leadTimestamp ];

                    if ( entryForThisTimestamp ) {

                        const currentValue = entryForThisTimestamp[ propertyColumn.slug ];

                        currentTimeEntry[ propertyColumn.slug ] = entryForThisTimestamp[ propertyColumn.slug ] ?? undefined;
                        currentTimeEntry["note"] = entryForThisTimestamp["note"];


                    } else {
                        currentTimeEntry[ propertyColumn.slug ] = undefined;
                    }

                }

                return currentTimeEntry;


            } );


            const propertyGraphContent = {
                dots: propertyColumns,
                lines: propertySources.map( source => Sources.one( source )  ),
                data: propertyGraphData
            }


            return [property.slug, propertyGraphContent ]

        }));

        return graphData;


    }

    protected static generateTheDrive( response: MeteoQueryResponseType ): {time:number}[] {

        let drive: {
            time: number
        }[] = [];

        for ( let i = response.rangeMeteo.request.from; i < response.rangeMeteo.request.to; i = i + (1000*60*60) ) {
            drive.push( {time: i} );
        }

        return drive;

    }

    protected static dumpWeatherSerieToTimeEntries(
        weather: MeteoQueryResponseType["rangeMeteo"]
    ) {

        return Object.fromEntries( weather.data.map( serie => {
            const timedEntries = Object.fromEntries( serie.entries.map( entry => [entry.time, entry] ) );
            return [ serie.source.slug, timedEntries ]
        } ) );

    }

    protected static dumpGoogleDataToTimeEntries(
        google: MeteoQueryResponseType["rangeGoogle"]
    ) {

        let buffer: BufferType = {};

        for (let column of google.data) {

            for (let entry of column.values) {

                if (Object.keys(buffer).includes(entry.time.toString())) {
                    buffer[entry.time][column.slug] = entry.value;
                } else {
                    buffer[entry.time] = {
                        time: entry.time,
                        [column.slug]: entry.value,
                        note: entry.note
                    } as BufferEntryType
                }

            }

        }

        return buffer;

    }

}

export type MeteoDataProcessed = ReturnType<typeof MeteoResponseProcessor["process"]>