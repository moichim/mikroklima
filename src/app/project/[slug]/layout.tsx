import { Navbar } from "@/components/navigation/utils/Navbar";
import { ScopeDropdownMenu } from "@/components/scope/scopeDropdownMenu";
import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { FromControl } from "@/state/time/components/controls/fromControl";
import { ToControl } from "@/state/time/components/controls/toControl";
import { PresetDropdown } from "@/state/time/components/presetDropdown";
import { TimeContextProvider } from "@/state/time/timeContext";
import { Dropdown, DropdownTrigger } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

export type ScopePageProps = {
    params: {
        slug: string
    }
};

/** @todo Should not use the meteo context at all! */
const ScopeLayout = async ({ ...props }) => {

    const allScopes = await scopeProvider.fetchAllScopesDefinitions();
    const scope = allScopes.find(s => s.slug === props.params.slug)!;

    if (scope === undefined)
        notFound();

    const links = [
        {
            text: "Naměřená data",
            href: `/project/${scope.slug}/data`,
        },
        {
            text: "Informace o týmu",
            href: `/project/${scope.slug}/info`
        },

    ];

    if (scope.count > 0) {
        links.push({
            text: "Termogramy",
            href: `/project/${scope.slug}/thermo`
        });
    }

    return <ScopeContextProvider activeScope={scope} allScopes={allScopes}>

        <TimeContextProvider scope={scope}>

            <Navbar
                brandContent={<Dropdown
                    backdrop="blur"
                >
                    <DropdownTrigger>
                        <div className="flex gap-2 hover:text-primary cursor-pointer">
                            <strong>{scope.name}</strong>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                        </div>
                    </DropdownTrigger>
                    <ScopeDropdownMenu {...scope} />
                </Dropdown>}
                links={links}

                closeLink="/"
                closeLinkHint={`Zavřít projekt ${scope.name}`}
                className="bg-slate-100"
                classNames={{
                    // menu: "top-32 bg-red-300"
                }}
            >
                <div className="flex gap-0 items-center group">
                    <FromControl />
                    <div className="h-[2px] bg-gray-300 w-3 group-hover:bg-primary-300"></div>
                    <ToControl />
                </div>
                <PresetDropdown />
            </Navbar>

            <main className="w-full min-h-screen bg-gray-200 pb-[10rem]">
                {props.children}
            </main>

        </TimeContextProvider>
    </ScopeContextProvider>
}

export default ScopeLayout;