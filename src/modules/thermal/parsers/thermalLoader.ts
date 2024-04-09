import fetch from 'cross-fetch';

import AbstractParser from "./AbstractParser";
import LrcParser from './lrcParser';

/**
 * Loader of thermal files from the web.
 * - use the static method `ThermalLoader.fromUrl()` - all other public methods are only for the purpose of testing.
 * - `assignParserInstance` should return a Parser object based on loaded file type
 */
export class ThermalLoader {

    protected thermalUrl: string;
    protected visibleUrl?: string;
    protected parser?: AbstractParser;

    constructor( 
        url: string,
        visibleUrl?: string
    ) {
        this.thermalUrl = url;
        this.visibleUrl = visibleUrl;
    }

    /** Load a thermal file and return a `ThermalFile` instance. */
    public static async fromUrl(
        thermalUrl: string,
        visibleUrl?: string
    ) {
        const loader = new ThermalLoader( thermalUrl, visibleUrl );
        return await loader.load();
    }

    /** INTERNAL - loads a file and parses it. */
    public async load() {
        return await this.loadFile().then( file => file.parse() );
    }

    /** INTERNAL - load a file and return the parser. */
    protected async loadFile() {

        const blob = await fetch(this.thermalUrl)
            .then(response => {
                const b = response.blob();
                return b;
            });

        if (blob === undefined)
            throw new Error(`File '${this.thermalUrl}' was not found!`);

        this.parser = this.assignParserInstance( blob );

        return this.parser;

    }

    /** INTERNAL - determine the file type and return the corresponding parser. @todo In the future, new parsers shall be added. */
    protected assignParserInstance( blob: Blob ) {
        return new LrcParser( this.thermalUrl, blob, this.visibleUrl );
    }

    /** INTERNAL - return the current parser instance. */
    public _getParserInstance() {
        return this.parser;
    }

}