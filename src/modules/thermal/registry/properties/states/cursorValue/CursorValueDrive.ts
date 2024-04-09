import { ThermalFileInstance } from "@/modules/thermal/file/ThermalFileInstance";
import { ThermalCursorPositionOrundefined } from "@/modules/thermal/registry/interfaces";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithCursorValue extends IBaseProperty {
    cursorValue: CursorValueDrive;
}

export class CursorValueDrive extends AbstractProperty<number|undefined, ThermalFileInstance>{



    protected validate(value: number|undefined): number|undefined {
        return value;
    }

    // Once the value changes, project it to the cursor layer
    protected afterSetEffect(value: number|undefined) {

        if ( this.parent.cursorLayer ) {

        }

    }

    public recalculateFromCursor(
        position: ThermalCursorPositionOrundefined
    ) {
        if ( position )
            this.value = this._getValueAtCoordinate( position.x, position.y );
    }

    protected _getValueAtCoordinate(
        x: number | undefined,
        y: number | undefined
    ) {

        if (x === undefined || y === undefined) {
            return undefined;
        }

        const index = x + (y * this.parent.width);
        const value = this.parent.pixels[index];
        return value;

    }
    
}