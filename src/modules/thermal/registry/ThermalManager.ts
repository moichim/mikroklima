import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalRegistry } from "./ThermalRegistry";
import { PaletteDrive } from "./properties/drives/palette/PaletteDrive";

export class ThermalManager extends EventTarget {

    /* registries */

    public readonly _registries: {
        [index: string]: ThermalRegistry
     } = {};

     public forEveryRegistry( fn: ( ( registry: ThermalRegistry ) => any ) ) {
        Object.values( this._registries ).forEach( registry => fn( registry ) );
     }

    public addOrGetRegistry(
        id: string
    ) {
        if ( this._registries[id] === undefined ) {
            this._registries[id] = new ThermalRegistry(id, this);
        }

        return this._registries[id];
        
    }

    public removeRegistry(
        id: string
    ) {
        if ( this._registries[id] !== undefined ) {
            const registry = this._registries[id];
            registry.destroySelfAndBelow();
            delete this._registries[id];
        }
    }



    /** The palette is stored absolutely globally */
    /**
     * Palette
     */
    public readonly palette: PaletteDrive = new PaletteDrive(this, "jet");





    /** Sources cache */

    protected _sourcesByUrl: {
        [index: string]: ThermalFileSource
    } = {}
    public get sourcesByUrl() { return this._sourcesByUrl; }
    public getSourcesArray() {
        return Object.values(this.sourcesByUrl);
    }
    public getRegisteredUrls() {
        return Object.keys(this.sourcesByUrl);
    }
    public registerSource(
        source: ThermalFileSource
    ) {
        if (!this.getRegisteredUrls().includes(source.url)) {

            // Assign the source
            this.sourcesByUrl[source.url] = source;

            return source;

        }

        return this.sourcesByUrl[source.url];
    }
    public isUrlRegistered = (url: string) => Object.keys(this.sourcesByUrl).includes(url);

}