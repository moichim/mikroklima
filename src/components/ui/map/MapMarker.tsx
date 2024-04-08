"use client";

import React from "react";
import { Marker, Popup } from "react-leaflet";
import { MapPositionType } from "../map";

type MapMarkerProps = {
    position: MapPositionType 
} & React.PropsWithChildren;

export const MapMarker: React.FC<MapMarkerProps> = props => {
    return <Marker position={props.position}>
        <Popup>
            {props.children}
        </Popup>
</Marker>
}