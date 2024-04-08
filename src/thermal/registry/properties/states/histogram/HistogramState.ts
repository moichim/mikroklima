import { ThermalStatistics, ThermalRegistry } from "../../../ThermalRegistry";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithHistogram extends IBaseProperty {
    histogram: HistogramState
}

/** Handles the histogram creation and subscription.
 * - should be used only in registries
 */
export class HistogramState extends AbstractProperty<ThermalStatistics[], ThermalRegistry> {

    protected resolution = 50;

    /** Set the historgam resolution
     * - does not recalculate the value!
     * - to recalculate value, call `recalculateWithCurrentSetting`
     * 
     * @notice Higher the number, lower the resolution.
    */
    public setResolution( value: number ) {
        this.resolution = Math.min( Math.max( value, 2 ), 200 );
    }

    /** If incorrect resolution is being set, set empty array */
    protected validate(value: ThermalStatistics[]): ThermalStatistics[] {
        if (value.length !== this.resolution && value.length !== 0) {
            console.warn( `Tried to set incorrect resolution. 
            Desired resolution: '${this.resolution}'. Incoming resolution ${value.length}. 
            => No changes were made - using the old value instead the new one.` );
            return this.value;
        }
        return value;
    }

    protected afterSetEffect(value: ThermalStatistics[]) {
        
    }


    /** Recalculates the value using all current instances and with che current resolution */
    public recalculateWithCurrentSetting() {
        this.value = this._getHistorgramFromAllGroups();
        return this.value;
    }


    public _getHistorgramFromAllGroups() {

        if (this.parent.minmax.value === undefined || this.parent.groups.value.length === 0) {
            return [];
        } else {

            // Get all pixels
            const allPixels = this.parent.groups.value.reduce((
                state,
                current
            ) => {

                const pixels = current.instances.value.reduce((buf, instance) => {

                    buf = [...buf, ...instance.pixels];

                    return buf;

                }, [] as number[]);

                return [...state, ...pixels]

            }, [] as number[]);


            // Calculate the ten segments
            const segments: [number, number][] = [];

            const numSegments = this.resolution;
            const difference = this.parent.minmax.value.max - this.parent.minmax.value.min;
            const segment = difference / numSegments;

            for (let i = 0; i < numSegments; i++) {

                const from = (segment * i) + this.parent.minmax.value.min;
                const to = from + segment;

                segments.push([from, to]);

            }

            const results: {
                from: number,
                to: number,
                count: number
            }[] = [];

            let sum = allPixels.length;

            for ( let i of segments ) {

                const count = allPixels.filter( pixel => {
                    return pixel >= i[0] && pixel < i[1]; 
                }).length;

                sum = sum + count;

                results.push( {
                    from: i[0],
                    to: i[1],
                    count: count
                } );

            }

            const recalculated = results.map( i => {
                return {
                    ...i,
                    percentage: i.count / sum * 100,
                }
            } );

            const max = Math.max( ...recalculated.map( item => item.percentage ) );

            return recalculated.map( item => {
                return {
                    ...item,
                    height: item.percentage / max * 100
                }
            } ) as ThermalStatistics[];

        }


    }

}