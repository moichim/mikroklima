import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";
import { ThermalFileSource } from "@/thermal/file/ThermalFileSource";

export interface IWithInstances extends IBaseProperty {
    instances: InstancesState
}

export class InstancesState extends AbstractProperty<ThermalFileInstance[],ThermalGroup>{

    protected _map: Map<string, ThermalFileInstance> = new Map<string,ThermalFileInstance>();

    public get map() { return this._map; }

    protected validate(value: ThermalFileInstance[]): ThermalFileInstance[] {
        return value;
    }

    /**
     * Whenever the instances change, recreate the index
     */
    protected afterSetEffect(value: ThermalFileInstance[]) {
        
        // Clear the index
        this.map.clear();

        // Create the new values in the index
        value.forEach( instance => this._map.set( instance.url, instance ) );
    }


    /** 
     * Creation of of single instance 
     * @deprecated Instances should not be created one by one, since every single action triggers the listeners
     */
    public instantiateSource(
        source: ThermalFileSource
    ) {

        if (!this._map.has(source.url)) {
            const instance = source.createInstance(this.parent);
            this.value = [ ...this.value, instance ];
            return instance;
        } else {
            return this._map.get(source.url)!;
        }
    }

    /**
     * Creation of instances at once
     * - triggers listeners only once
     */
    public instantiateSources(
        sources: ThermalFileSource[]
    ) {

        const newValue: ThermalFileInstance[] = [];

        sources.forEach( source => {

            if ( ! this._map.has( source.url ) ) {

                newValue.push( source.createInstance( this.parent ) );

            }

        } );

        this.value = newValue;

    }


    /**
     * Removal
     */
    public removeAllInstances() {
        this.forEveryInstance( instance => instance.destroySelfAndBelow() );
        this.value = [];
    }


    /** 
     * Iteration through all instances
     */
    public forEveryInstance( fn: ( (instance: ThermalFileInstance) => any ) ) {
        this.value.forEach( instance => fn(instance) );
    }


    

}