"use client";

import { ProjectDescription, ProjectFolderDefinition } from "@/modules/thermal/context/useProjectLoader";
import { ThermalFileInstance } from "@/modules/thermal/file/ThermalFileInstance";
import { ThermalManager } from "./ThermalManager";
import { IThermalRegistry } from "./interfaces";
import { HighlightDrive } from "./properties/drives/highlight/HighlightDrive";
import { OpacityDrive } from "./properties/drives/opacity/OpacityDrive";
import { PaletteDrive } from "./properties/drives/palette/PaletteDrive";
import { RangeDriver } from "./properties/drives/range/RangeDriver";
import { GroupsState } from "./properties/lists/groups/GroupsState";
import { HistogramState } from "./properties/states/histogram/HistogramState";
import { LoadingState } from "./properties/states/loading/LoadingState";
import { MinmaxRegistryProperty } from "./properties/states/minmax/registry/MinmaxRegistryState";
import { ThermalRegistryLoader } from "./utilities/ThermalRegistryLoader";
import { ThermalFileRequest } from "./utilities/ThermalRequest";
import { ThermalGroup } from "./ThermalGroup";

/**
 * The global thermal registry
 * @todo implementing EventTarget
 */
export class ThermalRegistry implements IThermalRegistry {

    public readonly hash = Math.random();

    public constructor(
        public readonly id: string,
        public readonly manager: ThermalManager
    ) {
        // super();
    }

    /** Takes care of the entire loading */
    protected readonly loader: ThermalRegistryLoader = new ThermalRegistryLoader(this);



    /** Groups are stored in an observable property */
    public readonly groups: GroupsState = new GroupsState(this, []);



    /** Iterator methods */

    public forEveryGroup(fn: ((group: ThermalGroup) => any)) {
        this.groups.value.forEach(fn);
    }

    public forEveryInstance(fn: (instance: ThermalFileInstance) => any) {
        this.forEveryGroup(group => group.instances.forEveryInstance(fn));
    }



    /**
     * Loads the registry with a complete API response
     */
    public async loadProject(
        description: ProjectDescription
    ) {

        // Reset everything at first
        this.reset();

        // Create the groups from the definition
        for (const groupId in description) {

            const group = this.groups.addOrGetGroup(groupId, description[groupId].name, description[groupId].description);

            // Request the files
            this.loader.requestFiles(group, description[groupId].files);

        }

        this.loading.markAsLoading();

        setTimeout(async () => {

            // Resolve the query and create the instances where they should be
            await this.loader.resolveQuery();

            this.postLoadedProcessing();

        }, 0);

    }

    public async loadGroupOfFiles(
        groupId: string,
        folderDefinition: ProjectFolderDefinition
    ) {

        this.reset();

        const group = this.groups.addOrGetGroup( 
            groupId, 
            folderDefinition.name,
            folderDefinition.description
        );

        this.loader.requestFiles( group, folderDefinition.files );

        this.loading.markAsLoading();

        setTimeout( async () => {

            await this.loader.resolveQuery();

            this.postLoadedProcessing();

        }, 0 );

    }


    /** Load the registry with only one file. */
    public async loadOneFile(file: ThermalFileRequest, groupId: string) {

        this.reset();

        const group = this.groups.addOrGetGroup(groupId);

        this.loader.requestFile(group, file.thermalUrl, file.visibleUrl);

        this.loading.markAsLoading();

        setTimeout(async () => {

            // Resolve the entire query
            await this.loader.resolveQuery();

            this.postLoadedProcessing();

        }, 0);

    }


    /** Actions to take after the registry is loaded */
    protected postLoadedProcessing() {


        // Recalculate individual minmaxes
        this.forEveryGroup(group => group.minmax.recalculateFromInstances());

        // Recalculate the minmax
        this.minmax.recalculateFromGroups();

        // If there is minmax, impose it down
        if (this.minmax.value)
            this.range.imposeRange({ from: this.minmax.value.min, to: this.minmax.value.max });

        // Recalculate the histogram
        this.histogram.recalculateWithCurrentSetting();

        this.loading.markAsLoaded();

    }




    public reset() {

        this.forEveryGroup(group => group.reset());

        if (this.loader.loading === false) {
            // this.removeAllChildren();
            this.opacity.reset();
            this.minmax.reset();
        }

    }

    public removeAllChildren() {
        this.groups.removeAllGroups();
    };

    public destroySelfAndBelow() {
        this.reset();
    }

    public destroySelfInTheManager() {
        this.manager.removeRegistry(this.id);
    }








    /**
     * Observable properties and drives
     */


    /** 
     * Opacity property 
     */
    public readonly opacity: OpacityDrive = new OpacityDrive(this, 1);

    /** 
     * Minmax property 
     */
    public readonly minmax: MinmaxRegistryProperty = new MinmaxRegistryProperty(this, undefined);

    /**
     * Loading
     */
    public readonly loading: LoadingState = new LoadingState(this, false);

    /**
     * Range
     */
    public readonly range: RangeDriver = new RangeDriver(this, undefined);

    /**
     * Histogram
     */
    public readonly histogram: HistogramState = new HistogramState(this, []);

    /**
     * Palette
     */
    public readonly palette = this.manager.palette;


    /**
     * Highlight
     */
    public readonly highlight: HighlightDrive = new HighlightDrive(this, undefined);




}

export type ThermalStatistics = {
    from: number,
    to: number,
    percentage: number,
    count: number,
    height: number
}