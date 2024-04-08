import { fetchWeatherApi } from "openmeteo";
import { WeatherSerie, WeatherEntryType, WeatherProviderRequest } from "../weather";
import { AbstractWeatherProvider, IProvider } from "./abstractProvider";
import { Sources, WeatherSourceType } from "../definitions/source";
import { MeteoRequestType } from "@/state/data/processors/query";
import { stringFromTimestamp } from "@/utils/time";
import { subDays } from "date-fns";

export class OpenMeteoHistoryProvider extends AbstractWeatherProvider {

    protected fields = ["temperature_2m", "relative_humidity_2m", "precipitation", "snow_depth", "surface_pressure", "cloud_cover", "et0_fao_evapotranspiration", "wind_speed_10m", "wind_direction_10m", "direct_radiation"]

    protected generateSourceDefinition(): WeatherSourceType {
        return Sources.one("openmeteo_history");
    }

    protected getMaxTo(): number {
        const date = subDays( new Date(), 3 );
        date.setUTCHours( 23 );
        date.setUTCMinutes( 59 );
        date.setUTCSeconds( 0 );
        date.setUTCMilliseconds( 0 );
        return date.getTime();
    }

    protected clampTo( providedTo: number ): number {
        return Math.min( this.getMaxTo(), providedTo );
    }

    public async doRequest(args: MeteoRequestType) {

        const clampedTo = this.clampTo(args.to);

        if (clampedTo < args.from) return [];

        const from = stringFromTimestamp(args.from );
        const to = stringFromTimestamp( clampedTo );

        const params = {
            "latitude": args.lat,
            "longitude": args.lon,
            "hourly": this.fields,
            "start_date": from,
            "end_date": to
        };
        const url = "https://archive-api.open-meteo.com/v1/archive";
        const responses = await fetchWeatherApi(url, params);

        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();

        const hourly = response.hourly()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {

            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
                precipitation: hourly.variables(2)!.valuesArray()!,
                snowDepth: hourly.variables(3)!.valuesArray()!,
                surfacePressure: hourly.variables(4)!.valuesArray()!,
                cloudCover: hourly.variables(5)!.valuesArray()!,
                et0FaoEvapotranspiration: hourly.variables(6)!.valuesArray()!,
                windSpeed10m: hourly.variables(7)!.valuesArray()!,
                windDirection10m: hourly.variables(8)!.valuesArray()!,
                directRadiation: hourly.variables(9)!.valuesArray()!,
            },

        };

        const getValue = <T extends string | number = number>(
            key: keyof typeof weatherData["hourly"],
            index: number
        ) => {
            return weatherData.hourly[key][index] as T;
        }

        return weatherData.hourly.time
            .filter(date => date.getTime() >= args.from && date.getTime() <= args.to)
            .map((date, index) => {

                return {
                    time: date.getTime(),
                    temperature: getValue("temperature2m", index),
                    humidity: getValue("relativeHumidity2m", index),
                    wind_dir: getValue("windDirection10m", index),
                    wind_speed: getValue("windSpeed10m", index),
                    bar: getValue("surfacePressure", index),
                    rain: getValue("precipitation", index),
                    clouds: getValue("cloudCover", index),
                    radiance: getValue("directRadiation", index),
                    evapotranspiration: getValue("et0FaoEvapotranspiration", index)
                } as WeatherEntryType;

            })

    }

}