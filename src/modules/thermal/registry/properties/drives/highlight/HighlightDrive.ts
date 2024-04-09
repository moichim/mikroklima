import { addHours } from "date-fns";
import { ThermalRegistry } from "../../../ThermalRegistry";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithHighlight extends IBaseProperty {
    highlight: HighlightDrive;
}

export class HighlightDrive extends AbstractProperty<number|undefined, ThermalRegistry>{
    protected validate(value: number | undefined): number | undefined {
        return value;
    }
    protected afterSetEffect(value: number | undefined) {

        // If the value is undefined stop every highlighting
        if ( value === undefined ) {
            this.parent.forEveryInstance( instance => instance.recieveTimeHighlight( false ) );
        } 
        // If the value is different than in the previous step, do the changes
        else {

            const min = this._getHourDown( value );
            const max = this._getHourUp( value );

            this.parent.forEveryInstance( instance => {

                if ( instance.timestamp >= min && instance.timestamp < max ) {
                    instance.recieveTimeHighlight( true );
                } else {
                    instance.recieveTimeHighlight( false );
                }

            } );

        }

    }

    public higlightTime( value: number ) {
        this.value = value;
    }

    public clearHighlight() {
        this.value = undefined;
    }


    protected _getHourDown(
        timestamp: number
    ): number {
        const d = new Date();
        d.setTime( timestamp );
        return addHours(d, -1).getTime();
    }

    protected _getHourUp(
        timestamp: number
    ): number {
        const d = new Date();
        d.setTime( timestamp );
        return addHours(d, 1).getTime();
    }
    
}