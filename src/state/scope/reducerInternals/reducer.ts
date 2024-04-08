import { Reducer } from "react";
import { ScopeActionBase, ScopeActions, ScopeAllPayloadBase } from "./actions";
import { ScopeContextType } from "./storage";

export const scopeReducer: Reducer<ScopeContextType, ScopeActionBase> = (
    state,
    action
) => {

    switch (action.type) {

        case ScopeActions.SET_ALL_SCOPES:

            let availableScopes = "scopes" in action.payload
                ? action.payload.scopes
                : [];

            const allScopes = availableScopes;

            if ( state.activeScope !== undefined ) {
                availableScopes = availableScopes.filter( s => s.slug !== state.activeScope?.slug );
            }


            return {
                ...state,
                allScopes: allScopes,
                availableScopes: availableScopes
            }

        case ScopeActions.SET_ACTIVE_SCOPE:

            const activeScope = "scope" in action.payload   
                ? action.payload.scope
                : undefined;

            const availableScopesSetSingle = [...state.allScopes].filter( s => s.slug !== activeScope?.slug )

            return {
                ...state,
                activeScope,
                availableScopes: availableScopesSetSingle
            }

        case ScopeActions.REMOVE_ACTIVE_SCOPE:
            return {
                ...state,
                activeScope: undefined,
                availableScopes: [...state.allScopes]
            }


    }

    return state;

}