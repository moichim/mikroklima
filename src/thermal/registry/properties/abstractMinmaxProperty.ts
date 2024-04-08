import { ThermalGroup } from "../ThermalGroup";
import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalMinmaxOrUndefined } from "../interfaces";
import { IThermalContainer } from "../interfaces/interfaces";
import { AbstractProperty, IBaseProperty } from "./abstractProperty"


/** 
 * A common basis for all Minmax properties 
 */
export abstract class AbstractMinmaxProperty<Target extends ThermalRegistry|ThermalGroup> extends AbstractProperty<ThermalMinmaxOrUndefined, Target> {

}