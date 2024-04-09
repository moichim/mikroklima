import { IWithCursorPosition } from "./properties/drives/cursorPosition/CursorPositionDrive";
import { IWithHighlight } from "./properties/drives/highlight/HighlightDrive";
import { IWithOpacity } from "./properties/drives/opacity/OpacityDrive";
import { IWithPalette } from "./properties/drives/palette/PaletteDrive";
import { IWithRange } from "./properties/drives/range/RangeDriver";
import { IWithGroups } from "./properties/lists/groups/GroupsState";
import { IWithInstances } from "./properties/lists/instances/InstancesState";
import { IWithCursorValue } from "./properties/states/cursorValue/CursorValueDrive";
import { IWithLoading } from "./properties/states/loading/LoadingState";
import { IWithMinmaxGroup } from "./properties/states/minmax/group/MinmaxGroupProperty";
import { IWithMinmaxRegistry } from "./properties/states/minmax/registry/MinmaxRegistryState";


// Range

export type ThermalRangeType = {
    from: number,
    to: number
}

export type ThermalRangeOrUndefined = ThermalRangeType | undefined;

export type ThermalRangeDataType = ThermalRangeOrUndefined & {
    from: number,
    to: number
}


// Min Max

export interface ThermalMinmaxType {
    min: number,
    max: number
}
export type ThermalMinmaxOrUndefined = ThermalMinmaxType | undefined;


// Cursor

export type ThermalCursorPosition = {
    x: number,
    y: number
}

export type ThermalCursorPositionOrundefined = ThermalCursorPosition | undefined;



/**
 * Object types
 */


export interface IThermalObjectBase {
    destroySelfAndBelow: () => void,
    removeAllChildren: () => void,
    reset: () => void
}

export interface IThermalContainer 
    extends IThermalObjectBase
    {}

export interface IThermalInstance
    extends IThermalObjectBase,
        IWithCursorValue
    {}


export interface IThermalGroup 
extends IThermalContainer,
    IWithMinmaxGroup,
    IWithInstances,
    IWithCursorPosition
{}

export interface IThermalRegistry 
    extends IThermalContainer,
        IWithGroups,
        IWithOpacity, 
        IWithLoading,
        IWithMinmaxRegistry,
        IWithRange,
        IWithPalette,
        IWithHighlight
{}
