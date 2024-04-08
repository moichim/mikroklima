import { Code, Link } from '@nextui-org/react';

export default async function Home() {

  return <div className="flex flex-wrap w-full py-10 px-4 mx-auto max-w-[1200px]">

    <div className="w-full md:w-1/3">

      <div className="flex flex-col gap-4 px-4">

        <h1 className="text-xl font-bold">Co</h1>

        <p>Aplikace zpracovává snímky z termokamery <Link href="https://edu.labir.cz" target="_blank" color="primary" className="text-primary">LabIR Edu</Link>. </p>

        <p><strong>Souborový formát LRC</strong></p>

        <ul className="list-disc ml-4">
          <li>Obsahuje teplotní data ve stupních Celsia</li>
          <li>Obsahuje časovou značku a další metadata</li>
          <li>Souborový formát vznikl na <Link href="https://irt.zcu.cz/cs/" target="_blank" className="text-primary">NTC ZČU v Plzni</Link> pro potřeby vzdělávacích termokamer</li>
        </ul>

        <p>Snímky z termokamer jsou běžně zobrazovány a vyhodnocovány ve <Link href="https://edu.labir.cz/edukit/software" target="_blank" className="text-primary">specializovaném softwaru</Link>. Uživatel v něm čte teploty, případně mění zobrazení teplotní škály. Limitem existujícíh aplikací je nemožnost hromadného zpracování snímků.</p>

        <p>Tato aplikace umožňuje <strong>webové zpracování LRC souborů</strong> a hlavní důraz je ve <strong>zpracování více souborů současně</strong>.</p>

        <p>Užití aplikace je vyhodnocování dlouhodobého časosběrného měření.</p>

      </div>

    </div>

    <div className="w-full md:w-2/3">

      <div className="flex flex-col gap-4 px-4">

        <h1 className="text-xl font-bold">Jak</h1>

        <p><strong>Workflow</strong></p>

        <ul className="list-decimal ml-4">
          <li>Prohlížeč načte LRC soubory ze serveru.</li>
          <li>Přečte binární data a vykreslí obrázek v <Code>canvas</Code>.</li>
          <li>Uživatel může měnit teplotní škálů u všech souborů zároveň.</li>
          <li>Teploty jsou prohlíženy vždy v rámci skupin souborů (nikoliv individuálně).</li>
        </ul>

        <p><strong>Vrstvy aplikace</strong></p>

        <ul className="list-disc ml-4">
          <li><strong>Jádro v čistém TypeScriptu</strong>
            <ul className="list-disc ml-8">
              <li><Code>ThermalRegistry</Code> cachuje načtené soubory a umožňuje hromadně nastavovat skupiny</li>
              <li><Code>ThermalGroup</Code> ovládá jednu skupinu snímků</li>
              <li><Code>ThermalFileInstance</Code> vykresluje snímek a obsluhuje uživatelské interakce</li>
              <li>Registr, skupina a instance mají parametry jako je teplotní škála, rozsah či průhlednost.</li>
              <li>Parametry jsou synchronizovány napříč skupinami a instancemi.</li>
              <li>Změna parametrů je emitována ven jako JS <Code>Event</Code>.</li>
            </ul>
          </li>
          <li><strong>UI v Reactu</strong>
            <ul className="list-disc ml-8">
              <li>Globální instance <Code>ThermalRegistry</Code> je držena v kontextu.</li>
              <li>React se stará o veškeré vykreslování.</li>
              <li>Komponenty mohou přidat své event listenery k registru, skupině či instanci.</li>
              <li>Díky event listenerům je možné zrcadlit stav jádra v Reactu.</li>
              <li>Parametry jádra je možné nastavovat z Reactovského UI.</li>
            </ul>
          </li>
          <li><strong>Infrastruktura v Next.js</strong>
            <ul className="list-disc ml-8">
              <li>Webová aplikace běží na Next.js</li>
              <li>Dotazy běží přes GraphQl</li>
              <li>GraphQL je obsluhováno Apollo serverem, který je v Next.js implementován.</li>
            </ul>
          </li>
        </ul>
      </div>

    </div>
  </div>;

}
