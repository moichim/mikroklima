import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalCursorPositionOrundefined, ThermalRangeOrUndefined } from "../registry/interfaces";
import { IThermalInstance } from "../registry/interfaces/interfaces";
import { CursorValueDrive } from "../registry/properties/states/cursorValue/CursorValueDrive";
import { ThermalFileSource } from "./ThermalFileSource";
import { VisibleLayer } from "./instanceUtils/VisibleLayer";
import { ThermalCanvasLayer } from "./instanceUtils/thermalCanvasLayer";
import ThermalCursorLayer from "./instanceUtils/thermalCursorLayer";
import { ThermalDateLayer } from "./instanceUtils/thermalDateLayer";
import { ThermalListenerLayer } from "./instanceUtils/thermalListenerLayer";

/**
 * @todo implement variants toggling
 * @todo implement activation properly!
 * @todo implement unmounting
 * @todo rename binding to mounting
 */
export class ThermalFileInstance extends EventTarget implements IThermalInstance {



    // Core properties are mirrored from the source

    public get url() { return this.source.url };
    public get signature() { return this.source.signature }
    public get unit() { return this.source.unit };
    public get width() { return this.source.width; }
    public get height() { return this.source.height; }
    public get timestamp() { return this.source.timestamp; }
    public get pixels() { return this.source.pixels; }
    public get min() { return this.source.min; }
    public get max() { return this.source.max; }
    public get visibleUrl() { return this.source.visibleUrl; }

    // Necessary properties are calculated in the constructor

    public readonly id: string;
    protected readonly horizontalLimit: number;
    protected readonly verticalLimit: number;

    public constructor(
        protected readonly source: ThermalFileSource,
        public readonly group: ThermalGroup
    ) {

        super();

        this.id = `instance_${this.group.id}_${this.source.url}`;
        this.horizontalLimit = (this.width / 4) * 3;
        this.verticalLimit = (this.height / 4) * 3;
    }



    public destroySelfAndBelow() {
        this.detachFromDom();
    };
    public removeAllChildren() {
        this.detachFromDom();
    };
    public reset() { };




    // The root container
    public root: HTMLDivElement | null = null;

    // The canvas layer
    public readonly canvasLayer: ThermalCanvasLayer = new ThermalCanvasLayer(this);

    // The visible layer
    public readonly visibleLayer: VisibleLayer = new VisibleLayer(this, this.visibleUrl);

    /// The cursor layer
    public readonly cursorLayer: ThermalCursorLayer = new ThermalCursorLayer(this);

    // The date popup layer
    public readonly dateLayer: ThermalDateLayer = new ThermalDateLayer(this);

    // The listener layer
    public readonly listenerLayer: ThermalListenerLayer = new ThermalListenerLayer(this);




    /**
     * Dom bindings
     */

    protected _mounted: boolean = false;
    public get mountedBaseLayers() { return this._mounted; }
    protected set mountedBaseLayers(value: boolean) { this._mounted = value; }

    /** @todo what if the instance remounts back to another element? The layers should be mounted as well! */
    protected attachToDom(
        container: HTMLDivElement
    ) {

        if (this.root !== null || this.mountedBaseLayers === true) {
            console.warn(`The instance ${this.id} has already mounted base layers therefore the inner DOM tree is deleted and built from the scratch.`);
            this.detachFromDom();
            this.unmountListener();
        }

        this.root = container;

        // Container styles
        this.root.style.borderWidth = "2px";
        this.root.style.borderStyle = "solid";
        this.root.style.borderColor = "transparent";
        this.root.style.margin = "-1px";
        this.root.style.transition = "border-color .1s ease-in-out";
        this.root.style.zIndex = "10";

        // Visible layer is mounted on the bottom 
        // and only if the URL exists
        if (this.visibleLayer.exists)
            this.visibleLayer.mount();

        // The rest is mounted in the given order
        this.canvasLayer.mount();
        this.cursorLayer.mount();
        this.dateLayer.mount();


        // Container dataset
        this.root.dataset.thermalFile = this.id;
        this.root.dataset.mounted = "true";

        // Mount the interactions
        this.mountListener();

        // Global state
        this.mountedBaseLayers = true;


    }

    protected detachFromDom() {

        if (this.root === undefined) {
            console.warn(`The instance ${this.id} does not have a root, therefore the base layers can not be unmounted.`);
        }

        if (this.root) {
            this.root.dataset.mounted = "false";
            this.root.dataset.thermalFile = undefined;
        }
        // this.root?.remove();
        this.visibleLayer.unmount();
        this.canvasLayer.unmount();
        this.cursorLayer.unmount();
        this.dateLayer.unmount();

        this.unmountListener();

        this.mountedBaseLayers = false;

    }



    /**
     * Activation status
     * @todo refactor this with variants!
     */

    protected mountListener() {

        if (this.root === undefined) {
            console.warn(`The instance ${this.id} does not have a root, therefore the listener can not be mounted.`);
            return;
        }

        this.listenerLayer.mount();

        this.listenerLayer.getLayerRoot().onmousemove = (event: MouseEvent) => {

            // Show the cursor
            this.cursorLayer.show = true;

            // Store the local hover state
            this.isHover = true;

            // Send the time highlight whenever syncing
            if ( this._timeHighlightSync === true )
                this.group.registry.highlight.higlightTime(this.timestamp);

            // Highlight on hover whenever needed
            if ( this._highlightOnHover === true ) {
                    this.doHighlight(true);
            }

            const client = this.width;
            const parent = this.root!.clientWidth;

            const aspect = client / parent;

            const x = Math.round(event.offsetX * aspect);
            const y = Math.round(event.offsetY * aspect);

            this.group.cursorPosition.recieveCursorPosition({ x, y });

            if (this._onHover)
                this._onHover(event, this);

        };

        this.listenerLayer.getLayerRoot().onmouseleave = () => {

            this.cursorLayer!.show = false;

            this.isHover = false;

            // Clear the synchronised time in any case
            this.group.registry.highlight.clearHighlight();

            // Clear the synchronised cursor in any case
            this.group.cursorPosition.recieveCursorPosition(undefined);

            // RemoveThe highlight in any case
            this.doHighlight( false );

        };

        this.listenerLayer.getLayerRoot().onclick = (event) => {

            if (this._onClick)
                this._onClick(event, this);

        };

    }

    protected unmountListener() {

        this.listenerLayer.unmount();

    }


    public mountToDom( container: HTMLDivElement ) {
        this.attachToDom(container);
    }

    public unmountFromDom() {
        this.detachFromDom();
    }


    /**
     * Onmousemove interactions
     */

    protected _onHover?: ((event: MouseEvent, target: ThermalFileInstance) => any) = undefined;

    public setHoverHandler(handler?: ((event: MouseEvent, target: ThermalFileInstance) => any)) {
        this._onHover = handler;
    }

    public setHoverCursor(
        value: CSSStyleDeclaration["cursor"]
    ) {
        if (this.root)
            if (this.root.style.cursor !== value)
                this.root.style.cursor = value;
    }


    /**
     * Onclick interactions
     */

    protected _onClick?: ((event: MouseEvent, target: ThermalFileInstance) => any) = undefined;

    public setClickHandler(handler: ((event: MouseEvent, target: ThermalFileInstance) => any)| undefined = undefined ) {
        this._onClick = handler;
    }



    /**
     * Drawing
     */

    public draw() {
        if (this.mountedBaseLayers === true) 
        this.canvasLayer.draw();
    }

    /** Recieve a palette setting */
    public recievePalette(
        palette: string | number
    ) {
        this.draw();
    }






    /** 
     * CursorValue & hover state 
    */

    public readonly cursorValue: CursorValueDrive = new CursorValueDrive(this, undefined);


    protected _isHover: boolean = false;
    public get isHover() { return this._isHover }
    protected set isHover(value: boolean) {
        this._isHover = value;
    }

    public recieveCursorPosition(
        position: ThermalCursorPositionOrundefined,
    ) {

        this.cursorValue.recalculateFromCursor(position);

        if ( position !== undefined && this.cursorValue.value !== undefined ) {
            this.cursorLayer.setCursor( position.x, position.y, this.cursorValue.value );
            this.cursorLayer.show = true;
        } else {
            this.cursorLayer.show = false;
            this.cursorLayer.resetCursor();
        }

    }

    /**
     * Range
     */


    /** Recieve the range from the registry and redraw */
    public recieveRange(
        value: ThermalRangeOrUndefined
    ) {
        if (value !== undefined) {
            this.draw();
        }
    }


    /**
     * Opacity
     */

    /** Recieve the opacity from the registry and project it to the canvas layer */
    public recieveOpacity(value: number) {

        if (this.visibleLayer && this.canvasLayer) {
            this.canvasLayer.opacity = value;
        }
    }


    /** 
     * Highlighting
     */
    protected _isHighlight: boolean = false;
    public get isHighlight() { return this._isHighlight; }
    public doHighlight( state: boolean ) {

        this._isHighlight = state;

        if ( this.root ) {

            // If true, set propagate the color to the DOM and eventually show the highlight
            if ( state === true ) {

                this.root.style.borderColor = this.highlightColor;

                if ( this.showDateOnHighlight === true || this.timeHighlightSync === true ) {
                    this.dateLayer.show();
                }

            } 
            
            // If false, propagate the color and hide the date
            else {
                this.root.style.borderColor = "transparent";
                this.dateLayer.hide();
            }
        }

    }


    // Local highlight color is stored
    protected _highlightColor: string = "transparent";
    public get highlightColor() { return this._highlightColor; }
    /** Set the highlight color of the root */
    public setHighlightColor(value: string = "transparent") {

        this._highlightColor = value;
        this.dateLayer.setColor( value );

    }


    /**
     * Synchronised highlighting
     */
    protected _timeHighlightSync: boolean = true;
    public get timeHighlightSync() { return this._timeHighlightSync; }
    public setTimeHiglightSync(value: boolean) {
        this._timeHighlightSync = value;
    }
    public recieveTimeHighlight(value: boolean) {

        // If should hide, hide anyway
        if ( value === false ) {

            this.doHighlight( false );

        } 
        // If should show, do it only when listening to highlight sync
        else if ( this._timeHighlightSync === true ) 
        {

            this.doHighlight( true );

        }

    }


    /** 
     * Show date 
     * 
     * Whether or not the date shall be showed when highlighted
     */
    protected _showDateOnHighlight: boolean = true;
    public get showDateOnHighlight() { return this._showDateOnHighlight; }
    public setShowDateOnHighlight(
        value: boolean
    ) {
        this._showDateOnHighlight = value;
    }

    /**
     * Highlight on hover
     */
    protected _highlightOnHover: boolean = true;
    public get highlightOnHover() { return this._highlightOnHover }
    public setHighlightOnHover(
        value: boolean
    ) {
        this._highlightOnHover = value;
    }

    protected _forceHighlight: boolean = false;
    public get forceHighlight() { return this._forceHighlight; }
    public setForceHighlight(
        value: boolean
    ) {

        this._forceHighlight = value;

        if ( value === true ) {
            this.doHighlight( true );
        } else {

            if (
                this._isHover === false && this.isHighlight === true
            ) {
                this.doHighlight( false );
            }

        }

    }

}