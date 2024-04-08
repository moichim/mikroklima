import { useEffect, useState } from "react";
import { MeteoQueryResponseType } from "../processors/query";
import { MeteoDataProcessed, MeteoResponseProcessor } from "../processors/responseProcessing";

/** Converts the data api response to the format usable in graphs */
export const useGraphData = (
    rawResponse?: MeteoQueryResponseType
) => {

    const [ data, setData ] = useState<MeteoDataProcessed>();

    useEffect( () => {

        if ( rawResponse === undefined ) {
            if ( data === undefined )
                setData( undefined );
        } else {
            const processed = MeteoResponseProcessor.process( rawResponse );
            setData( processed );
        }

    }, [ rawResponse ] );

    return data;

}