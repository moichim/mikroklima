import { NumberDomain } from "recharts/types/util/types";
import { AbstractInstanceAnalysis } from "../abstractAnalysis";

export class AnalysisPoint {

    protected _x: number;
    public get x() { return this._x; }
    protected set x( value: number ) {
        this._x = value;
    }

    protected _y: number;
    public get y() { return this._x; }
    protected set y( value: number ) {
        this._y = value;
    }

    protected _fill: string;
    public get fill() {
        return this._fill;
    }
    protected set fill( value: string ) {
        this._fill = value;
    }

    protected _stroke: string;
    public get stroke() {
        return this._stroke;
    }
    protected set stroke( value: string ) {
        this._stroke = value;
    }


    public readonly listener: HTMLDivElement;
    public readonly display: HTMLDivElement;

    public constructor(
        protected readonly analysis: AbstractInstanceAnalysis,
        x: number,
        y: number,
        public readonly name: string,
        fill: string,
        stroke: string
    ) {

        // First, set the internal values (before DOM initialisation)
        this._x = x;
        this._y = y;
        this._fill = fill;
        this._stroke = stroke;


        // Then init the DOM

        this.listener = this.getListener();
        this.display = this.getDisplay();

        // Last, call the interanl setters to project values into DOM

        this.x = x;
        this.y = y;
        this._fill = fill;
        this.stroke = stroke;
        

    }

    protected getListener(): HTMLDivElement {

        const element = document.createElement( "div" );


        return element;

    }

    protected getDisplay(): HTMLDivElement {

        const element = document.createElement( "div" );


        return element;

    }

    public setOnMouseEnter() : void {

    }

    public setOnMouseMove(): void {

    }

    public setOnMouseLeave(): void {

    }

    public setOnDrag(): void {
        
    }

}