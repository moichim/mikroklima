import * as htmlToImage from 'html-to-image'
import { useToSvg, useToPng, useToJpeg } from "@hugocxl/react-to-image";
import { RefObject } from 'react';

export const useExportImage = (
    selector: string,
    getFileName: () => string,
    beforePrint: () => void,
    afterPrint: () => void
) => {

    const [state, convert] = useToPng<HTMLDivElement>({
        backgroundColor: "white",
        selector: selector,
        onSuccess: data => {
            const link = document.createElement('a');
            link.download = `${getFileName()}.jpg`;
            link.href = data;
            link.click();
        }
    });

    const download = async () => {

        beforePrint();

        setTimeout(() => {

            convert();

            afterPrint();

        }, 20);

    }


    return {
        download,
        printingState: state
    }

}