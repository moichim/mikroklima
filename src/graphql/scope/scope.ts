import gql from "graphql-tag";
import { scopeProvider } from "./ScopeProvider";

export const scopesTypeDefs = gql`

extend type Query {

    scopes: [GoogleScope]
    scope( scope: String! ): GoogleScope

}

type GoogleScope {
    name: String!
    slug: String!
    sheetId: String!
    sheetTab: String!
    lat: Float!
    lon: Float!
    hasNtc: Boolean!
    isDefault: Boolean!
    team: String!
    locality: String!
    description: String!
    start: String
    count: Int
}

`;

export const scopeResolvers = {

    Query: {

        scopes: async () => {
            const response = await scopeProvider.fetchAllScopesDefinitions();
            return response;
        },
        scope: async (
            parent: any,
            args: {
                scope: string
            }
        ) => {
            return await scopeProvider.fetchScopeDefinition( args.scope );
        }

    }

}