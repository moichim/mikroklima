import { ApolloError } from "@apollo/client";
import { GoogleScope } from "../google/google";

/**
 * Handles communication with edu.labir.cz scopes
 */
export class ScopeProvider {

    public static baseUrl: string = "https://edu.labir.cz/scopes/";

    protected getUrl( urlWithInitialSlash: string ) {
        return ScopeProvider.baseUrl + urlWithInitialSlash;
    }


    protected cachedResult: {
        [index: string]: GoogleScope
    } = {};


    protected storeCachedResults(scopes: GoogleScope[]) {
        this.cachedResult = Object.fromEntries(scopes.map(s => [s.slug, s]));
    }


    protected storeCachedResult(scope: GoogleScope) {
        this.cachedResult[scope.slug] = scope;
    }


    protected getCachedResult(slug: string) {
        return Object.keys(this.cachedResult).includes(slug)
            ? this.cachedResult[slug]
            : undefined;
    }


    protected getCachedResults() {
        return Object.entries(this.cachedResult).length > 0
            ? Object.values(this.cachedResult)
            : undefined;
    }

    public async fetchScopeDefinition(scope: string) {

        const scopes = await this.fetchAllScopesDefinitions();

        const result = scopes.find(row => row.slug === scope);

        if (result === undefined)
            throw new ApolloError({
                errorMessage: `Scope ${scope} not found!`
            });

        return result;

    }


    public async fetchAllScopesDefinitions(): Promise<GoogleScope[]> {

        const cached = this.getCachedResults();

        if (cached) {
            return cached;
        }

        const file = await fetch( ScopeProvider.baseUrl );

        const data = await file.json();

        this.storeCachedResults( data );

        return data;

    }

}

export const scopeProvider = new ScopeProvider;