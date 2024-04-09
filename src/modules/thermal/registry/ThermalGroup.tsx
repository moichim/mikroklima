"use client";


import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalRegistry } from "./ThermalRegistry";
import { IThermalGroup } from "./interfaces";
import { CursorPositionDrive } from "./properties/drives/cursorPosition/CursorPositionDrive";
import { InstancesState } from "./properties/lists/instances/InstancesState";
import { MinmaxGroupProperty } from "./properties/states/minmax/group/MinmaxGroupProperty";

/**
 * Group of thermal images
 */
export class ThermalGroup implements IThermalGroup {


    public readonly hash = Math.random();



    public constructor(
        public readonly registry: ThermalRegistry,
        public readonly id: string,
        public readonly name?: string,
        public readonly description?: string
    ) {
    }


    public readonly minmax: MinmaxGroupProperty = new MinmaxGroupProperty(this, undefined);

    public readonly instances: InstancesState = new InstancesState(this, []);

    public readonly cursorPosition: CursorPositionDrive = new CursorPositionDrive(this, undefined);


    /**
     * Destruction
     */


    /** Remove all instances, reset the minmax */
    public destroySelfAndBelow() {

        this.removeAllChildren();

        this.minmax.reset();

    }


    public removeAllChildren() {
        this.instances.removeAllInstances();
    }

    public reset() {
        this.instances.reset();
        this.minmax.reset();
        this.cursorPosition.reset();
    }


}