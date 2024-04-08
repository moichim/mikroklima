import { ThermalFileInstance } from "../ThermalFileInstance";
import { AbstractLayer } from "./AbstractLayer";
import ThermalDomFactory from "./domFactories";

/** Displays the cursor pointer and its value */
export default class ThermalCursorLayer extends AbstractLayer {

    protected layerRoot: HTMLDivElement;
    protected center: HTMLDivElement;
    protected axisX: HTMLDivElement;
    protected axisY: HTMLDivElement;
    protected label: HTMLDivElement;

    public constructor(
        instance: ThermalFileInstance
    ){

        super( instance );

        // Create the elements
        this.layerRoot = ThermalDomFactory.createCursorLayerRoot();
        this.center = ThermalDomFactory.createCursorLayerCenter();
        this.axisX = ThermalDomFactory.createCursorLayerX();
        this.axisY = ThermalDomFactory.createCursorLayerY();
        this.label = ThermalDomFactory.createCursorLayerLabel();

        // bind the elements together
        this.layerRoot.appendChild( this.center );
        this.center.appendChild( this.axisX );
        this.center.appendChild( this.axisY );
        this.center.appendChild( this.label );

    }

    // Set visible / invisible
    protected _show: boolean = false;
    public get show() {return this._show};
    public set show( value: boolean ) {
        this._show = value;
        this.layerRoot.style.opacity = this._show ? "1" : "0";
    }

    protected _hover: boolean = false;
    public get hover() {return this._hover}
    public set hover( value: boolean ) {
        this._hover = value;
        this.label.style.backgroundColor = this._hover
            ? "black"
            : "rgba( 0,0,0,0.5 )";
    }

    public setCursor(
        x: number,
        y: number,
        value: number
    ): void {

        if ( this.instance.root === null ) {

        } else {
            
            // Get the aspect
            const aspect = this.instance.root.offsetWidth / this.instance.width;

            // Calculate the center coordinate
            const centerX = Math.round( x * aspect );
            const centerY = Math.round( y * aspect );

            // Move the axes
            // this.axisX.style.left = this.px( centerX );
            // this.axisY.style.top = this.px( centerY );

            // Update the value center
            this.center.style.left = this.px( centerX );
            this.center.style.top = this.px( centerY );

            // Update the label X position
            if ( x > ( this.instance.width / 3 ) ) {
                this.label.style.right = "3px";
                this.label.style.removeProperty( "left" );
            } else {
                this.label.style.left = "3px";
                this.label.style.removeProperty( "right" );
            }

            // Update the label Y position
            if ( y > ( this.instance.height / 4 ) ) {
                if ( this.label.style.bottom !== "3px" ) {
                    this.label.style.bottom = "3px";
                    this.label.style.removeProperty( "top" );
                }
            } else {
                if ( this.label.style.top !== "3px" ) {
                    this.label.style.top = "3px";
                    this.label.style.removeProperty( "bottom" );
                }
            }

            // Update the label content
            this.label.innerHTML = `${value.toFixed(3)} °C`;

        }

    }

    public resetCursor(): void {
        // this.axisX.style.left = "0px";
        // this.axisY.style.top = "0px";
        this.center.style.top = "0px";
        this.center.style.left = "0px";
        this.label.style.removeProperty( "right" );
        this.label.style.removeProperty( "bottom" );
        this.label.style.top = "3px";
        this.label.style.left = "3px";
        this.label.innerHTML = "";
    }

    protected px( number:number ): string {
        return `${number}px`;
    }

    public getLayerRoot(): HTMLDivElement {
        return this.layerRoot;
    }

    protected onDestroy(): void {
        this.label.remove();
        this.axisX.remove();
        this.axisY.remove();
        this.center.remove();
        this.layerRoot.remove();
    }


}