import { AvailableWeatherProperties, Properties } from "@/graphql/weather/definitions/properties";
import { Sources } from "@/graphql/weather/definitions/source";
import { MeteoQueryResponseType } from "./query";
import { DataMapping } from "@/modules/data/graphql/dataMapping";

export type BufferEntryType = {
    [index: string]: number | undefined
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

        return DataMapping.processGraph( response );
    }

}
