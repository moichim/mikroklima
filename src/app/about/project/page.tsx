import Timeline from '@/components/content/timeline';

export default async function Home() {

    return <div className="flex flex-wrap w-full py-10 px-4 mx-auto max-w-[1200px]">

        <div className="w-full md:w-1/2">

            <div className="flex flex-col gap-4 px-4">

                <h1 className="text-xl font-bold pb-6">Timeline</h1>

                <Timeline />

            </div>

        </div>

        <div className="w-full md:w-1/2">

            <div className="flex flex-col gap-4 px-4">

                <p>...dodat texty</p>

            </div>

        </div>
    </div>;

}
