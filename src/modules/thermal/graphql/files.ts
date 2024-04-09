import gql from "graphql-tag";
import { filesProvider } from "./filesProvider";

export type ThermoFileDefinition = {
    filename: string,
    timestamp: number,
    thermalUrl: string,
    visibleUrl?: string
}

export type ThermoFileScope = {
    slug: string,
    name: string,
    description: string
}

export const fileTypeDefs = gql`

    extend type Query {
        scopeFiles( scope: String, from: Float, to: Float ): [ThermalFolderRepsonse]
    }

    type ThermalFolderRepsonse {
        info: ThermalFolderDefinition
        files: [ThermalFileDefinition]
    }


    type ThermalFileDefinition {
        filename: String!
        timestamp: Float
        thermalUrl: String!
        visibleUrl: String
    }

    type ThermalFolderDefinition {
        slug: String!
        name: String!
        scope: String!
        description: String
    }

`;

export const fileResolvers = {
    Query: {

        scopeFiles: async (
            parents: any,
            args: {
                scope: string,
                from?: number,
                to?: number
            }
        ) => {

            const normalize = (number?: number) => {
                if ( number === undefined ) return undefined;
                return parseInt((number / 1000).toFixed(0))
            }

            return  await filesProvider.fetchScopeContent( args.scope, normalize( args.from ), normalize( args.to ) )

            
        },


    }
}