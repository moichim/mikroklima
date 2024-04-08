import { ContentContainer } from '@/components/content/ui/contentContainer';
import { ScopeCard } from '@/components/scope/scopeCard';
import { ScopeMap } from '@/components/scope/scopeMap';
import { googleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { Button, Link } from '@nextui-org/react';

export default async function Home() {

  const data = await googleSheetsProvider.fetchAllScopesDefinitions();

  return <div className="pb-20">

    <div className="relative isolate px-6 pt-8 lg:px-8">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0011ff] to-[#ff00c8] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>


      <div className="mx-auto max-w-screen-xl pt-4">

        <div className="flex flex-wrap w-full items-center">

          <div className="w-full md:w-1/2">

            <div className="md:pr-4">

              <div className="mb-8 flex justify-start">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-primary ring-1 ring-primary">
                  2023 / 2024 - Pilotní ročník
                </div>
              </div>
              <div className="text-left pb-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  Mikroklima v mé obci
                </h1>
                <p className="mt-6 text-xl leading-8 text-foreground-500 pb-8">
                  Dlouhodobý vzdělávací projekt pro 2. stupeň ZŠ zaměřený na environmentální výchovu.
                </p>

                <div className="flex gap-4 w-full">
                  <Button
                    color="primary"
                    as={Link}
                    href={`/about/project`}
                  >
                    O projektu
                  </Button>
                  <Button
                    color="primary"
                    as={Link}
                    href={`/about/teams`}
                  >
                    Zúčastněné týmy
                  </Button>
                </div>

              </div>

            </div>

          </div>

          <div className="w-full md:w-1/2 py-5">

            <ScopeMap scopes={data} />

          </div>

        </div>

      </div>
    </div>

    <ContentContainer element="main" id="main">

      <div className="flex flex-wrap -m-4">

        {data.map(scope => <ScopeCard {...scope} key={scope.slug}/>)}

      </div>
    </ContentContainer>

  </div>;

}
