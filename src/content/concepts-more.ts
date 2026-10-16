import { t } from '../lib/hebrew';
import type { Concept } from './types';

// Concepts added to cover the textbook pages 168–190 in depth (parent requirement, 2026-10-16).
// Facts: book pages are cited in `sources`; facts from outside the book cite NASA in the note.
// Analogies ("like a map", "like a campfire") are teaching wording, not facts.

const NASA = 'NASA Solar System Exploration (science.nasa.gov)';

export const MORE_CONCEPTS: Concept[] = [
  // ---- u10: looking at the sky (pp.168–171)
  {
    id: 'c-sky-ancient', unit: 'u10',
    name: t('Reading the sky long ago', 'קְבוּצוֹת כּוֹכָבִים וְכוֹכַב הַצָּפוֹן'),
    alt: t(
      'Imagine connect-the-dots in the sky: people drew imaginary lines between stars to make shapes. One special star, the North Star, always shows the way north.',
      'בְּעָבָר חִיבְּרוּ כּוֹכָבִים בְּקַוִּים דִּמְיוֹנִיִּים לְצוּרוֹת. כּוֹכַב הַצָּפוֹן מַרְאֶה תָּמִיד אֶת הַצָּפוֹן.',
    ),
    altVisual: 'sky',
    worked: t(
      'Example: A sailor at night wants to go north. He finds the North Star and sails towards it.',
      'דּוּגְמָה: מַלָּח בַּלַּיְלָה רוֹצֶה לְהַפְלִיג צָפוֹנָה. הוּא מוֹצֵא אֶת כּוֹכַב הַצָּפוֹן וּמַפְלִיג לְכִיווּנוֹ.',
    ),
    sources: [{ page: 168 }, { page: 170 }],
  },
  {
    id: 'c-telescope', unit: 'u10',
    name: t('Telescopes', 'טֶלֶסְקוֹפּ'),
    alt: t(
      'A telescope is like super-eyes: far-away things look closer and clearer.',
      'טֶלֶסְקוֹפּ הוּא כְּמוֹ עֵינַיִם חֲזָקוֹת: דְּבָרִים רְחוֹקִים נִרְאִים קְרוֹבִים וּבְרוּרִים.',
    ),
    altVisual: 'telescope',
    worked: t(
      'Example: With the eyes alone, Jupiter looks like a bright dot. Through his telescope Galileo saw small moons next to it.',
      'דּוּגְמָה: בָּעֵינַיִם צֶדֶק נִרְאֶה כְּמוֹ נְקוּדָּה מְאִירָה. בְּטֶלֶסְקוֹפּ גָּלִילֵאוֹ רָאָה לְיָדוֹ יְרֵחִים קְטַנִּים.',
    ),
    sources: [{ page: 169 }, { page: 170 }, { page: 171 }, { page: 0, note: `${NASA}: Galileo discovered Jupiter's four largest moons in 1610` }],
  },
  {
    id: 'c-sci-question', unit: 'u10',
    name: t('Scientific questions', 'שְׁאֵלוֹת מַדָּעִיּוֹת'),
    alt: t(
      'A scientific question can be answered by observing, measuring or experimenting. A question about opinions or what we like cannot.',
      'שְׁאֵלָה מַדָּעִית — אֶפְשָׁר לִבְדּוֹק אוֹתָהּ בְּתַצְפִּית אוֹ בְּנִיסּוּי. שְׁאֵלָה שֶׁל דֵּעָה — אִי אֶפְשָׁר.',
    ),
    altVisual: 'telescope',
    worked: t(
      'Example: "How many stars can I see tonight?" — I can count them, so it is a scientific question. "Which star is the prettiest?" is an opinion.',
      'דּוּגְמָה: "כַּמָּה כּוֹכָבִים אֲנִי רוֹאֶה הַלַּיְלָה?" — אֶפְשָׁר לִסְפּוֹר, לָכֵן זוֹ שְׁאֵלָה מַדָּעִית.',
    ),
    sources: [{ page: 171 }],
  },
  // ---- u11: planet fact files and a model (pp.176–180)
  {
    id: 'c-planet-data', unit: 'u11',
    name: t('Distance and temperature', 'מֶרְחָק וְטֶמְפֶּרָטוּרָה'),
    alt: t(
      'Like a campfire: the closer you sit, the warmer you are. Planets close to the Sun are hot; far planets are freezing.',
      'כְּמוֹ מְדוּרָה: קָרוֹב — חַם, רָחוֹק — קַר. כּוֹכְבֵי לֶכֶת קְרוֹבִים לַשֶּׁמֶשׁ חַמִּים, וּרְחוֹקִים קָרִים מְאוֹד.',
    ),
    altVisual: 'planet-table',
    worked: t(
      'Example: Jupiter is farther from the Sun than Mars. So Jupiter is colder: about −150°C at the top of its atmosphere.',
      'דּוּגְמָה: צֶדֶק רָחוֹק יוֹתֵר מֵהַשֶּׁמֶשׁ מִמַּאֲדִים. לָכֵן קַר בּוֹ יוֹתֵר — בְּעֵרֶךְ 150 מַעֲלוֹת מִתַּחַת לָאֶפֶס.',
    ),
    sources: [{ page: 178 }, { page: 179 }, { page: 180 }, { page: 0, note: `${NASA}: Venus is the hottest planet because its thick carbon-dioxide atmosphere traps heat` }],
  },
  {
    id: 'c-orbit-time', unit: 'u11',
    name: t('Distance and orbit time', 'מֶרְחָק וּזְמַן הַקָּפָה'),
    alt: t(
      'Running around a small track takes less time than around a big one. Far planets have a much bigger path around the Sun.',
      'רִיצָה סְבִיב מַסְלוּל קָטָן קְצָרָה יוֹתֵר מֵרִיצָה סְבִיב מַסְלוּל גָּדוֹל. לְכוֹכְבֵי לֶכֶת רְחוֹקִים יֵשׁ מַסְלוּל גָּדוֹל יוֹתֵר.',
    ),
    altVisual: 'planet-table',
    worked: t(
      'Example: Saturn is farther from the Sun than Jupiter. Jupiter takes about 12 years to orbit the Sun; Saturn takes about 29½ years.',
      'דּוּגְמָה: שַׁבְּתַאי רָחוֹק יוֹתֵר מִצֶּדֶק. צֶדֶק מַקִּיף אֶת הַשֶּׁמֶשׁ בְּעֵרֶךְ 12 שָׁנִים, וְשַׁבְּתַאי בְּעֵרֶךְ 29 וָחֵצִי שָׁנִים.',
    ),
    sources: [{ page: 178 }, { page: 179 }, { page: 180 }, { page: 0, note: `${NASA} (Kepler's laws): planets farther from the Sun also move more slowly` }],
  },
  {
    id: 'c-model', unit: 'u11',
    name: t('A model of the Solar System', 'דֶּגֶם שֶׁל מַעֲרֶכֶת הַשֶּׁמֶשׁ'),
    alt: t(
      'A model is like a map: it shows the important parts in the right order, but much smaller — not to scale.',
      'דֶּגֶם הוּא כְּמוֹ מַפָּה: הוּא מַרְאֶה אֶת הַחֲלָקִים הַחֲשׁוּבִים בַּסֵּדֶר הַנָּכוֹן, אֲבָל קָטָן הַרְבֵּה יוֹתֵר.',
    ),
    altVisual: 'solar-order',
    worked: t(
      'Example: In a classroom model, Jupiter is a big ball and Mercury a tiny bead, each in its place in the order. The real distances would never fit in the room, so the model is not to scale.',
      'דּוּגְמָה: בְּדֶגֶם בַּכִּיתָּה צֶדֶק הוּא כַּדּוּר גָּדוֹל וְחַמָּה חָרוּז קָטָן. הַמֶּרְחַקִּים הָאֲמִיתִּיִּים לֹא נִכְנָסִים לַחֶדֶר.',
    ),
    sources: [{ page: 176 }, { page: 177 }, { page: 182 }],
  },
  // ---- u12: comets, meteors and two models (pp.175, 181, 182)
  {
    id: 'c-comet', unit: 'u12',
    name: t('Comets', 'שְׁבִיטִים'),
    alt: t(
      'A comet is like a giant dirty snowball. When it comes near the Sun, it forms a long, glowing tail.',
      'שָׁבִיט הוּא כְּמוֹ כַּדּוּר שֶׁלֶג עֲנָקִי וּמְלוּכְלָךְ. כְּשֶׁהוּא מִתְקָרֵב לַשֶּׁמֶשׁ, נוֹצָר לוֹ זָנָב אָרוֹךְ וְזוֹהֵר.',
    ),
    altVisual: 'comet',
    worked: t(
      'Example: A body of ice and dust with a long glowing tail appears in the sky. It is not a star and not a planet: it is a comet.',
      'דּוּגְמָה: בַּשָּׁמַיִם נִרְאֶה גּוּף מִקֶּרַח וְאָבָק עִם זָנָב אָרוֹךְ וְזוֹהֵר. הוּא לֹא כּוֹכָב וְלֹא כּוֹכַב לֶכֶת — הוּא שָׁבִיט.',
    ),
    sources: [{ page: 175 }, { page: 181 }, { page: 0, note: `${NASA}: comets are "cosmic snowballs" of frozen gases, rock and dust` }],
  },
  {
    id: 'c-meteor', unit: 'u12',
    name: t('Meteors and meteorites', 'מֶטֶאוֹרִים וּמֶטֶאוֹרִיטִים'),
    alt: t(
      'A rock from space has different names by where it is: while it glows in the air it is a meteor — a "shooting star". If it lands on the ground, it is a meteorite.',
      'סֶלַע מֵהֶחָלָל: כְּשֶׁהוּא זוֹהֵר בָּאֲוִויר — מֶטֶאוֹר ("כּוֹכָב נוֹפֵל"). כְּשֶׁהוּא מַגִּיעַ לָאֲדָמָה — מֶטֶאוֹרִיט.',
    ),
    altVisual: 'comet',
    worked: t(
      'Example: At night you see a bright streak of light that disappears. It is not a star — it is a meteor, a small rock heating up and glowing in the air.',
      'דּוּגְמָה: בַּלַּיְלָה רוֹאִים פַּס אוֹר שֶׁנֶּעֱלָם. זֶה לֹא כּוֹכָב — זֶה מֶטֶאוֹר, סֶלַע קָטָן שֶׁמִּתְחַמֵּם וְזוֹהֵר בָּאֲוִויר.',
    ),
    sources: [{ page: 181 }],
  },
  {
    id: 'c-helio', unit: 'u12',
    name: t('Earth-centred and Sun-centred models', 'הַמּוֹדֶל הַגֵּאוֹצֶנְטְרִי וְהַהֶלְיוֹצֶנְטְרִי'),
    alt: t(
      'In the old model, everything circles Earth. In Copernicus\'s model, Earth is just one of the planets circling the Sun.',
      'בַּמּוֹדֶל הַיָּשָׁן הַכֹּל מַקִּיף אֶת כַּדּוּר הָאָרֶץ. בַּמּוֹדֶל שֶׁל קוֹפֶּרְנִיקוּס כַּדּוּר הָאָרֶץ הוּא כּוֹכַב לֶכֶת אֶחָד שֶׁמַּקִּיף אֶת הַשֶּׁמֶשׁ.',
    ),
    altVisual: 'models',
    worked: t(
      '"The Sun goes around Earth" — which model? Earth is in the centre, so it is the old Earth-centred (geocentric) model.',
      'דּוּגְמָה: "הַשֶּׁמֶשׁ מַקִּיפָה אֶת כַּדּוּר הָאָרֶץ" — אֵיזֶה מוֹדֶל? כַּדּוּר הָאָרֶץ בַּמֶּרְכָּז, לָכֵן זֶה הַמּוֹדֶל הַגֵּאוֹצֶנְטְרִי.',
    ),
    sources: [{ page: 168 }, { page: 181 }, { page: 182 }],
  },
  // ---- u8: year, month, calendar (pp.184–187, 192–194)
  {
    id: 'c-year', unit: 'u8',
    name: t('A year', 'שָׁנָה'),
    alt: t(
      'Every time Earth completes one lap around the Sun, one year passes — about 365¼ days. The four seasons going by show us that a year has passed.',
      'כָּל פַּעַם שֶׁכַּדּוּר הָאָרֶץ מַשְׁלִים הַקָּפָה אַחַת סְבִיב הַשֶּׁמֶשׁ, עוֹבֶרֶת שָׁנָה. אַרְבַּע הָעוֹנוֹת מַרְאוֹת לָנוּ שֶׁעָבְרָה שָׁנָה.',
    ),
    altVisual: 'rotation-orbit',
    worked: t(
      'Example: A child is 10 years old. How many times has Earth gone around the Sun since they were born? One orbit = one year, so about 10 times.',
      'דּוּגְמָה: יֶלֶד בֶּן 10. כַּמָּה פְּעָמִים כַּדּוּר הָאָרֶץ הִקִּיף אֶת הַשֶּׁמֶשׁ מֵאָז שֶׁנּוֹלַד? הַקָּפָה אַחַת = שָׁנָה אַחַת. לָכֵן בְּעֵרֶךְ 10 פְּעָמִים.',
    ),
    sources: [{ page: 185 }, { page: 186 }, { page: 187 }],
  },
  {
    id: 'c-month', unit: 'u8',
    name: t('A month', 'חוֹדֶשׁ'),
    alt: t(
      'The Moon takes about a month (about 29½ days) to go once around Earth. From one full moon to the next is also about a month.',
      'הַיָּרֵחַ מַקִּיף אֶת כַּדּוּר הָאָרֶץ בְּעֵרֶךְ חוֹדֶשׁ — בְּעֵרֶךְ 29 וָחֵצִי יָמִים.',
    ),
    altVisual: 'moon-orbit',
    worked: t(
      'Example: There is a full moon tonight. When will the next full moon be? After the Moon goes around Earth once more — about a month later.',
      'דּוּגְמָה: הַלַּיְלָה יֵשׁ יָרֵחַ מָלֵא. מָתַי יִהְיֶה שׁוּב יָרֵחַ מָלֵא? בְּעוֹד בְּעֵרֶךְ חוֹדֶשׁ.',
    ),
    sources: [{ page: 193 }, { page: 194 }, { page: 215 }],
  },
  {
    id: 'c-calendar', unit: 'u8',
    name: t('The calendar', 'לוּחַ הַשָּׁנָה'),
    alt: t(
      'A calendar is like a map of time: each page is a month, each row a week, each square a day.',
      'לוּחַ שָׁנָה הוּא כְּמוֹ מַפָּה שֶׁל זְמַן: כָּל עַמּוּד — חוֹדֶשׁ, כָּל שׁוּרָה — שָׁבוּעַ, כָּל מִשְׁבֶּצֶת — יוֹם.',
    ),
    altVisual: 'calendar',
    worked: t(
      'Example: How many days are there in April? In the general calendar, April has 30 days.',
      'דּוּגְמָה: כַּמָּה יָמִים יֵשׁ בְּאַפְּרִיל? בְּלוּחַ הַשָּׁנָה הַכְּלָלִי — 30.',
    ),
    sources: [{ page: 184 }, { page: 187 }],
  },
  // ---- u9: life on Earth (pp.173, 178–179)
  {
    id: 'c-life', unit: 'u9',
    name: t('What life needs', 'מָה צָרִיךְ כְּדֵי שֶׁיִּהְיוּ חַיִּים'),
    alt: t(
      'Life needs three things we have on Earth: liquid water, a suitable temperature (not too hot, not too cold), and air with oxygen.',
      'חַיִּים צְרִיכִים: מַיִם נוֹזְלִיִּים, טֶמְפֶּרָטוּרָה מַתְאִימָה, וַאֲוִויר עִם חַמְצָן. בְּכַדּוּר הָאָרֶץ יֵשׁ אֶת כּוּלָּם.',
    ),
    altVisual: 'life-compare',
    worked: t(
      'Example: Could we live on Venus? It is about 450°C there — much too hot — and there is no liquid water. So no.',
      'דּוּגְמָה: אֶפְשָׁר לִחְיוֹת עַל נוֹגַהּ? חַם שָׁם מְאוֹד — בְּעֵרֶךְ 450 מַעֲלוֹת — וְאֵין מַיִם נוֹזְלִיִּים. לָכֵן לֹא.',
    ),
    sources: [{ page: 173 }, { page: 178 }, { page: 179 }],
  },
  // ---- u13: day and night, sunrise and sunset, time (pp.188–190)
  {
    id: 'c-day', unit: 'u13',
    name: t('Day and night', 'יוֹם וְלַיְלָה'),
    alt: t(
      'A lamp shines on a ball and you turn the ball slowly. The lit half is day; the dark half is night. One full turn = one יְמָמָה (24 hours).',
      'מְנוֹרָה מְאִירָה עַל כַּדּוּר וּמְסוֹבְבִים אוֹתוֹ. הַצַּד הַמּוּאָר — יוֹם. הַצַּד הֶחָשׁוּךְ — לַיְלָה. סִיבּוּב שָׁלֵם אֶחָד — יְמָמָה.',
    ),
    altVisual: 'day-night',
    worked: t(
      'Example: It is night in Israel. Why? Israel is on the side of Earth turned away from the Sun. As Earth keeps spinning, Israel turns back toward the Sun — morning.',
      'דּוּגְמָה: עַכְשָׁיו לַיְלָה בְּיִשְׂרָאֵל. לָמָּה? יִשְׂרָאֵל בַּצַּד שֶׁל כַּדּוּר הָאָרֶץ שֶׁלֹּא פּוֹנֶה לַשֶּׁמֶשׁ. כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב, וּבַבּוֹקֶר יִשְׂרָאֵל שׁוּב פּוֹנָה לַשֶּׁמֶשׁ.',
    ),
    sources: [{ page: 188 }, { page: 189 }],
  },
  {
    id: 'c-sunpath', unit: 'u13',
    name: t('Sunrise, sunset and the Sun\'s path', 'זְרִיחָה, שְׁקִיעָה וְהַתְּנוּעָה הַמְּדוּמָּה'),
    alt: t(
      'Spin on a chair and the room seems to move past you the other way. Earth spins west to east, so the Sun only seems to move east to west.',
      'כְּשֶׁמִּסְתּוֹבְבִים עַל כִּיסֵּא, נִדְמֶה שֶׁהַחֶדֶר זָז לַצַּד הַשֵּׁנִי. כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב מִמַּעֲרָב לְמִזְרָח, וְלָכֵן נִדְמֶה שֶׁהַשֶּׁמֶשׁ זָזָה מִמִּזְרָח לְמַעֲרָב.',
    ),
    altVisual: 'sun-path',
    worked: t(
      'Example: Where is the Sun in the evening? It seems to have moved to the west — where it sets (מַעֲרָב, עֶרֶב, שְׁקִיעָה).',
      'דּוּגְמָה: אֵיפֹה הַשֶּׁמֶשׁ בָּעֶרֶב? נִדְמֶה שֶׁהִיא זָזָה לַמַּעֲרָב — שָׁם הִיא שׁוֹקַעַת.',
    ),
    sources: [{ page: 168 }, { page: 188 }, { page: 189 }, { page: 190 }],
  },
  {
    id: 'c-time-units', unit: 'u13',
    name: t('Hours, minutes, seconds', 'שָׁעָה, דַּקָּה, שְׁנִיָּה'),
    alt: t(
      'Cut a יְמָמָה into 24 equal parts — each part is an hour. Cut an hour into 60 — a minute. Cut a minute into 60 — a second.',
      'חוֹתְכִים יְמָמָה לְ-24 חֲלָקִים — כָּל חֵלֶק הוּא שָׁעָה. שָׁעָה לְ-60 — דַּקָּה. דַּקָּה לְ-60 — שְׁנִיָּה.',
    ),
    altVisual: 'clock',
    worked: t(
      'Example: One day there were 10 hours of daylight. How many hours of darkness? A יְמָמָה is 24 hours, so 24 − 10 = 14 hours.',
      'דּוּגְמָה: בְּיוֹם אֶחָד הָיוּ 10 שְׁעוֹת אוֹר. כַּמָּה שְׁעוֹת חוֹשֶׁךְ? יְמָמָה הִיא 24 שָׁעוֹת, לָכֵן 24 פָּחוֹת 10 = 14.',
    ),
    sources: [{ page: 189 }, { page: 190 }],
  },
];
