import { GoogleScope } from "@/graphql/google/google"
import { useGraphData } from "../data/useGraphData"
import { useEffect } from "react"
import { useGraphStatistics } from "../data/useGraphStatitics"

export type MeteoContextProps = {
    scope: GoogleScope,
    from: number,
    to: number,
    selectionFrom?: number,
    selectionTo?: number
}

/** The main entry point of the graph data instance.
 * 
 * - time is provided from above
 * (either fixed or from the time context)
 */
export const useMeteoGraphData = (
    scope: GoogleScope,
    from: number,
    to: number,
    selectionFrom?: number,
    selectionTo?: number
) => {

    const main = useGraphData( scope );
    const selection = useGraphStatistics( scope );

    // Update data whenever the main time range changes
    useEffect( () => {

        main.fetch( from, to );

    }, [from, to] );


    // Update the selection whenever the main time range changes
    useEffect( () => {

        if ( selectionFrom !== undefined && selectionTo !== undefined )
            selection.fetch( selectionFrom, selectionTo );
        else
            selection.clear();

    }, [selectionFrom, selectionTo] );

    return {
        data: main.data,
        loadingMain: main.loading,
        statistics: selection.data,
        loadingSelection: selection.loading
    }

}