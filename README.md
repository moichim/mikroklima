# Mikroklima ve vaší obci

Aplikace v [Next.js](https://nextjs.org) vizualizující meteorologická data nasbíraná v rámci vzdělávacích projektů NTC ZČU v Plzni.

- studentské týmy jsou vybaveny termokamerami, meteostanicemi a měřiči slunečního svitu
- ve zvolených lokalitách studenti pravidelně měří veličiny dle svého výběru a data zaznamenávají je do Google Sheets
- v závěru projektu budou data vyhodnocovat a vyvozovat z nich návrh na zlepšení mikroklimatu v obci

Webová aplikace slouží pro **průběžnou vizualizaci dat** a pro **sdílení progresu napříč týmy**.

## Workflow

1. studentský tým vytovří tabulku v Google Sheets a nasdílí jí servisnímu účtu pro tuto aplikaci
2. tabulka má předepsaný formát ([vzor]())
3. pro běh aplikace je nutná jedna další tabulka obsahující informace o nalinkovaných týmech (ID sheetu, ID dokumentu s popisem, souřadnice pro Open Meteo)
4. data o týmech se fetchují při buildu, ale meterologická data se fetchují průběžně

## Formát dat

Pokud v jednom časovém záznamu údaje chybí, je nutné nechat buňky prázdné. Formát desetinných čísel je libovolný.

## Servisní účet

Credentials viz .env.local

Servisní účet musí mít access k Sheets API a k Docs API.

## Hlavní knihovny

- Recharts
- @apollo/server
- @apollo/client
- @nextui-org/react
- tailwindcss
- googleapis
- openmeteo
- date-fns

## Roadplan

- implementovat Open Meteo přesněji
    - v současné době fetchujeme archiv předpovědi počasí, která je dostupná pouze 3 měsíce zpětně
    - je třeba primárně fetchovat historická data, která jsou však jen do 5 dnů zpětně
    - od 5 dnů do budoucnosti fetchovat předpověď
- údaje o týmech umístit mimo Google Sheets 
- zlepšit UX na mobilu
- zobrazovat termogramy


## Vývoj

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run test
```

Deploy commitem do `main`.
