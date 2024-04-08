import { ThermalGroup } from "../../../../ThermalGroup";
import { ThermalMinmaxOrUndefined, ThermalMinmaxType } from "../../../../interfaces";
import { AbstractMinmaxProperty } from "../../../abstractMinmaxProperty";
import { IBaseProperty } from "../../../abstractProperty";

export interface IWithMinmaxGroup extends IBaseProperty {
    minmax: MinmaxGroupProperty
}

export class MinmaxGroupProperty extends AbstractMinmaxProperty<ThermalGroup> {

    protected validate(value: ThermalMinmaxOrUndefined): ThermalMinmaxOrUndefined {
        return value;
    }

    protected afterSetEffect(value: ThermalMinmaxOrUndefined) {
    
    }

    /** Call this method once all instances are created */
    public recalculateFromInstances() {

        this.value = this._getMinmaxFromInstances();

        return this.value;
    }


    protected _getMinmaxFromInstances(): ThermalMinmaxOrUndefined {

        const instances = this.parent.instances.value;

        if (instances.length === 0)
            return undefined;
        return instances.reduce((state, current) => {

            if (current.min < state.min || current.max > state.max) {
                return {
                    min: current.min < state.min ? current.min : state.min,
                    max: current.max > state.max ? current.max : state.max
                }
            }

            return state;

        }, { min: Infinity, max: -Infinity } as ThermalMinmaxType);
    }

}