"use client"

import { Button } from "@nextui-org/react";
import { useGraphContext } from "../../state/graph/graphContext";
import { StackActions } from "../../state/graph/reducerInternals/actions";

export const BarExpandButton: React.FC = () => {

    const { graphState: state, graphDispatch: dispatch } = useGraphContext();


    return <Button
        onClick={() => dispatch(StackActions.barSetExpanded(!state.barExpanded))}
        isIconOnly
        aria-label={state.barExpanded ? "Sbalit" : "Rozbalit"}
        aria-expanded={state.barExpanded}
    >

        {!state.barExpanded
            ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        }

    </Button>
}