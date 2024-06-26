import { Toolbar } from "@/components/ui/toolbar/Toolbar";
import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { ScopeDropdownMenu } from "@/modules/scope/components/scopeDropdownMenu";
import { ScopeContextProvider } from "@/modules/scope/scopeContext";
import { TimeFromControl } from "@/modules/time/components/controls/timeFromControl";
import { TimeToControl } from "@/modules/time/components/controls/timeToControl";
import { TimePresetDropdown } from "@/modules/time/components/timePresetDropdown";
import { TimeContextProvider } from "@/modules/time/timeContext";
import { Dropdown, DropdownTrigger } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

export type ScopePageProps = {
  params: {
    slug: string;
  };
};

/** @todo Should not use the meteo context at all! */
const ScopeLayout = async ({ ...props }) => {
  const allScopes = await scopeProvider.fetchAllScopesDefinitions();
  const scope = allScopes.find((s) => s.slug === props.params.slug)!;

  if (scope === undefined) notFound();

  const links = [
    {
      text: "Naměřená data",
      href: `/project/${scope.slug}/data`,
    },
    {
      text: "Informace o týmu",
      href: `/project/${scope.slug}/info`,
    },
  ];

  if (scope.count > 0) {
    links.push({
      text: "Termogramy",
      href: `/project/${scope.slug}/thermo`,
    });
  }

  return (
    <ScopeContextProvider activeScope={scope} allScopes={allScopes}>
      <TimeContextProvider scope={scope}>
        <Toolbar
          label={
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <div className="flex gap-2 hover:text-primary cursor-pointer">
                  <strong>{scope.name}</strong>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </DropdownTrigger>
              <ScopeDropdownMenu {...scope} />
            </Dropdown>
          }
          classes={{
            container: "bg-slate-100",
          }}
          menu={links}
          close={{ href: "/", tooltip: "Zavřít projekt" }}
          configurationLabel="Čas"
          configuration={[
            {
              content: (
                <div className="flex gap-0 items-center group">
                  <TimeFromControl />
                  <div className="h-[2px] bg-gray-300 w-3 group-hover:bg-primary-300"></div>
                  <TimeToControl />
                </div>
              ),
              label: "Časový rozsah",
            },
            {
              content: <TimePresetDropdown />,
              label: "Předdefinované rozsahy",
            },
          ]}
        ></Toolbar>

        <main className="w-full min-h-screen bg-gray-200 pb-[10rem]">
          {props.children}
        </main>
      </TimeContextProvider>
    </ScopeContextProvider>
  );
};

export default ScopeLayout;
