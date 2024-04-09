import { ScopeProvider, scopeProvider } from "@/graphql/scope/ScopeProvider";

export class FilesProvider {

    public constructor(
        protected readonly scopeProvider: ScopeProvider
    ){

    }

    public async fetchScopeContent(
        scope: string,
        from?: number,
        to?: number
    ) {

        let url = ScopeProvider.baseUrl + scope + "/content";

        const append: string[] = [];

        if ( from !== undefined ) {
            append.push( `from=${from}` );
        }

        if ( to !== undefined ) {
            append.push( `to=${to}` );
        }

        if ( append.length > 0 ) {
            url += `?${append.join( "&" )}`;
        }


        const response = await fetch( url );

        const json = await response.json();

        return json;
    }

}

export const filesProvider = new FilesProvider( scopeProvider );