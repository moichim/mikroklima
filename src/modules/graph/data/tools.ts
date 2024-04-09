import { InfoIcon, SelectIcon, ZoomInIcon, ZoomOutIcon } from "@/components/ui/icons";
import { UseGraphStackValues } from "../useGraphInternal"

export enum GraphTools {
    INSPECT = "inspect",
    SELECT = "select",
    ZOOM = "zoom"
}

export type GraphToolType = {
    name: string,
    tooltip: string,
    slug: GraphTools,
    icon: React.FC,
    onActivate?: ( hook: UseGraphStackValues ) => {},
    onDeactivate?: ( hook: UseGraphStackValues ) => {}
}

export const graphTools: {
    [I in GraphTools]: GraphToolType
} = {
    [GraphTools.INSPECT]: {
        name: "Inspekce",
        tooltip: "Prohlížet hodnoty",
        slug: GraphTools.INSPECT,
        icon: InfoIcon
    },
    [GraphTools.SELECT]: {
        name: "Vyznačení",
        tooltip: "Vyznačit časové rozmezí",
        slug: GraphTools.SELECT,
        icon: SelectIcon,
        onActivate: undefined,
        onDeactivate: undefined
    },
    [GraphTools.ZOOM]: {
        name: "Přiblížení",
        tooltip: "Přiblížit na časové rozmezí",
        slug: GraphTools.ZOOM,
        icon: ZoomInIcon,
        onActivate: undefined,
        onDeactivate: undefined
    }
};