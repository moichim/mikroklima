import { WeatherEntryDataType, WeatherEntryMetaType, WeatherEntryType } from "../weather"
import { Properties, WeatherPropertyDefinitionType } from "./properties"

type WeatherSourceBaseType = {
    name: string,
    color: string,
    stroke: string,
    props: Array<keyof WeatherEntryDataType>,
    description: string,
    link?: string,
}

type WeatherSourceInternalType = WeatherSourceBaseType

export type WeatherSourceType = WeatherSourceBaseType & {
    slug: string
}

const sources: {
    [index: string]: WeatherSourceInternalType
} = {
    ntc: {
        name: "Meteostanice Teslova",
        color: "red",
        stroke: "red",
        description: "Meteostanice umístěná na střeše laboratoří NTC.",
        props: [
            "temperature",
            // "wind_dir",
            "wind_speed",
            "bar",
            // "clouds",
            "humidity",
            "uv",
            // "rain",
            "radiance"
        ]
    },
    openmeteo_forecast: {
        name: "Open Meteo - předpověď",
        color: "black",
        stroke: "black",
        description: "Předpověď počasí z veřejně dostupné služby Open Meteo. Od 3 dní zpětně do budoucnosti.",
        link: "https://open-meteo.com/",
        props: [
            "temperature",
            "wind_dir",
            "wind_speed",
            "uv",
            "humidity",
            "bar",
            "clouds",
            "rain",
            "uv",
            "radiance",
            "snow_depth",
            "evapotranspiration"
        ]
    },
    openmeteo_history: {
        name: "Open Meteo - historická data",
        color: "green",
        stroke: "green",
        description: "Historické údaje ze služby Open Meteo. Maximálně 3 dny nazpět.",
        link: "https://open-meteo.com/",
        props: [
            "temperature",
            "wind_dir",
            "wind_speed",
            "uv",
            "humidity",
            "bar",
            "clouds",
            "rain",
            "uv",
            "radiance",
            "snow_depth",
            "evapotranspiration"
        ]
    }
}

export type AvailableSources = keyof typeof sources;

export class Sources {

    protected static formatOne( slug: AvailableSources ): WeatherSourceType {
        return {
            ...sources[slug],
            slug: slug as string
        }
    }

    public static all() {
        return Object.keys( sources ).map( (slug) => Sources.formatOne( slug ) )
    }

    public static one(slug: AvailableSources) {
        return Sources.formatOne( slug );
    }

    public static ofProperty(property: keyof WeatherEntryDataType) {
        return Object.entries( sources )
            .filter(([slug,source]) => source.props.includes(property))
            .map( ([slug, source]) => Sources.formatOne( slug ));
    }

}

