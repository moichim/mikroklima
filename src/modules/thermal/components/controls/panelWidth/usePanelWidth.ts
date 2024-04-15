import { cn } from "@nextui-org/react";
import { useMemo } from "react";

export const usePanelWidth = (
    columns: number = 1,
    gap: string|number = 2
) => {

    const gapClass = useMemo( () => {

        if ( typeof gap === "number" ) {

            if ( gap <= 0 ) {
                return "";
            } else if ( gap === 1 ) {
                return "gap-[1px]";
            } else if ( gap === 2 ) {
                return "gap-[2px]";
            } else if ( gap === 3 ) {
                return "gap-[3px]";
            } else {
                return "gap-[2px]";
            }
        }

        return gap;
        
    }, [gap] );

    const widthClass = useMemo(() => {

        if ( columns <= 1 ) {
            return cn( "grid-cols-1" );
        } else if ( columns === 2 ) {
            return cn( "grid-cols-2", gapClass );
        } else if ( columns === 3 ) {
            return cn( "grid-cols-3", gapClass );
        } else if ( columns === 4 ) {
            return cn( "grid-cols-4", gapClass );
        } else if ( columns === 5 ) {
            return cn( "grid-cols-5", gapClass );
        } else if ( columns === 6 ) {
            return cn( "grid-cols-6", gapClass );
        } else if ( columns === 7 ) {
            return cn( "grid-cols-7", gapClass );
        } else if ( columns === 8 ) {
            return cn( "grid-cols-8", gapClass );
        } else if ( columns === 9 ) {
            return cn( "grid-cols-9", gapClass );
        } else if ( columns === 10 ) {
            return cn( "grid-cols-10", gapClass );
        }

    }, [columns]);

    return cn( "grid", widthClass );

}