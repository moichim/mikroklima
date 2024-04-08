"use client";

import { GoogleScope } from "@/graphql/google/google";
import { Button, ButtonGroup } from "@nextui-org/react";
import Link from "next/link";
import { MapMarker } from "./MapMarker";
import { MapMultipleWrapperElement } from "./MapWrapperElement";

type MapMultipleInternalProps = {
    items: GoogleScope[],
    height: string
}

export const MapMultipleInternal: React.FC<MapMultipleInternalProps> = props => {
    return <div className="w-full rounded-xl overflow-hidden shadow-xl" style={{ height: props.height }}>
        <MapMultipleWrapperElement
            items={props.items.map(item => ({
                lat: item.lat,
                lng: item.lon
            }))}
        >
            {props.items.map(item => <MapMarker
                key={item.slug}
                position={{
                    lat: item.lat,
                    lng: item.lon
                }}
            >
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-xs text-foreground-500">{item.team}</p>
                <p className="text-xs text-foreground-500">{item.locality}</p>
                <ButtonGroup variant="flat">
                    <Button size="sm" as={Link} href={`/project/${item.slug}/data`}>Data</Button>
                    {item.count > 0
                        && <Button size="sm" as={Link} href={`/project/${item.slug}/thermo`} color="primary">Snímky</Button>
                    }
                </ButtonGroup>
            </MapMarker>)}
        </MapMultipleWrapperElement>
    </div>
}