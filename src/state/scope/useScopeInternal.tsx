import { GoogleScope } from "@/graphql/google/google";
import { useReducer } from "react";
import { ScopeActionBase } from "./reducerInternals/actions";
import { scopeReducer } from "./reducerInternals/reducer";
import { ScopeContextType } from "./reducerInternals/storage";

/** 
 * Used to share data across the scope pages and subpages. 
 * The data should be provided once and never changed again.
 * @todo Perhaps the reducer should be removed.
*/
export const useScopeInternal = (
    activeScope: GoogleScope,
    allScopes: GoogleScope[]
) => {

    const [
        state,
        dispatch
    ] = useReducer<React.Reducer<ScopeContextType, ScopeActionBase>>(scopeReducer, {
        activeScope: activeScope,
        availableScopes: allScopes.filter( s => s.slug !== activeScope.slug ),
        allScopes: allScopes
    });

    /*

    const [refetch, query] = useLazyQuery<GoogleScopesQueryResponse, GoogleScopeQueryRequest>(GOOGLE_SCOPES_QUERY, {

        onCompleted: data => {

            dispatch(ScopeActionsFactory.setAllScopes(data.googleScopes));

        },

        ssr: false

    });

    */

    return state;

}

export type UseScopeHookType = ReturnType<typeof useScopeInternal>;

export const getContextDefaults = (): UseScopeHookType => {
    return {
        activeScope: undefined,
        availableScopes: [],
        allScopes: []
    }
}