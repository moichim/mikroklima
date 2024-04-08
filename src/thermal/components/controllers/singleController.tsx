"use client";

import { useEffect, useMemo } from "react";
import { useThermalManagerContext } from "../../context/thermalManagerContext";
import { useThermalRegistry } from "../../context/useThermalRegistry";
import { ThermalInstanceDisplayParameters } from "../displays/instance/thermalInstance";
import { SingleDisplay } from "../displays/single/singleDisplay";
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";

type SingleDisplayProps = ThermalInstanceDisplayParameters & {
    thermalUrl: string
    visibleUrl?: string,
    registryId?: string,
    hasDownloadButtons?: boolean
}

export const SingleController: React.FC<SingleDisplayProps> = ({
    thermalUrl,
    visibleUrl = undefined,
    registryId = undefined,

    hasDownloadButtons = false,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {

    // Calculate the ID once for all (until the thermalUrl changes)
    const registryIdentificator = useMemo(() => {

        if (registryId) {
            return registryId;
        }

        return `single_${thermalUrl}_${(Math.random() * 100).toFixed(0)}`;

    }, [thermalUrl]);

    const registry = useThermalRegistry(registryIdentificator);

    const manager = useThermalManagerContext();

    // Load the file everytime the URLs change
    useEffect(() => {

        registry.loadOneFile({
            thermalUrl: thermalUrl,
            visibleUrl: visibleUrl
        }, registryIdentificator);

    }, []);


    // Remove the registry on unmount
    useEffect(() => {
        // return () => manager.removeRegistry(ID);
    }, []);



    return <SingleDisplay

        registry={registry}
        hasDownloadButtons={hasDownloadButtons}

        hasPopup={hasPopup}
        showDateOnHighlight={showDateOnHighlight}
        highlightColor={highlightColor}
        highlightOnHover={highlightOnHover}
        forceHighlight={forceHighlight}

    />

}