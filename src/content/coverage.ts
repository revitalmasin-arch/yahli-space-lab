// Page coverage manifest (parent requirement, 2026-10-16): the units together must teach AND ask
// everything on the textbook's printed pages 168–190. Each page lists the concepts that cover it.
// tests/unit/coverage.test.ts checks every page is mapped, every concept exists, cites the page,
// and has at least one check question and one review question.

export const ASSIGNED_PAGES = { from: 168, to: 190 };

export const PAGE_COVERAGE: Record<number, string[]> = {
  168: ['c-sky-ancient'], // ancient sky-watching, constellations, North Star, geocentric belief
  169: ['c-telescope'], // Galileo, modern space telescopes
  170: ['c-sky-ancient', 'c-telescope'], // observing the night sky, with and without instruments
  171: ['c-telescope', 'c-sci-question', 'c-universe'], // telescopes, scientific questions, mostly empty space
  172: ['c-nesting', 'c-universe'], // galaxies, Milky Way, Solar System
  173: ['c-nesting', 'c-universe', 'c-life'], // the journey summary, Earth the planet with life
  174: ['c-star', 'c-lit'], // star vs planet
  175: ['c-order', 'c-groups', 'c-belt'], // the Solar System, rocky and gas planets
  176: ['c-belt', 'c-model'], // asteroid belt, building a model
  177: ['c-model'], // model specification, planning, building, evaluating
  178: ['c-planet-data', 'c-life', 'c-order'], // fact sheets: Mercury, Venus, Earth
  179: ['c-planet-data', 'c-groups', 'c-moon-satellite'], // fact sheets: Mars to Neptune
  180: ['c-planet-data', 'c-orbit-time', 'c-dwarf'], // research questions, dwarf planets
  181: ['c-comet', 'c-meteor', 'c-helio'], // meteorites, comets, Copernicus
  182: ['c-helio', 'c-order', 'c-groups'], // review: who am I, order, models
  183: ['c-star', 'c-lit', 'c-groups', 'c-nesting'], // chapter summary
  184: ['c-calendar'], // calendars
  185: ['c-periodic', 'c-year'], // periodic motion, year model
  186: ['c-year'], // the year, seasons as evidence
  187: ['c-calendar', 'c-year'], // the general (solar) calendar
  188: ['c-sunpath', 'c-day'], // sunrise/sunset, globe-and-lamp model
  189: ['c-day', 'c-sunpath'], // day and night, time differences, day length vs yemama
  190: ['c-sunpath', 'c-time-units'], // apparent motion of the Sun, hours/minutes/seconds
};
