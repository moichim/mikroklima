"use client";

import { GoogleScope } from "@/graphql/google/google";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import React from "react";

const MapSingleComponent = dynamic( () => import( "./map/MapSingleInternal" ).then(mod =>mod.MapSingleInternal), {ssr:false} );

const MapMultipleComponent = dynamic( () => import( "./map/MapMultipleInternal" ).then(mod =>mod.MapMultipleInternal), {ssr:false} );

export type MapItemProps = React.PropsWithChildren & {
    position: MapPositionType
}

type MapCommonProps = {
    height: string
}

export type MapPositionType = {
    lat: number,
    lng: number
}

type MapProps = MapCommonProps & ({
    scope: GoogleScope
} | {
    scopes: GoogleScope[]
})

const Map: React.FC<MapProps> = props => {
    if ( "scope" in props ) {
        return <MapSingleComponent {...props.scope} height={props.height} zoom={13}/>
    }
    return <MapMultipleComponent items={props.scopes} height={props.height}/>
}

export default Map;