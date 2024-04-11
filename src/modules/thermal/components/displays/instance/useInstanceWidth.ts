import { useEffect, useState } from "react";
import { ThermalGroup } from "../../../registry/ThermalGroup";
import { cn } from "@nextui-org/react";

const classes = {
    "full": {
        width: "w-full",
        margin: "-me-[2px]"
    },
    "1/2": {
        width: "w-1/2",
        margin: "-m-[3px]"
    },
    "1/3": {
        width: "w-1/4",
        margin: "-me-[7px]"
    }
};

export const useInstanceWidth = (
    columns: undefined|number = 1
) => {

    const [ cols, setCols ] = useState<number>( columns );

    useEffect( () => {

        const c = Math.round( Math.min( Math.max( columns, 0 ), 3 ) );

        console.log( c );

        if ( c === 0 || c === 1 ) {
            setCols( 1 );
        } else if ( c === 2 ) {
            setCols( c );
        } else {
            setCols( 3 );
        }

    }, [columns, setCols] );

    let value = classes["1/3"];

    if ( cols === 1 ) {
        value = classes["full"];
    } else if ( cols === 2 ) {
        value = classes[ "1/2" ];
    }

    const result = cn( Object.values( value ) , "-ms-[2px]" );

    console.log( result );

    return result;

}