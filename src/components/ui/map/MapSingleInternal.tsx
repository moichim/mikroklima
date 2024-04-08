"use client";

import { GoogleScope } from "@/graphql/google/google";
import { MapSingleWrapperElement } from "./MapWrapperElement";
import { MapMarker } from "./MapMarker";
import { useMemo } from "react";
import { MapPositionType } from "../map";

export type MapSingleInternalProps = GoogleScope & {
    zoom?: number,
    height: string
};

export const MapSingleInternal: React.FC<MapSingleInternalProps> = ({
    zoom = 9,
    ...props
}) => {

    const position: MapPositionType = useMemo(() => ({
        lat: props.lat,
        lng: props.lon
    }), [props.lat, props.lon]);

    return <div className="w-full rounded-xl overflow-hidden shadow-xl" style={{height: props.height}}>
        <MapSingleWrapperElement
            center={position}
            zoom={zoom}
        >
            <MapMarker position={position}>
                <p>{props.name}</p>
                <p>{props.description}</p>
            </MapMarker>
        </MapSingleWrapperElement>
    </div>
}