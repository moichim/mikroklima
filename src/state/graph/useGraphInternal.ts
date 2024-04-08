import { useEffect, useReducer } from "react";
import { StackActions } from "./reducerInternals/actions";
import { useGraphStackReducer } from "./reducerInternals/reducer";
import { GraphStateFactory } from "./reducerInternals/storage";

const encodeTourState = ( state: boolean ) => state === true
    ? "1"
    : "2";

const parseTourState = ( state: ReturnType<typeof encodeTourState> ) => {
    return state === "1";
}

const localStorageKey = "graphTour4";

export const useGraphInternal = () => {

    const [state, dispatch] = useReducer( useGraphStackReducer, GraphStateFactory.defaultState() );

    useEffect( () => {
        if ( state.tourPassed === undefined ) {

            const storedState = localStorage.getItem(localStorageKey);

            switch( storedState ) {

                case null:
                case undefined:
                case "2":
                    dispatch( StackActions.setTourPassed(false) );
                    break;

                default:
                    dispatch( StackActions.setTourPassed(true) );
            }

        }
    }, [state.tourPassed] );

    useEffect( () => {
        if ( state.tourPassed !== undefined ) {
            localStorage.setItem( localStorageKey, encodeTourState( state.tourPassed ) )
        }
    }, [state.tourPassed] );

    return {
        graphState: state,
        graphDispatch: dispatch
    }
}

export type UseGraphStackValues = ReturnType< typeof useGraphInternal >;