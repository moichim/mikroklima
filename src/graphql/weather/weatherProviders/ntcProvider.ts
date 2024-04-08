
import { dateFromString } from "@/utils/time";
import { WeatherSerie, WeatherEntryDataType, WeatherEntryType, WeatherProviderRequest } from "../weather";
import { Sources, WeatherSourceType } from "../definitions/source";
import { AbstractWeatherProvider, IProvider } from "./abstractProvider";
import { MeteoRequestType } from "@/state/data/processors/query";

type NtcResponseEntryType = {
    id: number,
    time: string,
    temp_out: number,
    hight_out_temperature: number,
    low_out_temperature: number,
    out_hum: number,
    average_wind_speed: number,
    wind_dir: string,
    hi_speed: number,
    hi_dir: number,
    bar: number,
    rain_rate: number,
    solar_rad: number,
    hi_solar_rad: number,
    inside_temp: number,
    inside_humidity: number,
    et: number,
    wind_samp: number,
    high_uv: number
}

export class NtcProvider extends AbstractWeatherProvider {

    protected generateSourceDefinition(): WeatherSourceType {
        return Sources.one( "ntc" );
    }

    protected prepareRequestUrl( from: number, to: number ) {

        const f = ( from / 1000 ) - ( 60 * 60 * 2 );
        const t = (to / 1000) - ( 60 * 60 * 2 );

        return `https://irt.zcu.cz/info/data.php?from=${f}&to=${t}`;

    }

    protected mapResponseToWeatherEntry = ( responseItem: NtcResponseEntryType ):WeatherEntryType  => {
        return {
            time: ( new Date( responseItem.time ) ).getTime(),
            source: "NTC",
            is_forecast: false,
            temperature: responseItem.temp_out,
            wind_dir: 0,
            wind_speed: responseItem.hi_speed,
            bar: responseItem.bar,
            rain: responseItem.rain_rate,
            clouds: 0,
            humidity: responseItem.out_hum,
            uv: responseItem.high_uv,
            radiance: responseItem.solar_rad
        } as WeatherEntryType
    }

    

    public async doRequest ( args: MeteoRequestType ) {

        const url = this.prepareRequestUrl( args.from, args.to );

        const entries = await fetch( url ).then( r => r.json() as unknown as NtcResponseEntryType[] );

        return entries.map( entry => this.mapResponseToWeatherEntry( entry ) ).reverse();

    }

}