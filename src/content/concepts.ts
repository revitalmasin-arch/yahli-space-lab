import { t } from '../lib/hebrew';
import type { Concept } from './types';
import { MORE_CONCEPTS } from './concepts-more';

// Help-ladder material per concept: step 2 (different explanation + visual) and step 3 (worked example
// on a parallel item, followed by a NEW question). Questions carry their own step-1 hints.

const BASE_CONCEPTS: Concept[] = [
  {
    id: 'c-universe',
    unit: 'u1',
    name: t('Universe and space', 'יְקוּם וְחָלָל'),
    alt: t(
      'Think of a dark ocean with islands. The ocean is space; the islands are bodies (stars, planets, moons). The ocean and all the islands together are the universe.',
      'חָלָל הוּא כְּמוֹ יָם חָשׁוּךְ. הַגּוּפִים הֵם כְּמוֹ אִיִּים. הַיָּם וְכָל הָאִיִּים יַחַד — זֶה הַיְקוּם.',
    ),
    altVisual: 'universe-zoom',
    worked: t(
      'Example: Is the Moon part of the universe? The universe is space + all the bodies. The Moon is a body, so yes.',
      'דּוּגְמָה: הַאִם הַיָּרֵחַ חֵלֶק מֵהַיְקוּם? הַיְקוּם = חָלָל + כָּל הַגּוּפִים. הַיָּרֵחַ הוּא גּוּף, לָכֵן כֵּן.',
    ),
    sources: [{ page: 171 }, { page: 172 }, { page: 173 }],
  },
  {
    id: 'c-nesting',
    unit: 'u1',
    name: t('What is inside what', 'מָה נִמְצָא בְּתוֹךְ מָה'),
    alt: t(
      'Like an address: your room is in your home, your home is in your city. Earth is in the Solar System, the Solar System is in the Milky Way, and the Milky Way is in the universe.',
      'כְּמוֹ כְּתוֹבֶת: כַּדּוּר הָאָרֶץ בְּתוֹךְ מַעֲרֶכֶת הַשֶּׁמֶשׁ. מַעֲרֶכֶת הַשֶּׁמֶשׁ בְּתוֹךְ שְׁבִיל הֶחָלָב. שְׁבִיל הֶחָלָב בְּתוֹךְ הַיְקוּם.',
    ),
    altVisual: 'universe-zoom',
    worked: t(
      'Example: Is the Sun inside the Milky Way? The Sun is in the Solar System, and the Solar System is inside the Milky Way. So yes.',
      'דּוּגְמָה: הַאִם הַשֶּׁמֶשׁ בְּתוֹךְ שְׁבִיל הֶחָלָב? הַשֶּׁמֶשׁ בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ, וּמַעֲרֶכֶת הַשֶּׁמֶשׁ בְּתוֹךְ שְׁבִיל הֶחָלָב. לָכֵן כֵּן.',
    ),
    sources: [{ page: 172 }, { page: 173 }, { page: 183 }],
  },
  {
    id: 'c-star',
    unit: 'u2',
    name: t('A star makes light', 'כּוֹכָב מֵפִיק אוֹר'),
    alt: t(
      'A star is like a giant campfire in space: it makes its own light and heat. The Sun is our star.',
      'כּוֹכָב הוּא כְּמוֹ מְדוּרָה עֲנָקִית בֶּחָלָל. יֵשׁ לוֹ אוֹר וְחוֹם מִשֶּׁלּוֹ. הַשֶּׁמֶשׁ הִיא כּוֹכָב.',
    ),
    altVisual: 'star-planet-light',
    worked: t(
      'Example: The North Star (Polaris) shines with its own light. Its own light means it is a star — a body that is מֵאִיר.',
      'דּוּגְמָה: כּוֹכַב הַצָּפוֹן מֵפִיק אוֹר בְּעַצְמוֹ. לָכֵן הוּא כּוֹכָב — גּוּף מֵאִיר.',
    ),
    sources: [{ page: 174 }, { page: 183 }, { page: 214 }],
  },
  {
    id: 'c-lit',
    unit: 'u2',
    name: t('A planet is lit', 'כּוֹכַב לֶכֶת מוּאָר'),
    alt: t(
      'A planet is like a ball in a dark room: you only see it when a lamp shines on it. The Sun is the lamp.',
      'כּוֹכַב לֶכֶת הוּא כְּמוֹ כַּדּוּר בְּחֶדֶר חָשׁוּךְ. רוֹאִים אוֹתוֹ רַק כְּשֶׁמְּנוֹרָה מְאִירָה עָלָיו. הַשֶּׁמֶשׁ הִיא הַמְּנוֹרָה.',
    ),
    altVisual: 'star-planet-light',
    worked: t(
      'Example: Venus looks very bright in the evening sky. It is a planet, and sunlight shines on it. So Venus is מוּאָר.',
      'דּוּגְמָה: נוֹגַהּ נִרְאֶה בָּהִיר מְאוֹד בַּשָּׁמַיִם. הוּא כּוֹכַב לֶכֶת, וְאוֹר הַשֶּׁמֶשׁ מֵאִיר עָלָיו. לָכֵן נוֹגַהּ מוּאָר.',
    ),
    sources: [{ page: 174 }, { page: 183 }, { page: 214 }],
  },
  {
    id: 'c-order',
    unit: 'u3',
    name: t('Planet order from the Sun', 'סֵדֶר כּוֹכְבֵי הַלֶּכֶת'),
    alt: t(
      'Count outward from the Sun: 1 Mercury, 2 Venus, 3 Earth, 4 Mars — then the asteroid belt — 5 Jupiter, 6 Saturn, 7 Uranus, 8 Neptune.',
      'סוֹפְרִים מֵהַשֶּׁמֶשׁ: 1 חַמָּה, 2 נוֹגַהּ, 3 כַּדּוּר הָאָרֶץ, 4 מַאֲדִים, 5 צֶדֶק, 6 שַׁבְּתַאי, 7 אוּרָנוּס, 8 נֶפְּטוּן.',
    ),
    altVisual: 'solar-order',
    worked: t(
      'Example: Which planet comes right after Earth? Earth is 3rd, so the next one, 4th, is Mars (מַאֲדִים).',
      'דּוּגְמָה: מָה בָּא אַחֲרֵי כַּדּוּר הָאָרֶץ? כַּדּוּר הָאָרֶץ שְׁלִישִׁי. הָרְבִיעִי הוּא מַאֲדִים.',
    ),
    sources: [{ page: 175 }, { page: 178 }, { page: 179 }, { page: 182 }],
  },
  {
    id: 'c-names',
    unit: 'u3',
    name: t('Hebrew and English planet names', 'שְׁמוֹת כּוֹכְבֵי הַלֶּכֶת'),
    alt: t(
      'Two names sound like English: אוּרָנוּס = Uranus, נֶפְּטוּן = Neptune. The others are different: חַמָּה Mercury, נוֹגַהּ Venus, מַאֲדִים Mars, צֶדֶק Jupiter, שַׁבְּתַאי Saturn.',
      'אוּרָנוּס וְנֶפְּטוּן דּוֹמִים לָאַנְגְּלִית. חַמָּה, נוֹגַהּ, מַאֲדִים, צֶדֶק וְשַׁבְּתַאי שׁוֹנִים.',
    ),
    altVisual: 'solar-order',
    worked: t(
      'Example: Mars is reddish. In Hebrew, red is אָדוֹם — so מַאֲדִים is Mars.',
      'דּוּגְמָה: מַאֲדִים אֲדַמְדַּם. אָדוֹם ← מַאֲדִים. בְּאַנְגְּלִית: Mars.',
    ),
    sources: [{ page: 175 }, { page: 178 }, { page: 179 }],
  },
  {
    id: 'c-groups',
    unit: 'u4',
    name: t('Rocky planets and gas giants', 'כּוֹכְבֵי לֶכֶת אַרְצִיִּים וְגַזִּים עֲנָקִיִּים'),
    alt: t(
      'Rocky planets have solid ground you could stand on. Gas giants are huge balls made mostly of gas, with no solid surface.',
      'לְכוֹכְבֵי לֶכֶת אַרְצִיִּים יֵשׁ קַרְקַע מוּצֶקֶת. לַגַּזִּים הָעֲנָקִיִּים אֵין קַרְקַע — הֵם עֲשׂוּיִים בְּעִיקָּר מִגַּזִּים.',
    ),
    altVisual: 'planet-groups',
    worked: t(
      'Example: Saturn has no solid ground and is made mostly of gas, so it belongs to the gas giants.',
      'דּוּגְמָה: לְשַׁבְּתַאי אֵין קַרְקַע מוּצֶקֶת, וְהוּא עָשׂוּי בְּעִיקָּר מִגַּזִּים. לָכֵן הוּא שַׁיָּיךְ לַגַּזִּים הָעֲנָקִיִּים.',
    ),
    sources: [{ page: 175 }, { page: 179 }, { page: 182 }, { page: 183 }],
  },
  {
    id: 'c-dwarf',
    unit: 'u4',
    name: t('Dwarf planets', 'כּוֹכְבֵי לֶכֶת נַנָּסִיִּים'),
    alt: t(
      'A dwarf planet is round and orbits the Sun like a planet, but it is smaller than the planets.',
      'כּוֹכַב לֶכֶת נַנָּסִי עָגוֹל וּמַקִּיף אֶת הַשֶּׁמֶשׁ, אֲבָל הוּא קָטָן מִכּוֹכְבֵי הַלֶּכֶת.',
    ),
    altVisual: 'planet-groups',
    worked: t(
      'Example: Eris is round, orbits the Sun, and is smaller than Mercury. So Eris is a dwarf planet.',
      'דּוּגְמָה: אֵרִיס עָגוֹל, מַקִּיף אֶת הַשֶּׁמֶשׁ, וְקָטָן מֵחַמָּה. לָכֵן אֵרִיס הוּא כּוֹכַב לֶכֶת נַנָּסִי.',
    ),
    sources: [{ page: 175 }, { page: 180 }],
  },
  {
    id: 'c-belt',
    unit: 'u5',
    name: t('The asteroid belt', 'חֲגוֹרַת הָאַסְטֵרוֹאִידִים'),
    alt: t(
      'Picture a ring of rocks around the Sun. It lies in the gap between planet 4 (Mars) and planet 5 (Jupiter).',
      'דַּמְיֵין טַבַּעַת שֶׁל סְלָעִים סְבִיב הַשֶּׁמֶשׁ. הִיא בֵּין כּוֹכַב לֶכֶת 4 (מַאֲדִים) לְכוֹכַב לֶכֶת 5 (צֶדֶק).',
    ),
    altVisual: 'asteroid-belt',
    worked: t(
      'Example: Travel out from the Sun: Mercury, Venus, Earth, Mars — then rocks everywhere: the asteroid belt — then Jupiter.',
      'דּוּגְמָה: יוֹצְאִים מֵהַשֶּׁמֶשׁ: חַמָּה, נוֹגַהּ, כַּדּוּר הָאָרֶץ, מַאֲדִים — וְאָז חֲגוֹרַת הָאַסְטֵרוֹאִידִים — וְאָז צֶדֶק.',
    ),
    sources: [{ page: 175 }, { page: 176 }],
  },
  {
    id: 'c-inner-outer',
    unit: 'u5',
    name: t('Inner and outer planets', 'כּוֹכְבֵי לֶכֶת פְּנִימִיִּים וְחִיצוֹנִיִּים'),
    alt: t(
      'Inner or outer = WHERE the planet is (before or after the asteroid belt). Rocky or gas giant = WHAT it is made of. Two different questions.',
      'פְּנִימִי אוֹ חִיצוֹנִי — אֵיפֹה הוּא נִמְצָא. אַרְצִי אוֹ גַּז עֲנָק — מִמָּה הוּא עָשׂוּי.',
    ),
    altVisual: 'asteroid-belt',
    worked: t(
      'Example: Uranus is after the asteroid belt, so it is an outer planet. (That tells us where it is, not what it is made of.)',
      'דּוּגְמָה: אוּרָנוּס נִמְצָא אַחֲרֵי חֲגוֹרַת הָאַסְטֵרוֹאִידִים. לָכֵן הוּא כּוֹכַב לֶכֶת חִיצוֹנִי.',
    ),
    sources: [{ page: 175 }, { page: 176, note: 'inner/outer wording is from the teacher topic list, not the book' }],
  },
  {
    id: 'c-moon-satellite',
    unit: 'u6',
    name: t('A moon is a natural satellite', 'יָרֵחַ הוּא לַוְיָן טִבְעִי', 'ירח הוא לוויין טבעי'),
    alt: t(
      'A satellite is something that goes around a planet. Nobody built our Moon, so it is a natural satellite of Earth.',
      'לַוְיָן נָע מִסָּבִיב לְכוֹכַב לֶכֶת. אַף אֶחָד לֹא בָּנָה אֶת הַיָּרֵחַ, לָכֵן הוּא לַוְיָן טִבְעִי.',
      'לוויין נע מסביב לכוכב לכת. אף אחד לא בנה את הירח, לכן הוא לוויין טבעי.',
    ),
    altVisual: 'moon-orbit',
    worked: t(
      'Example: Phobos goes around Mars, and it is natural. So Phobos is a moon of Mars.',
      'דּוּגְמָה: פוֹבּוֹס מַקִּיף אֶת מַאֲדִים, וְהוּא טִבְעִי. לָכֵן הוּא יָרֵחַ שֶׁל מַאֲדִים.',
    ),
    sources: [{ page: 193 }, { page: 194 }, { page: 215 }, { page: 179 }],
  },
  {
    id: 'c-moon-light',
    unit: 'u6',
    name: t('Moonlight is reflected sunlight', 'הַיָּרֵחַ מַחֲזִיר אֶת אוֹר הַשֶּׁמֶשׁ'),
    alt: t(
      'Sunlight hits the Moon and bounces back to our eyes. Without the Sun we could not see the Moon.',
      'אוֹר הַשֶּׁמֶשׁ פּוֹגֵעַ בַּיָּרֵחַ וְחוֹזֵר אֵלֵינוּ. בְּלִי הַשֶּׁמֶשׁ לֹא הָיִינוּ רוֹאִים אֶת הַיָּרֵחַ.',
    ),
    altVisual: 'moon-orbit',
    worked: t(
      "Example: Through a telescope we can see Jupiter's moons. Do they make light? No — sunlight shines on them and reflects back. So they are מוּאָרִים.",
      'דּוּגְמָה: בְּטֶלֶסְקוֹפּ רוֹאִים אֶת הַיְּרֵחִים שֶׁל צֶדֶק. אוֹר הַשֶּׁמֶשׁ מֵאִיר עֲלֵיהֶם וְחוֹזֵר. לָכֵן הֵם מוּאָרִים.',
    ),
    sources: [{ page: 193 }, { page: 194 }],
  },
  {
    id: 'c-periodic',
    unit: 'u7',
    name: t('Periodic motion', 'תְּנוּעָה מַחֲזוֹרִית'),
    alt: t(
      'Periodic = the same motion repeats regularly, again and again, like a swing going back and forth.',
      'תְּנוּעָה מַחֲזוֹרִית חוֹזֶרֶת עַל עַצְמָהּ שׁוּב וָשׁוּב, כְּמוֹ נַדְנֵדָה.',
    ),
    altVisual: 'periodic',
    worked: t(
      'Example: A ball rolls down a hill and stops. Does the motion repeat? No — so it is not periodic.',
      'דּוּגְמָה: כַּדּוּר מִתְגַּלְגֵּל בִּירִידָה וְנֶעֱצָר. הַאִם הַתְּנוּעָה חוֹזֶרֶת? לֹא. לָכֵן הִיא לֹא מַחֲזוֹרִית.',
    ),
    sources: [{ page: 185 }, { page: 216, note: 'glossary 94' }],
  },
  {
    id: 'c-rot-orbit',
    unit: 'u7',
    name: t('Rotation and orbit', 'סִיבּוּב וְהַקָּפָה'),
    alt: t(
      'Rotation: spinning in place, like a spinning top (סְבִיבוֹן). Orbit: travelling around something, like running laps around a playground.',
      'סִיבּוּב: מִסְתּוֹבְבִים בַּמָּקוֹם, כְּמוֹ סְבִיבוֹן. הַקָּפָה: נָעִים מִסָּבִיב לְמַשֶּׁהוּ, כְּמוֹ רִיצָה סְבִיב מִגְרָשׁ.',
    ),
    altVisual: 'rotation-orbit',
    worked: t(
      'Example: The Moon travels around Earth. Spinning in place, or travelling around? Travelling around — so it is an orbit (הַקָּפָה).',
      'דּוּגְמָה: הַיָּרֵחַ נָע מִסָּבִיב לְכַדּוּר הָאָרֶץ. זֶה סִיבּוּב אוֹ הַקָּפָה? הוּא נָע מִסָּבִיב — לָכֵן זוֹ הַקָּפָה.',
    ),
    sources: [{ page: 185 }, { page: 189 }, { page: 190 }],
  },
];

export const CONCEPTS: Concept[] = [...BASE_CONCEPTS, ...MORE_CONCEPTS];

export const conceptById = (id: string): Concept => {
  const c = CONCEPTS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown concept ${id}`);
  return c;
};
