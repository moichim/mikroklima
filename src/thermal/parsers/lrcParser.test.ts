import { describe, expect, test } from '@jest/globals';
import { ThermalFileSource } from '../file/ThermalFileSource';
import { ThermalLoader } from './thermalLoader';

export const SAMPLE_URL = "http://localhost:3000/sample2.lrc";

describe( "ThermalLoader", () => {
    
    test( "in depth test of ThermalLoader and Parsers", async () => {

        const loader = new ThermalLoader( SAMPLE_URL );

        await loader.load();

        const parser = loader._getParserInstance();

        // The parser should exist once the file is loaded
        expect( parser ).not.toBeNull();

        if( parser === undefined ) return false;

        await parser.parse();

        // no errors should be in the parser
        expect( parser.getErrors().length ).toEqual(0);

        // the parser should be valid
        expect(parser.isValid()).toEqual( true );

    } );

    test( "static method in ThermalLoader", async () => {

        const file = await ThermalLoader.fromUrl( SAMPLE_URL );

        expect( file ).toBeInstanceOf( ThermalFileSource );

    } );


} );