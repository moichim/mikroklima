import { ThermalRegistry } from "../../../ThermalRegistry";
import { ThermalRangeOrUndefined } from "../../../interfaces";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithRange extends IBaseProperty {}

export class RangeDriver extends AbstractProperty< ThermalRangeOrUndefined, ThermalRegistry> {


    /** 
     * Make sure the range is allways within the minmax values.
     * 
     * If this method should work, the value needs to be set before the minmax is calculated.
     */
    protected validate(value: ThermalRangeOrUndefined): ThermalRangeOrUndefined {

        if ( value === undefined ) {
            return undefined;
        } 
        
        const minmax = this.parent.minmax.value;

        if ( minmax === undefined ) {
            return value;
        }

        const result = {...value};

        if ( value.from < minmax.min )
            result.from = minmax.min;

        if ( value.to > minmax.max )
            result.to = minmax.max;

        return result;

    }

    /**
     * Whenever the range changes, propagate the value to all instances
     */
    protected afterSetEffect(value: ThermalRangeOrUndefined) {
    
        if ( value )
            this.parent.forEveryInstance( instance => instance.recieveRange( value ) );

    }


    /** 
     * Imposes a range to itself and below
     * - needs to be called before the minmax is calculated!
     */
    public imposeRange( value: ThermalRangeOrUndefined ) {
        
        // If new and old are undefined, do nothing
        if ( value === undefined && this.value === undefined ) {
            // ..do nothing
        }
        // If the new one is undefined and old one exists, set undefined
        else if ( value === undefined && this.value !== undefined ) {
            this.value = value;
        } 
        // If there is no value and the new one exists
        if ( value !== undefined && this.value === undefined ) {
            this.value = value;
        }
        // If the value changes...
        else if ( value !== undefined && this.value !== undefined ) {

            // ... set it only if it is different
            if ( this.value.from !== value.from || this.value.to !== value.to ) {
                this.value = value;
            }

        }

        return this.value;
    }

}