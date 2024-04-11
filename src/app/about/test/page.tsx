"use client";

import { useMemo } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const Page: React.FC = () => {

    const data = useMemo(() => {

        const getValueAtIndex = (
            index: number
        ): {
            x: number,
            a?: number,
            b?: number,
            c?: number
        } => {
            return {
                x: index,
                a: Math.random() * 100,
                b: Math.random() * 100,
            }
        }

        const result: ReturnType<typeof getValueAtIndex>[] = [];

        for (let i = 0; i < 1000; i++) {
            result.push(getValueAtIndex(i));
        }

        let i = 0;

        while (i < result.length + 1000) {

            const val = Math.random() * 100;

            if (result[i] !== undefined) {

                result[i].c = val;

            } else {

                result.push({
                    x: i,
                    c: val
                });

            }

            i += Math.round(Math.random() * 100);

        }

        return result;

    }, []);

    return <div className="w-full h-full">

        <LineChart
            data={data}

            width={1900}
            height={200}

        >

            <XAxis
                dataKey="x"
                label={"x"}
            />

            <YAxis
                domain={[0, 100]}
                label="A"
            />

            <Line
                dataKey="a"
                stroke="red"
                name="Á"
                dot={false}
            />

            <Line
                dataKey="b"
                stroke="green"
                name="B"
                dot={false}
            />

            <Line
                dataKey="c"
                stroke="blue"
                fill="blue"
                // dot={false}
                name="B"
                connectNulls
            />

            <Tooltip />

        </LineChart>

    </div>

}

export default Page;