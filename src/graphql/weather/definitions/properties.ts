import { WeatherEntryDataType } from "../weather"
import { AvailableSources, Sources } from "./source"

const WeatherPropsDataTypes = {
    Int: "number",
    Float: "number",
    String: "string"
}

export type WeatherPropertyDefinitionType = {
    type: keyof typeof WeatherPropsDataTypes,
    unit?: string,
    name: string,
    field: keyof WeatherEntryDataType,
    color: string,
    min: number,
    max: number,
    description?: string
}

const properties: {
    [T in keyof WeatherEntryDataType]: WeatherPropertyDefinitionType
} = {
    temperature: {
        type: "Float",
        unit: "°C",
        name: "Teplota",
        field: "temperature",
        color: "bg-red-500",
        min: -10,
        max: 40
    },
    /*
    wind_dir: {
        type: "Float",
        name: "Směr větru",
        field: "wind_dir",
        color: "bg-green-500",
        min: 0,
        max: 360
    },
    */
    wind_speed: {
        type: "Float",
        name: "Rychlost větru",
        field: "wind_speed",
        unit: "m/s",
        color: "bg-blue-500",
        min: 0,
        max: 100
    },
    bar: {
        type: "Float",
        name: "Tlak",
        field: "bar",
        unit: "hPa",
        color: "bg-yellow-700",
        min: 0,
        max: 1200
    },
    rain: {
        type: "Float",
        name: "Srážky",
        field: "rain",
        color: "bg-violet-700",
        min: 0,
        max: 8
    },
    clouds: {
        type: "Float",
        name: "Oblačnost",
        field: "clouds",
        color: "bg-orange-300",
        unit: "%",
        min: 0,
        max: 100
    },
    humidity: {
        type: "Float",
        name: "Vlhkost vzduchu",
        field: "humidity",
        unit: "%",
        color: "bg-teal-300",
        min: 0,
        max: 100
    },
    radiance: {
        type: "Float",
        name: "Sluneční svit",
        field: "radiance",
        unit: "W/m2",
        color: "bg-teal-300",
        min: 0,
        max: 1000,
    },
    uv: {
        type: "Float",
        name: "UV",
        field: "uv",
        color: "bg-pink-400",
        min: 0,
        max: 255
    },

    /*
    snow_depth: {
        type: "Float",
        name: "Sníh - hloubka",
        field: "snow_depth",
        color: "bg-pink-400",
        min: 0,
        max: 255
    },
    */
    evapotranspiration: {
        type: "Float",
        name: "Evapotranspirace",
        field: "evapotranspiration",
        color: "bg-pink-400",
        min: 0,
        max: 1
    }
}

export type WeatherProperty = ReturnType<typeof Properties["formatOne"]>

export type AvailableWeatherProperties = keyof typeof properties;

export class Properties {

    public static pickRandomPropertySlug(): AvailableWeatherProperties {
        return Object.keys(properties)
            .sort(() => (Math.random() * 2) - 1)
        [0] as AvailableWeatherProperties;
    }

    public static pickRandomProperty(): WeatherProperty {
        return Properties.formatOne(Properties.pickRandomPropertySlug());
    }


    protected static keys() {
        return Object.keys(properties) as AvailableWeatherProperties[];
    }

    public static skeleton() {
        return Object.fromEntries(
            Object.entries(properties)
                .map(([key,]) => [key as AvailableWeatherProperties, [] as number[]])
        ) as {
                [K in AvailableWeatherProperties]: number[]
            };
    }

    protected static formatOne(slug: keyof WeatherEntryDataType) {
        return {
            ...properties[slug],
            in: Sources.ofProperty(slug).map(source => source.slug),
            slug: slug
        }
    }

    public static all() {
        return Object.keys(properties).map(slug => Properties.formatOne(slug as keyof WeatherEntryDataType));
    }

    public static index() {
        return Object.fromEntries(
            Object.entries(properties)
                .map(([slug, prop]) => [slug, Properties.formatOne(slug as AvailableWeatherProperties)])
        )
    }

    public static one(slug: keyof WeatherEntryDataType) {
        return Properties.formatOne(slug);
    }

    public static ofSource(source: AvailableSources) {
        return Sources.one(source).props.map(key => properties[key]);
    }
}