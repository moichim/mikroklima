import { ThermalFileInstance } from "../ThermalFileInstance";
import { AbstractLayer } from "./AbstractLayer";
import ThermalDomFactory from "./domFactories";

/** Listens for the mouse events. Needs to be placed on top. */
export class ThermalListenerLayer extends AbstractLayer {

    protected container: HTMLDivElement;

    public constructor(
        instance: ThermalFileInstance
    ) {
        super( instance );

        this.container = ThermalDomFactory.createListener();
    }

    public getLayerRoot(): HTMLElement {
        return this.container;
    }
    protected onDestroy(): void {
        this.container.remove();    
    }

}