import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithLoading extends IBaseProperty {

    /** Stores the loading state and executes all the listeners. */
    loading: LoadingState

}

export class LoadingState extends AbstractProperty<boolean, IWithLoading> {

    protected validate(value: boolean): boolean {
        return value;
    }

    protected afterSetEffect(value: boolean) {
        
    }

    public markAsLoading() {
        this.value = true;
    }

    public markAsLoaded() {
        this.value = false;
    }

}