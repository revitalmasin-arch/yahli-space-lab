import { t } from '../lib/hebrew';
import type { Choice, Question, Tx } from './types';

// Coverage audit, 2026-10-17: details on pages 168–190 that were taught or shown but never asked.
// Every fact is from the book page named in `why`.

const ch = (id: string, en: string, heN: string, he?: string): Choice => ({ id, text: t(en, heN, he) });
const hint = (en: string, heN: string): Tx => t(en, heN);

export const EXTRA_QUESTIONS: Question[] = [
  // ---- u10: looking at the sky (pp.168–171)
  {
    kind: 'mc', id: 'u10-x1', unit: 'u10', concept: 'c-sky-ancient', role: 'check', difficulty: 1,
    prompt: t('What is a תַּצְפִּית (observation)?', 'מָה זֹאת תַּצְפִּית?'),
    choices: [ch('a', 'Looking carefully and collecting information', 'מִסְתַּכְּלִים בְּעִיּוּן וְאוֹסְפִים מֵידָע'), ch('b', 'Guessing without looking', 'מְנַחֲשִׁים בְּלִי לְהִסְתַּכֵּל'), ch('c', 'Drawing a picture from imagination', 'מְצַיְּירִים מֵהַדִּמְיוֹן')],
    correct: 'a',
    hint: hint('In the sky task you collect data about what you see.', 'בַּמְּשִׂימָה אוֹסְפִים נְתוּנִים עַל מָה שֶׁרוֹאִים.'),
    why: t('An observation collects data by looking — with the eyes, or with binoculars or a telescope. (Book p.170)', 'בְּתַצְפִּית אוֹסְפִים נְתוּנִים: בָּעֵינַיִם, אוֹ בְּמִשְׁקֶפֶת וּבְטֶלֶסְקוֹפּ.'),
  },
  {
    kind: 'mc', id: 'u10-x2', unit: 'u10', concept: 'c-telescope', role: 'review', difficulty: 2, visual: 'telescope',
    prompt: t('The telescope was invented in 1608. What was it first made for?', 'הַטֶּלֶסְקוֹפּ הוּמְצָא בִּשְׁנַת 1608. בִּשְׁבִיל מָה הוּא נוֹעַד בַּהַתְחָלָה?'),
    choices: [ch('a', 'So sailors could see far-away ships at sea', 'כְּדֵי שֶׁיּוֹרְדֵי יָם יִרְאוּ אוֹנִיּוֹת רְחוֹקוֹת'), ch('b', 'To look at planets', 'כְּדֵי לְהִסְתַּכֵּל עַל כּוֹכְבֵי לֶכֶת'), ch('c', 'To measure the time', 'כְּדֵי לִמְדּוֹד אֶת הַזְּמַן')],
    correct: 'a',
    hint: hint('Galileo found a NEW use for it: the sky. What was the first use?', 'גָּלִילֵאוֹ מָצָא לוֹ שִׁימּוּשׁ חָדָשׁ — הַשָּׁמַיִם. מָה הָיָה הַשִּׁימּוּשׁ הָרִאשׁוֹן?'),
    why: t('It was invented in Holland for sailors, to see ships far away. Galileo then used it to look at the sky. (Book pp.169, 171)', 'הִמְצִיאוּ אוֹתוֹ בְּהוֹלַנְד בִּשְׁבִיל יוֹרְדֵי יָם. אַחַר כָּךְ גָּלִילֵאוֹ הִסְתַּכֵּל בּוֹ בַּשָּׁמַיִם.'),
  },
  {
    kind: 'mc', id: 'u10-x3', unit: 'u10', concept: 'c-telescope', role: 'review', difficulty: 1,
    prompt: t('A special building with big telescopes is called…', 'בִּנְיָן מְיוּחָד עִם טֶלֶסְקוֹפִּים גְּדוֹלִים נִקְרָא…'),
    choices: [ch('a', 'an observatory (מִצְפֵּה כּוֹכָבִים)', 'מִצְפֵּה כּוֹכָבִים'), ch('b', 'a space station', 'תַּחֲנַת חָלָל'), ch('c', 'a planetarium shop', 'חֲנוּת כּוֹכָבִים')],
    correct: 'a',
    hint: hint('מִצְפֶּה — from the same root as תַּצְפִּית (watching).', 'מִצְפֶּה — מֵאוֹתוֹ שׁוֹרֶשׁ כְּמוֹ תַּצְפִּית.'),
    why: t('Modern telescopes are placed in special buildings called observatories. (Book p.171)', 'טֶלֶסְקוֹפִּים מוֹדֶרְנִיִּים נִמְצָאִים בְּמִצְפֵּה כּוֹכָבִים.'),
  },
  {
    kind: 'tf', id: 'u10-x4', unit: 'u10', concept: 'c-sky-ancient', role: 'review', difficulty: 2,
    prompt: t('True or not? Stonehenge in England is a very old site of huge stones that was probably used to watch the sky and follow the seasons.', 'נָכוֹן אוֹ לֹא? סְטוֹנְהֶנְג\' בְּאַנְגְּלִיָּה הוּא אֲתָר עַתִּיק שֶׁל אֲבָנִים עֲנָקִיּוֹת, שֶׁכְּנִרְאֶה שִׁימֵּשׁ לְתַצְפִּיּוֹת בַּשָּׁמַיִם וּלְמַעֲקָב אַחֲרֵי הָעוֹנוֹת.'),
    truth: true,
    hint: hint('Ancient people watched the sky without telescopes.', 'הַקַּדְמוֹנִים הִסְתַּכְּלוּ בַּשָּׁמַיִם בְּלִי טֶלֶסְקוֹפּ.'),
    why: t('True: about 4,500 years old, built so the longest summer day and the longest winter night could be found. (Book p.168)', 'נָכוֹן: בֶּן 4,500 שָׁנָה בְּעֵרֶךְ.'),
  },
  {
    kind: 'mc', id: 'u10-x5', unit: 'u10', concept: 'c-telescope', role: 'review', difficulty: 2,
    prompt: t('Why is it best to observe the night sky far from a town?', 'לָמָּה כְּדַאי לַעֲרוֹךְ תַּצְפִּית בַּלַּיְלָה רָחוֹק מֵהָעִיר?'),
    choices: [ch('a', 'Town lights make the stars hard to see', 'הָאוֹרוֹת שֶׁל הָעִיר מַפְרִיעִים לִרְאוֹת כּוֹכָבִים'), ch('b', 'There are more stars above the countryside', 'מֵעַל הַכְּפָר יֵשׁ יוֹתֵר כּוֹכָבִים'), ch('c', 'Towns are colder', 'בָּעִיר יוֹתֵר קַר')],
    correct: 'a',
    hint: hint('What is on in a town at night?', 'מָה דּוֹלֵק בָּעִיר בַּלַּיְלָה?'),
    why: t('The book says to pick a dark night, without clouds or a full Moon, away from town lights. (Book p.170)', 'בּוֹחֲרִים לַיְלָה חָשׁוּךְ, בְּלִי עֲנָנִים, רָחוֹק מֵהָאוֹרוֹת.'),
  },

  // ---- u4: dwarf planets (p.180)
  {
    kind: 'mc', id: 'u4-x1', unit: 'u4', concept: 'c-dwarf', role: 'review', difficulty: 2,
    prompt: t('Which of these is a dwarf planet?', 'מִי מֵאֵלֶּה הוּא כּוֹכַב לֶכֶת נַנָּסִי?'),
    choices: [ch('a', 'Eris', 'אֵרִיס'), ch('b', 'Mars', 'מַאְדִּים'), ch('c', 'Saturn', 'שַׁבְּתַאי')],
    correct: 'a',
    hint: hint('Mars and Saturn are among the 8 planets.', 'מַאְדִּים וְשַׁבְּתַאי הֵם מִתּוֹךְ 8 כּוֹכְבֵי הַלֶּכֶת.'),
    why: t('Dwarf planets in the book include Pluto, Eris and Ceres. (Book p.180)', 'כּוֹכְבֵי לֶכֶת נַנָּסִיִּים: פְּלוּטוֹ, אֵרִיס וְצֶרֶס.'),
  },

  // ---- u9: what Earth's air is made of (p.178)
  {
    kind: 'mc', id: 'u9-x1', unit: 'u9', concept: 'c-life', role: 'check', difficulty: 2, visual: 'life-compare',
    prompt: t('Which gas is there MOST of in Earth\'s air?', 'מֵאֵיזֶה גַּז יֵשׁ הֲכִי הַרְבֵּה בָּאֲוִויר שֶׁל כַּדּוּר הָאָרֶץ?'),
    choices: [ch('a', 'Nitrogen (about 78%)', 'חַנְקָן (בְּעֵרֶךְ 78%)'), ch('b', 'Oxygen (about 78%)', 'חַמְצָן (בְּעֵרֶךְ 78%)'), ch('c', 'Carbon dioxide (about 78%)', 'פַּחְמָן דּוּ-חַמְצָנִי (בְּעֵרֶךְ 78%)')],
    correct: 'a',
    hint: hint('Oxygen, which we breathe, is only about a fifth of the air.', 'חַמְצָן, שֶׁאוֹתוֹ נוֹשְׁמִים, הוּא רַק בְּעֵרֶךְ חֲמִישִׁית מֵהָאֲוִויר.'),
    why: t('Earth\'s air: about 78% nitrogen, 21% oxygen, 1% argon, 0.04% carbon dioxide. (Book p.178)', 'בָּאֲוִויר: 78% חַנְקָן, 21% חַמְצָן, וּמְעַט גַּזִּים אֲחֵרִים.'),
  },

  // ---- u7: the human orbit model (p.185)
  {
    kind: 'mc', id: 'u7-x1', unit: 'u7', concept: 'c-periodic', role: 'check', difficulty: 2, visual: 'rotation-orbit',
    prompt: t('In the book\'s model, one child is the Sun and one is Earth. Earth claps each time it gets back to the starting point. What does one clap show?', 'בַּדֶּגֶם, יֶלֶד אֶחָד הוּא הַשֶּׁמֶשׁ וְיֶלֶד אַחֵר הוּא כַּדּוּר הָאָרֶץ. כַּדּוּר הָאָרֶץ מוֹחֵא כַּף כְּשֶׁהוּא חוֹזֵר לִנְקוּדַת הַהַתְחָלָה. מָה מַרְאָה מְחִיאַת כַּף אַחַת?'),
    choices: [ch('a', 'One full orbit — one year', 'הַקָּפָה שְׁלֵמָה אַחַת — שָׁנָה'), ch('b', 'One spin — one day', 'סִיבּוּב אֶחָד — יְמָמָה'), ch('c', 'One month', 'חוֹדֶשׁ אֶחָד')],
    correct: 'a',
    hint: hint('Earth walks AROUND the Sun back to the same point.', 'כַּדּוּר הָאָרֶץ הוֹלֵךְ מִסָּבִיב לַשֶּׁמֶשׁ וְחוֹזֵר לְאוֹתָהּ נְקוּדָּה.'),
    why: t('An orbit ends when Earth gets back to the same point. One full orbit of the Sun is one year, and the orbits repeat again and again: periodic motion. (Book pp.185–186)', 'הַקָּפָה שְׁלֵמָה שֶׁל הַשֶּׁמֶשׁ הִיא שָׁנָה. הַהַקָּפוֹת חוֹזְרוֹת שׁוּב וָשׁוּב.'),
  },

  // ---- u8: what a calendar is for (p.184)
  {
    kind: 'mc', id: 'u8-x1', unit: 'u8', concept: 'c-calendar', role: 'check', difficulty: 1, visual: 'calendar',
    prompt: t('What is a calendar for?', 'בִּשְׁבִיל מָה צָרִיךְ לוּחַ שָׁנָה?'),
    choices: [ch('a', 'To plan things by time: holidays, birthdays, trips', 'כְּדֵי לְתַכְנֵן לְפִי זְמַן: חַגִּים, יְמֵי הוּלֶּדֶת, טִיּוּלִים'), ch('b', 'To see the stars', 'כְּדֵי לִרְאוֹת כּוֹכָבִים'), ch('c', 'To measure temperature', 'כְּדֵי לִמְדּוֹד טֶמְפֶּרָטוּרָה')],
    correct: 'a',
    hint: hint('When is your birthday? Where do you look?', 'מָתַי יוֹם הַהוּלֶּדֶת שֶׁלְּךָ? אֵיפֹה בּוֹדְקִים?'),
    why: t('Calendars help people organise and plan their activities by time. (Book p.184)', 'לוּחַ שָׁנָה עוֹזֵר לְתַכְנֵן וּלְאַרְגֵּן פְּעִילוּיוֹת לְפִי זְמַן.'),
  },

  // ---- u13: why day length changes (p.189)
  {
    kind: 'mc', id: 'u13-x1', unit: 'u13', concept: 'c-day', role: 'check', difficulty: 3, visual: 'seasons',
    prompt: t('Why are days long in summer and short in winter?', 'לָמָּה בַּקַּיִץ הַיּוֹם אָרוֹךְ וּבַחוֹרֶף הוּא קָצָר?'),
    choices: [ch('a', 'Earth\'s axis is tilted, so our half gets more sunlight in summer', 'הַצִּיר שֶׁל כַּדּוּר הָאָרֶץ נָטוּי, אָז בַּקַּיִץ הַחֵצִי שֶׁלָּנוּ מְקַבֵּל יוֹתֵר אוֹר'), ch('b', 'Earth spins faster in summer', 'בַּקַּיִץ כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב מַהֵר יוֹתֵר'), ch('c', 'The Sun makes more light in summer', 'בַּקַּיִץ הַשֶּׁמֶשׁ מְאִירָה יוֹתֵר')],
    correct: 'a',
    hint: hint('Try the seasons picture: watch the tilted axis in June and in December.', 'נַסֵּה אֶת הַתְּמוּנָה: הִסְתַּכֵּל עַל הַצִּיר הַנָּטוּי בְּיוּנִי וּבְדֶצֶמְבֶּר.'),
    why: t('Earth\'s axis is tilted compared with its path around the Sun. In summer our half faces the Sun more: long days. In winter it faces away: short days. A full day (יְמָמָה) is still always 24 hours. (Book p.189)', 'הַצִּיר נָטוּי. בַּקַּיִץ הַחֵצִי שֶׁלָּנוּ פּוֹנֶה יוֹתֵר לַשֶּׁמֶשׁ — יוֹם אָרוֹךְ. בַּחוֹרֶף — יוֹם קָצָר.'),
  },
  {
    kind: 'tf', id: 'u13-x2', unit: 'u13', concept: 'c-day', role: 'review', difficulty: 2, visual: 'seasons',
    prompt: t('True or not? In Israel the shortest day of the year is around 21 December, and the longest around 21 June.', 'נָכוֹן אוֹ לֹא? בְּיִשְׂרָאֵל הַיּוֹם הַקָּצָר בְּיוֹתֵר הוּא בְּעֵרֶךְ בְּ-21 בְּדֶצֶמְבֶּר, וְהָאָרוֹךְ בְּיוֹתֵר בְּ-21 בְּיוּנִי.'),
    truth: true,
    hint: hint('Which month is winter in Israel?', 'בְּאֵיזֶה חוֹדֶשׁ חוֹרֶף בְּיִשְׂרָאֵל?'),
    why: t('True: in the northern half of Earth, the shortest day is 21 December (Sun lowest in the sky) and the longest is 21 June (Sun highest). (Book p.189)', 'נָכוֹן: 21 בְּדֶצֶמְבֶּר — הַקָּצָר בְּיוֹתֵר. 21 בְּיוּנִי — הָאָרוֹךְ בְּיוֹתֵר.'),
  },
  {
    kind: 'mc', id: 'u13-x3', unit: 'u13', concept: 'c-day', role: 'review', difficulty: 2,
    prompt: t('In spring and autumn, day and night are…', 'בָּאָבִיב וּבַסְּתָיו, הַיּוֹם וְהַלַּיְלָה…'),
    choices: [ch('a', 'almost the same length', 'כִּמְעַט בְּאוֹתוֹ אוֹרֶךְ'), ch('b', 'day much longer', 'הַיּוֹם הַרְבֵּה יוֹתֵר אָרוֹךְ'), ch('c', 'night much longer', 'הַלַּיְלָה הַרְבֵּה יוֹתֵר אָרוֹךְ')],
    correct: 'a',
    hint: hint('Between summer (long days) and winter (long nights)…', 'בֵּין הַקַּיִץ (יוֹם אָרוֹךְ) לַחוֹרֶף (לַיְלָה אָרוֹךְ)…'),
    why: t('In spring and autumn each half of Earth gets about the same light, so day and night are almost equal. (Book p.189)', 'בָּאָבִיב וּבַסְּתָיו הַיּוֹם וְהַלַּיְלָה כִּמְעַט שָׁוִים.'),
  },
];
