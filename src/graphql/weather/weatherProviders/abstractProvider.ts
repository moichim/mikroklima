import { MeteoRequestType } from "@/state/data/processors/query";
import { WeatherSerie, WeatherEntryType, WeatherProviderRequest, WeatherSerieIndexType, WeatherStatistics, WeatherStatistic } from "../weather";
import { WeatherSourceType } from "../definitions/source";
import { Properties } from "../definitions/properties";
import { GoogleColumnStats } from "@/graphql/google/google";

export interface IProvider {

    fetch: ( from: string, to: string ) => Promise<WeatherEntryType[]>

    // single: ( time: number ) => Promise<Serie>

}

export type AbstractWeatherProviderRawEntryType = {};

export abstract class AbstractWeatherProvider {

    protected source?: WeatherSourceType;

    /** Get the source definition with all its metadata */
    public getSource(): WeatherSourceType {
        if ( this.source === undefined )
            this.source = this.generateSourceDefinition();
        return this.source;
    }

    protected abstract generateSourceDefinition(): WeatherSourceType;

    public async fetch( 
        args: MeteoRequestType 
    ): Promise<WeatherSerie> {

        return await this.doRequest( args ).then( response => {
            return {
                source: this.getSource(),
                entries: response
            }
        } )

    }

    public async fetchStatistics(
        args: MeteoRequestType
    ): Promise<GoogleColumnStats[]> {

        return await this.doRequest( args ).then( response => {
            return this.calculateStatistics( response )
        } );

    }

    protected abstract doRequest( 
        args: MeteoRequestType 
    ): Promise<WeatherEntryType[]>;

    protected calculateStatistics( payload: WeatherSerie["entries"] ): GoogleColumnStats[] {

        const properties = Properties.all().map( p => p.slug );

        const result = properties.map( propertySlug => {

            let min: number|undefined = payload.reduce( (state, current) => {

                if ( current[propertySlug]! < state )
                    return current[propertySlug] as number;
                return state;

            }, Infinity );

            let max: number|undefined = payload.reduce( (state, current) => {

                if ( current[propertySlug]! > state )
                    return current[propertySlug] as number;
                return state;

            }, -Infinity );

            const count = payload.length;

            const avg = payload.reduce( (state, current) => {
                return state + current[propertySlug]!
            }, 0 ) / count;

            min = min === Infinity ? undefined : isNaN(min) ? undefined : min;
            max = max === -Infinity ? undefined : isNaN(max) ? undefined : max;

            const property = Properties.one( propertySlug )!;

            const source = this.getSource();

            const statistics: GoogleColumnStats = {
                name: source.name,
                color: source.color,
                slug: [
                    propertySlug, 
                    source.slug
                ].join( "_" ),
                description: property.description,
                in: property,
                min: min ?? null,
                max: max ?? null,
                avg: isNaN(avg) ? null : avg, 
                count
            }

            return statistics;
        } );

        return result;

    }

}
