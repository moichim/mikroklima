import { useToPng } from "@hugocxl/react-to-image";

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
            link.download = `${getFileName()}.png`;
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