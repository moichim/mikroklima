import { NumberDomain } from "recharts/types/util/types";
import { AbstractInstanceAnalysis } from "../abstractAnalysis";

export abstract class AbstractPoint {

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

    protected _isHover: boolean = false;
    public get isHover() { return this.isHover }
    protected set isHover( value: boolean ) {
        this.isHover = value;
    }

    protected _size: number = 3;
    public get size() {
        return this._size;
    }
    protected abstract setSize( value: number ): void;


    public readonly listener: HTMLDivElement;
    public readonly display: HTMLDivElement;

    public constructor(
        protected readonly analysis: AbstractInstanceAnalysis,
        x: number,
        y: number,
        public readonly name: string,
    ) {

        // First, set the internal values (before DOM initialisation)
        this._x = x;
        this._y = y;


        // Then init the DOM

        this.listener = this.getListener();
        this.display = this.getDisplay();
        

    }





    protected abstract getListener(): HTMLDivElement;

    protected abstract getDisplay(): HTMLDivElement;

    private onMouseEnter?: (( evt: MouseEvent, point: AbstractPoint ) => any) = undefined;
    public setOnMouseEnter() : void {

    }

    private onMouseMove?: (( evt: MouseEvent, point: AbstractPoint ) => any) = undefined;
    public setOnMouseMove(): void {

    }

    private onMouseLeave?: (( evt: MouseEvent, point: AbstractPoint ) => any) = undefined;
    public setOnMouseLeave(): void {

    }

    private onClick?: (( evt: MouseEvent, point: AbstractPoint ) => any) = undefined;
    public setOnClick(): void {
        
    }


    protected _isInitialised: boolean = false;
    public init() {

        if (  this._isInitialised === true ) {
            return;
        }

        this.listener.onmouseenter = ( event ) => {
            this.isHover = true;
            if ( this.onMouseEnter ) {
                this.onMouseEnter( event, this );
            }
        }

        this.listener.onmousemove = ( event ) => {
            if ( this.onMouseMove ) {
                this.onMouseMove( event, this );
            }
        }

        this.listener.onclick = ( event ) => {
            if ( this.onClick ) {
                this.onClick( event, this );
            }
        }

        this.listener.onmouseleave = ( event ) => {
            if ( this.onMouseLeave ) {
                this.onMouseLeave( event, this );
            }
        }

    }




}