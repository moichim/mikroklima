import { DataGraphResponseType } from "@/modules/data/graphql/interfaces";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { Button, ButtonProps } from "@nextui-org/react"
import { CellBuilder, FileBuilder, SheetBuilder } from 'excel-build';

export type ExportButtonProps = ButtonProps & {
    data?: DataGraphResponseType,
    getFileName: () => string
};

export const ExportButton: React.FC<ExportButtonProps> = ({
    data,
    getFileName,
    ...props
}) => {



    return <Button
        isIconOnly
        size="lg"

        onClick={() => {

            const file = new FileBuilder(getFileName());

            const sheet = new SheetBuilder("data");

            const map = data?.resourcesMap;

            const colors: string[] = ["black", "black", "black", "black"];
            const properties: string[] = ["Čas", "", "", ""]
            const header: string[] = ["Rok", "Měsíc", "Den", "Hodina"];
            const body: { [index: number]: (number | string | undefined)[] } = [];

            // Create the initial structure based on the time
            if (data?.data) {
                data.data.forEach(entry => {
                    const date = new Date();
                    date.setTime(entry.time);
                    body[entry.time] = [
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        date.getUTCDate(),
                        date.getUTCHours()
                    ];
                });
            }

            // Create the element serving for color manipulation
            const element = document.createElement("div");
            document.body.appendChild(element);

            if (map && data.data) {
                Object.entries(map).forEach(([property, columns]) => {

                    Object.values(columns).forEach((column, index) => {

                        properties.push(`${column.in.name ?? column.in.slug} (${column.unit})`);

                        header.push(column.name);


                        element.style.color = column.color;

                        let cs = window.getComputedStyle(element).color;

                        let rgb = cs.substr(4).split(")")[0].split(","),
                            r = (+rgb[0]).toString(16),
                            g = (+rgb[1]).toString(16),
                            b = (+rgb[2]).toString(16);

                        if (r.length == 1)
                            r = "0" + r;
                        if (g.length == 1)
                            g = "0" + g;
                        if (b.length == 1)
                            b = "0" + b;

                        colors.push("#" + r + g + b );

                        data.data.forEach(row => {

                            const value = row[column.dataKey];
                            if (value !== undefined && value !== null) {
                                body[row.time].push(value);
                            } else {
                                body[row.time].push(undefined);
                            }

                        });


                    })


                });
            }

            // Remove the element serving for color manipulation
            document.body.removeChild(element);


            // Add the properties
            sheet.appendCustomRow(
                properties.map((item, index) => new CellBuilder(item)
                    // .setFontColor(colors[index])
                    .setFontBold( true )
                    .setBackgroundColor( "#f0f0f0" )
                    .build()
                )
            );

            // Add the header
            sheet.appendCustomRow(
                header.map((item, index) => new CellBuilder(item)
                    .setFontColor(colors[index])
                    .setFontBold( true )
                    .setBackgroundColor( "#f0f0f0" )
                    .setBorder( {
                        bottom: {
                            style: "medium",
                            color: {rgb: "#000"}
                        },
                        left: {
                            style: "thin",
                            color: {rgb: "#000"}
                        },
                        right: {
                            style: "thin",
                            color: {rgb: "#000"}
                        }
                    })
                    .build()
                )
            );

            // Add every individual row
            Object.values( body ).forEach( row => 
                sheet.appendCustomRow(
                    row.map((item, index) => new CellBuilder(item)
                        .setFontColor(colors[index])
                        .setFontBold( false )
                        .build()
                    )
                )
             );


            file.addSheet(sheet);

            file.download();

        }}
    >
        <ArrowDownCircleIcon style={{ height: "2rem" }} />
    </Button>

}
