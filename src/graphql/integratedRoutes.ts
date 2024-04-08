import gql from "graphql-tag";
import { googleSheetsProvider } from "./google/googleProvider/googleProvider";
import { Sources, WeatherSourceType } from "./weather/definitions/source";
import { GoogleDataColumnDefinition, GoogleScope } from "./google/google";
import { scopeProvider } from "./scope/ScopeProvider";

export type ScopeMetaType = {
    info: GoogleScope,
    googleDataColumns: GoogleDataColumnDefinition[],
    meteoDataSources: WeatherSourceType[]
}


export const integratedTypeDefs = gql`

    extend type Query {
        scopeInformation( scope: String ): ScopeMeta,
    }

    type ScopeMeta {
        info: GoogleScope!
        googleDataColumns: [GoogleColumnDefinition]
        meteoDataSources: [Source]
    }

`;

type ScopeIntormationArgs = {
    scope: string
}

export const integratedResolvers = {

    Query: {
        scopeInformation: async ( 
            parent: any,
            args: ScopeIntormationArgs
        ) => {

            const scopeDefinition = await scopeProvider.fetchScopeDefinition( args.scope );

            const definitions = await googleSheetsProvider.fetchScopeColumnDefinitions( 
                scopeDefinition.sheetId, 
                scopeDefinition.sheetTab 
            );

            let sources = [
                Sources.one( "openmeteo_history" ),
                Sources.one( "openmeteo_forecast" ),
            ];

            if ( scopeDefinition.hasNtc === true ) {
                sources.push( Sources.one( "ntc" ) );
            }

            return {
                info: scopeDefinition,
                googleDataColumns: definitions,
                meteoDataSources: sources
            }



        }
    }

}

