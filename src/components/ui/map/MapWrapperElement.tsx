"use client";

import React, { useMemo } from "react";
import { MapContainer, Rectangle, TileLayer } from "react-leaflet";
import { MapPositionType } from "../map";

// Internal props of map for a single item
type MapWrapperSingleElementProps = {
    center: MapPositionType,
    zoom: number
};

// Internal props of map for multiple items
type MapMultipleElementProps = {
    items: MapPositionType[]
}

// The exported component's props
type MapWrapperElementProps = React.PropsWithChildren & (MapWrapperSingleElementProps | {
    items: MapPositionType[]
});

// Common way to export map's layer
const MapWrapperTileLayer: React.FC = () => <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

// Internal component for outputting single map container
export const MapSingleWrapperElement: React.FC<
    MapWrapperSingleElementProps
    & React.PropsWithChildren
> = props => {
    return <MapContainer
        center={props.center}
        zoom={props.zoom}
        style={{ height: "100%" }}
        scrollWheelZoom={false}
    >
        <MapWrapperTileLayer />
        {props.children}
    </MapContainer>
}

type MapBoundsType = [
    [
        // leftmost
        number,
        // topmost
        number
    ], [
        // rightmost
        number,
        // bottommost
        number
    ]
]

// Wrapper for multiple map with calculated bounds
export const MapMultipleWrapperElement: React.FC<
    MapMultipleElementProps
    & React.PropsWithChildren
> = props => {

    const calculatedBounds: MapBoundsType = useMemo(() => {

        return props.items.reduce(
            (state, current) => {

                const st: MapBoundsType = [[...state[0]], [...state[1]]]

                if (current.lat < st[0][0])
                    st[0][0] = current.lat;

                if (current.lat > st[1][0])
                    st[1][0] = current.lat;

                if (current.lng > st[0][1])
                    st[0][1] = current.lng;

                if (current.lng < st[1][1])
                    st[1][1] = current.lng;

                return st
            },
            [
                [Infinity, -Infinity],
                [-Infinity, Infinity]
            ]
        );

    }, [props.items]);


    return <MapContainer
        scrollWheelZoom={false}
        bounds={calculatedBounds}
        boundsOptions={{
            padding: [50, 50]
        }}
        style={{ height: "100%" }}
    >
        <MapWrapperTileLayer />
        {props.children}
    </MapContainer>

}
