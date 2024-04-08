"use client";

import { ThermalFileSource } from "../../file/ThermalFileSource";
import { ThermalGroup } from "../ThermalGroup";

export type ThermalFileRequest = {
    thermalUrl: string,
    visibleUrl?: string
}

/**
 * A request for a thermal file is created and stored by a `ThermalGroup`
 * 
 * - The request is created at first and triggered later.
 * - All the group's requests need to be triggered at once
 * 
 * When triggered, the request looks for the file in the cache. If the file is not cached yet, the request tries to fetch it from the URL.
 * 
* @todo Stores the entire instance of the group. Should store only the ID, because the group instances may change.
 */
export class ThermalRequest extends EventTarget {

    protected constructor(
        public readonly group: ThermalGroup,
        public readonly url: string,
        public readonly visibleUrl?: string
    ) {
        super();
    }

    public static single(
        group: ThermalGroup,
        thermalUrl: string,
        visibleUrl?: string
    ) {
        return new ThermalRequest( group, thermalUrl, visibleUrl );
    }

    public static multiple( 
        group: ThermalGroup,
        requests: ThermalFileRequest[]
    ) {
        return requests.map( request => new ThermalRequest( group, request.thermalUrl, request.visibleUrl ) );
    }

    public async fetch() {

        if ( this.group.registry.manager.isUrlRegistered( this.url ) ) {
            return {
                file: this.group.registry.manager.sourcesByUrl[ this.url ],
                request: this
            };
        }

        const file = await ThermalFileSource.fromUrl( this.url, this.visibleUrl ) as unknown as ThermalFileSource;

        if ( !file ) {
            return null;
        } else if ( file !== null ) {
            return {
                file,
                request: this
            };
        }

        return null;

        

    }

}