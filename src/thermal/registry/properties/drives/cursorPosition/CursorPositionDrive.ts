import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalCursorPositionOrundefined } from "@/thermal/registry/interfaces";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithCursorPosition extends IBaseProperty {
    cursorPosition: CursorPositionDrive;
}

export class CursorPositionDrive extends AbstractProperty<ThermalCursorPositionOrundefined, ThermalGroup>{

    protected _hover: boolean = this.value !== undefined;
    public get hover() { return this._hover; }


    protected validate(value: ThermalCursorPositionOrundefined): ThermalCursorPositionOrundefined {
        return value;
    }

    // After the position changes, update the hover & project the position in all instances
    protected afterSetEffect(value: ThermalCursorPositionOrundefined) {

        this._hover = this.value !== undefined;

        this.parent.instances.forEveryInstance( instance => instance.recieveCursorPosition( value ) );

    }

    public recieveCursorPosition(
        position: ThermalCursorPositionOrundefined
    ) {
        this.value = position;
    }
    
}