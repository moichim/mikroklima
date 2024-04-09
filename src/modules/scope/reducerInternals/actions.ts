import { GoogleScope } from "@/graphql/google/google"

export enum ScopeActions {

    SET_ALL_SCOPES = 4,

    /** @deprecated */
    SET_ACTIVE_SCOPE = 1,
    
    /** @deprecated */
    REMOVE_ACTIVE_SCOPE = 2

}

export type ScopeAllPayloadBase = {
    scopes: GoogleScope[]
}


type ScopeActivePayloadBase = {
    scope: ScopePayloadFormat
}

export type ScopeActionBase = {
    type: ScopeActions,
    payload: ScopeActivePayloadBase|ScopeAllPayloadBase|RemoveActiveScopePayload
}

interface ScopeAction<P extends ScopeActivePayloadBase|ScopeAllPayloadBase|RemoveActiveScopePayload> extends ScopeActionBase {
    payload: P
}




export type ScopePayloadFormat = GoogleScope;

export type ScopePayload = ScopeActivePayloadBase;


export type SetActiveScopePayload = ScopeActivePayloadBase;

export type SetActiveScopeAction = ScopeAction<SetActiveScopePayload> & {
    type: ScopeActions.SET_ACTIVE_SCOPE
}

export type SetAvailableScopesAction = ScopeAction<ScopeAllPayloadBase> & {
    type: ScopeActions.SET_ALL_SCOPES
}

export type RemoveActiveScopePayload = {
    do: true
}

export type RemoveActiveScopeAction = ScopeAction<RemoveActiveScopePayload> & {
    type: ScopeActions.REMOVE_ACTIVE_SCOPE
}


export class ScopeActionsFactory {

    public static setAllScopes(
        scopes: GoogleScope[]
    ): SetAvailableScopesAction {
        return {
            type: ScopeActions.SET_ALL_SCOPES,
            payload: {
                scopes
            }
        }
    }

    /** @deprecated */
    public static setActiveScope(
        scope: GoogleScope
    ): SetActiveScopeAction {
        return {
            type: ScopeActions.SET_ACTIVE_SCOPE,
            payload: {
                scope
            }
        }
    }

    /** @deprecated */
    public static removeActiveScope(): RemoveActiveScopeAction {
        return {
            type: ScopeActions.REMOVE_ACTIVE_SCOPE,
            payload: {
                do: true
            }
        }
    }

}