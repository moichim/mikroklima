# Hromadné zpracování LRC souborů

## Co aplikace dělá

Aplikace zpracovává snímky z termokamery [LabIR Edu](https://edu.labir.cz). 

### Souborový formát LRC

- Obsahuje teplotní data ve stupních Celsia
- Obsahuje časovoz značku a další metadata
- Souborový formát vznikl na [NTC ZČU v Plzni](https://irt.zcu.cz/cs/) pro potřeby vzdělávacích termokamer

Snímky z termokamer jsou běžně zobrazovány a vyhodnocovány ve [specializovaném softwaru](https://edu.labir.cz/edukit/software). Uživatel v něm čte teploty, případně mění zobrazení teplotní škály. Limitem existujícíh aplikací je nemožnost hromadného zpracování snímků.

Tato aplikace umožňuje <strong>webové zpracování LRC souborů</strong> a hlavní důraz je ve <strong>zpracování více souborů současně</strong>.

Užití aplikace je vyhodnocování dlouhodobého časosběrného měření.

## Jak aplikace funguje

### Workflow

- Prohlížeč načte LRC soubory ze serveru.
- Přečte binární data a vykreslí obrázek v `canvas`.
- Uživatel může měnit teplotní škálů u všech souborů zároveň.
- Teploty jsou prohlíženy vždy v rámci skupin souborů (nikoliv individuálně).

### Vrstvy aplikace


#### Jádro v čistém TypeScriptu

- `ThermalRegistry` cachuje načtené soubory a umožňuje hromadně nastavovat skupiny
- `ThermalGroup` ovládá jednu skupinu snímků
- `ThermalFileInstance` vykresluje snímek a obsluhuje uživatelské interakce
- Registr, skupina a instance mají parametry jako je teplotní škála, rozsah či průhlednost.
- Parametry jsou synchronizovány napříč skupinami a instancemi.
- Změna parametrů je emitována ven jako JS `Event`.

#### UI v Reactu

- Globální instance `ThermalRegistry` je držena v kontextu.
- React se stará o veškeré vykreslování.
- Komponenty mohou přidat své event listenery k registru, skupině či instanci.
- Díky event listenerům je možné zrcadlit stav jádra v Reactu.
- Parametry jádra je možné nastavovat z Reactovského UI.

#### Infrastruktura v Next.js

- Webová aplikace běží na Next.js
- Dotazy běží přes GraphQl
- GraphQL je obsluhováno Apollo serverem, který je v Next.js implementován.