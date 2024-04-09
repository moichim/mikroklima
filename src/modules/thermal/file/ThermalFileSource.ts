import { ThermalLoader } from "../parsers/thermalLoader";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalFileInstance } from "./ThermalFileInstance";

/**
 * Stores information about a loaded & parsed thermal file
 * 
 * - loads the file
 * - can create `ThermalFileInstance`
 * - once loaded, the `ThermalFileSource` is cached in `ThermalRegistry.sourcesByUrl`
 * 
 * If a file is cached. The cache is organised by files' URLS. Once a URL is already cached, the existing source us used instead of refetching the file again.
 * 
 * The processing of the file is executed by `Thermalloader`, resp. by parser classes.
 */
export class ThermalFileSource extends EventTarget {

    public constructor(
        public readonly url: string,
        public readonly signature: string,
        public readonly unit: number,
        public readonly width: number,
        public readonly height: number,
        public readonly timestamp: number,
        public readonly pixels: number[],
        public readonly min: number,
        public readonly max: number,
        public readonly visibleUrl?: string
    ) {
        super();
    }

    public static async fromUrl(
        thermalUrl: string,
        visibleUrl?: string
    ) {
        const file = await ThermalLoader.fromUrl( thermalUrl, visibleUrl );

        if ( ! file )
            return null;

            return file;
    }

    public createInstance(
        group: ThermalGroup
    ) {
        return new ThermalFileInstance( this, group );
    }

}