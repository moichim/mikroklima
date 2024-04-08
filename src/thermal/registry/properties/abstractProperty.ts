import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "../ThermalGroup";
import { ThermalStatistics } from "../ThermalRegistry";
import { ThermalCursorPositionOrundefined, ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "../interfaces";

type PropertyListenersTypes = boolean 
    | number 
    | string
    | ThermalRangeOrUndefined 
    | ThermalMinmaxOrUndefined
    | ThermalCursorPositionOrundefined
    | ThermalGroup[]
    | ThermalFileInstance[]
    | ThermalStatistics[];

type PropertyListenerFn<T extends PropertyListenersTypes> = ( value: T ) => any

export interface IBaseProperty {}


/** A common basis for all observable properties */
export abstract class AbstractProperty<
    ValueType extends PropertyListenersTypes,
    ParentType extends IBaseProperty
> {

    protected _value: ValueType;

    public constructor(
        public readonly parent: ParentType,
        public readonly _initial: ValueType
    ) {
        this._value = this.validate( this._initial );
    }

    public reset() {
        this.value = this._initial;
    }

    protected abstract validate( value: ValueType ): ValueType;

    protected abstract afterSetEffect( value: ValueType ): any

    /** Get the current value @readonly */
    public get value() {
        return this._value;
    };

    /** Set the value and call all listeners */
    protected set value(
        value: ValueType
    ) {
        this._value = this.validate( value );
        this.afterSetEffect( this._value );
        Object.values( this._listeners ).forEach( listener => listener( this._value ) );
    }

    protected _listeners: {
        [index: string]: PropertyListenerFn<ValueType>
    } = {}

    addListener(
        id: string,
        listener: PropertyListenerFn<ValueType>
    ) {

        if ( id in this._listeners) {
            delete this._listeners[id];
        }
        this._listeners[ id ] = listener;
    }

    removeListener(
        id: string
    ) {
        if ( id in this._listeners ) {
            delete this._listeners[id];
        }
    }

    clearAllListeners() {
        this._listeners = {};
    }

}