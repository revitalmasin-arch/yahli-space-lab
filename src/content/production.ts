import { t } from '../lib/hebrew';
import type { ProductionTask } from './types';
import { MORE_PRODUCTION } from './production-more';

// Hebrew production: arrange (full word bank) → complete (small bank) → say aloud (no bank).
// Say/paper tasks are NOT recorded or graded by the app: the learner self-checks or waits for Mum.

const BASE_PRODUCTION: ProductionTask[] = [
  // Unit 1
  {
    kind: 'arrange', id: 'u1-p1', unit: 'u1', concept: 'c-nesting', pattern: 'location', role: 'unit',
    prompt: t('Put the words in order: "Earth is in the Solar System."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['כַּדּוּר הָאָרֶץ', 'נִמְצָא', 'בְּמַעֲרֶכֶת', 'הַשֶּׁמֶשׁ'],
    meaningEn: 'Earth is in the Solar System.',
  },
  {
    kind: 'complete', id: 'u1-p2', unit: 'u1', concept: 'c-universe', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'הַיְקוּם הוּא הֶחָלָל וְכָל',
    after: 'שֶׁבּוֹ.',
    answer: 'הַגּוּפִים',
    bank: ['הַגּוּפִים', 'הַשָּׁעוֹת', 'הַמִּלִּים'],
    meaningEn: 'The universe is space and all the bodies in it.',
  },
  {
    kind: 'say', id: 'u1-p3', unit: 'u1', concept: 'c-nesting', pattern: 'location', role: 'unit',
    prompt: t('Say in Hebrew, out loud: where is Earth? Try to use מַעֲרֶכֶת הַשֶּׁמֶשׁ and שְׁבִיל הֶחָלָב.', 'אֱמוֹר בְּעִבְרִית: אֵיפֹה נִמְצָא כַּדּוּר הָאָרֶץ?'),
    requiredTerms: ['מַעֲרֶכֶת הַשֶּׁמֶשׁ', 'שְׁבִיל הֶחָלָב'],
    example: t('Earth is in the Solar System, and the Solar System is in the Milky Way.', 'כַּדּוּר הָאָרֶץ נִמְצָא בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ, וּמַעֲרֶכֶת הַשֶּׁמֶשׁ נִמְצֵאת בִּשְׁבִיל הֶחָלָב.'),
    rubric: ['Names the Solar System as where Earth is', 'Places the Solar System inside the Milky Way (order correct)', 'Understandable Hebrew; grammar need not be perfect'],
  },
  {
    kind: 'say', id: 'u1-p4', unit: 'u1', concept: 'c-universe', pattern: 'definition', role: 'review',
    prompt: t('Say in Hebrew: what is space (חָלָל)?', 'אֱמוֹר בְּעִבְרִית: מָה הוּא חָלָל?'),
    requiredTerms: ['חָלָל'],
    example: t('Space is the almost empty room between the bodies.', 'חָלָל הוּא הַמָּקוֹם הָרֵיק בֵּין הַגּוּפִים.'),
    rubric: ['Says space is the (almost) empty room between bodies', 'Does not describe space as a box or a galaxy', 'Uses the word חָלָל'],
  },
  // Unit 2
  {
    kind: 'arrange', id: 'u2-p1', unit: 'u2', concept: 'c-lit', pattern: 'comparison', role: 'unit',
    prompt: t('Put the words in order: "The Sun gives off light, but Earth is lit."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['הַשֶּׁמֶשׁ', 'מְאִירָה', 'אֲבָל', 'כַּדּוּר הָאָרֶץ', 'מוּאָר'],
    meaningEn: 'The Sun gives off light, but Earth is lit.',
  },
  {
    kind: 'arrange', id: 'u2-p2', unit: 'u2', concept: 'c-lit', pattern: 'cause', role: 'unit',
    prompt: t('Put the words in order: "A planet is lit because a star shines on it."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['כּוֹכַב לֶכֶת', 'מוּאָר', 'כִּי', 'כּוֹכָב', 'מֵאִיר', 'עָלָיו'],
    meaningEn: 'A planet is lit because a star shines on it.',
  },
  {
    kind: 'complete', id: 'u2-p3', unit: 'u2', concept: 'c-star', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'הַשֶּׁמֶשׁ הִיא',
    after: '.',
    answer: 'כּוֹכָב',
    bank: ['כּוֹכָב', 'כּוֹכַב לֶכֶת', 'יָרֵחַ'],
    meaningEn: 'The Sun is a star.',
  },
  {
    kind: 'say', id: 'u2-p4', unit: 'u2', concept: 'c-star', pattern: 'comparison', role: 'unit',
    prompt: t('Say in Hebrew, out loud: what is the difference between a star and a planet?', 'אֱמוֹר בְּעִבְרִית: מָה הַהֶבְדֵּל בֵּין כּוֹכָב לְכוֹכַב לֶכֶת?'),
    requiredTerms: ['כּוֹכָב', 'כּוֹכַב לֶכֶת'],
    example: t('A star makes light and heat. A planet does not make light — it is lit by a star.', 'כּוֹכָב מֵפִיק אוֹר וְחוֹם. כּוֹכַב לֶכֶת לֹא מֵפִיק אוֹר — הוּא מוּאָר עַל יְדֵי כּוֹכָב.'),
    rubric: ['Star: makes its own light (מֵאִיר / מֵפִיק אוֹר)', 'Planet: does not make light, is lit by a star (מוּאָר)', 'Both terms used; grammar need not be perfect'],
  },
  {
    kind: 'paper', id: 'u2-p5', unit: 'u2', concept: 'c-lit', pattern: 'cause', role: 'review',
    prompt: t('Write one sentence on paper: why can we see Mars at night? Show it to Mum.', 'כְּתוֹב מִשְׁפָּט אֶחָד עַל דַּף: לָמָּה רוֹאִים אֶת מַאֲדִים בַּלַּיְלָה?'),
    requiredTerms: ['מוּאָר', 'אוֹר הַשֶּׁמֶשׁ'],
    example: t('We see Mars because sunlight shines on it.', 'רוֹאִים אֶת מַאֲדִים כִּי אוֹר הַשֶּׁמֶשׁ מֵאִיר עָלָיו.'),
    rubric: ['Gives the cause: sunlight shines on Mars (or: Mars is מוּאָר)', 'Does not say Mars makes its own light', 'One understandable sentence'],
  },
  // Unit 3
  {
    kind: 'arrange', id: 'u3-p1', unit: 'u3', concept: 'c-order', pattern: 'location', role: 'unit',
    prompt: t('Put the words in order: "Mars is between Earth and Jupiter."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['מַאֲדִים', 'נִמְצָא', 'בֵּין', 'כַּדּוּר הָאָרֶץ', 'לְצֶדֶק'],
    meaningEn: 'Mars is between Earth and Jupiter.',
  },
  {
    kind: 'complete', id: 'u3-p2', unit: 'u3', concept: 'c-order', pattern: 'location', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'חַמָּה הוּא כּוֹכַב הַלֶּכֶת',
    after: 'בְּיוֹתֵר לַשֶּׁמֶשׁ.',
    answer: 'הַקָּרוֹב',
    bank: ['הַקָּרוֹב', 'הָרָחוֹק', 'הַגָּדוֹל'],
    meaningEn: 'Mercury is the planet closest to the Sun.',
  },
  {
    kind: 'say', id: 'u3-p3', unit: 'u3', concept: 'c-order', pattern: 'location', role: 'unit',
    prompt: t('Say the eight planets in order in Hebrew, starting from the Sun.', 'אֱמוֹר אֶת שְׁמוֹנַת כּוֹכְבֵי הַלֶּכֶת לְפִי הַסֵּדֶר, מֵהַשֶּׁמֶשׁ.'),
    requiredTerms: ['חַמָּה', 'נֶפְּטוּן'],
    example: t('Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', 'חַמָּה, נוֹגַהּ, כַּדּוּר הָאָרֶץ, מַאֲדִים, צֶדֶק, שַׁבְּתַאי, אוּרָנוּס, נֶפְּטוּן.'),
    rubric: ['All eight Hebrew names', 'Correct order from the Sun (one swap = not yet)', 'Recognisable pronunciation'],
  },
  {
    kind: 'say', id: 'u3-p4', unit: 'u3', concept: 'c-order', pattern: 'location', role: 'review',
    prompt: t('Say in Hebrew: where is Earth in the order of the planets?', 'אֱמוֹר בְּעִבְרִית: אֵיפֹה כַּדּוּר הָאָרֶץ בְּסֵדֶר כּוֹכְבֵי הַלֶּכֶת?'),
    requiredTerms: ['שְׁלִישִׁי', 'נוֹגַהּ', 'מַאֲדִים'],
    example: t('Earth is the third planet from the Sun, between Venus and Mars.', 'כַּדּוּר הָאָרֶץ הוּא כּוֹכַב הַלֶּכֶת הַשְּׁלִישִׁי מֵהַשֶּׁמֶשׁ, בֵּין נוֹגַהּ לְמַאֲדִים.'),
    rubric: ['Says third (שלישי) from the Sun', 'Names Venus and Mars as neighbours', 'Understandable Hebrew'],
  },
  // Unit 4
  {
    kind: 'arrange', id: 'u4-p1', unit: 'u4', concept: 'c-groups', pattern: 'comparison', role: 'unit',
    prompt: t('Put the words in order: "Earth is made of rock, but Jupiter is made of gas."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['כַּדּוּר הָאָרֶץ', 'עָשׂוּי', 'מִסֶּלַע', 'אֲבָל', 'צֶדֶק', 'עָשׂוּי', 'מִגַּזִּים'],
    meaningEn: 'Earth is made of rock, but Jupiter is made of gas.',
  },
  {
    kind: 'complete', id: 'u4-p2', unit: 'u4', concept: 'c-dwarf', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'פְּלוּטוֹ הוּא כּוֹכַב לֶכֶת',
    after: '.',
    answer: 'נַנָּסִי',
    bank: ['נַנָּסִי', 'אַרְצִי', 'גָּדוֹל'],
    meaningEn: 'Pluto is a dwarf planet.',
  },
  {
    kind: 'say', id: 'u4-p3', unit: 'u4', concept: 'c-groups', pattern: 'comparison', role: 'unit',
    prompt: t('Say in Hebrew: what is the difference between rocky planets and gas giants?', 'אֱמוֹר בְּעִבְרִית: מָה הַהֶבְדֵּל בֵּין כּוֹכְבֵי לֶכֶת אַרְצִיִּים לְגַזִּים עֲנָקִיִּים?'),
    requiredTerms: ['אַרְצִיִּים', 'סֶלַע', 'גַּזִּים'],
    example: t('Rocky planets are made of rock. Gas giants are made mostly of gas and have no solid ground.', 'כּוֹכְבֵי לֶכֶת אַרְצִיִּים עֲשׂוּיִים מִסֶּלַע. גַּזִּים עֲנָקִיִּים עֲשׂוּיִים בְּעִיקָּר מִגַּזִּים, וְאֵין לָהֶם קַרְקַע מוּצֶקֶת.'),
    rubric: ['Rocky planets: made of rock / solid ground', 'Gas giants: made (mostly) of gas', 'Both group names used; grammar need not be perfect'],
  },
  {
    kind: 'say', id: 'u4-p4', unit: 'u4', concept: 'c-dwarf', pattern: 'definition', role: 'review',
    prompt: t('Say in Hebrew: what is a dwarf planet? Give one example.', 'אֱמוֹר בְּעִבְרִית: מָה הוּא כּוֹכַב לֶכֶת נַנָּסִי? תֵּן דּוּגְמָה.'),
    requiredTerms: ['נַנָּסִי', 'מַקִּיף'],
    example: t('A dwarf planet is a round body that orbits the Sun and is smaller than a planet. For example, Pluto.', 'כּוֹכַב לֶכֶת נַנָּסִי הוּא גּוּף עָגוֹל שֶׁמַּקִּיף אֶת הַשֶּׁמֶשׁ וְקָטָן מִכּוֹכַב לֶכֶת. לְמָשָׁל, פְּלוּטוֹ.'),
    rubric: ['Orbits the Sun', 'Smaller than a planet (round)', 'Gives Pluto or Ceres as an example'],
  },
  // Unit 5
  {
    kind: 'arrange', id: 'u5-p1', unit: 'u5', concept: 'c-belt', pattern: 'location', role: 'unit',
    prompt: t('Put the words in order: "The asteroid belt is between Mars and Jupiter."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['חֲגוֹרַת הָאַסְטֵרוֹאִידִים', 'נִמְצֵאת', 'בֵּין', 'מַאֲדִים', 'לְצֶדֶק'],
    meaningEn: 'The asteroid belt is between Mars and Jupiter.',
  },
  {
    kind: 'complete', id: 'u5-p2', unit: 'u5', concept: 'c-inner-outer', pattern: 'location', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'צֶדֶק הוּא כּוֹכַב לֶכֶת',
    after: '.',
    answer: 'חִיצוֹנִי',
    bank: ['חִיצוֹנִי', 'פְּנִימִי', 'נַנָּסִי'],
    meaningEn: 'Jupiter is an outer planet.',
  },
  {
    kind: 'say', id: 'u5-p3', unit: 'u5', concept: 'c-inner-outer', pattern: 'comparison', role: 'unit',
    prompt: t('Say in Hebrew: what is the difference between inner and outer planets?', 'אֱמוֹר בְּעִבְרִית: מָה הַהֶבְדֵּל בֵּין כּוֹכְבֵי לֶכֶת פְּנִימִיִּים לְחִיצוֹנִיִּים?'),
    requiredTerms: ['פְּנִימִיִּים', 'חִיצוֹנִיִּים', 'חֲגוֹרַת הָאַסְטֵרוֹאִידִים'],
    example: t('The inner planets are before the asteroid belt, close to the Sun. The outer planets are after it, far from the Sun.', 'כּוֹכְבֵי הַלֶּכֶת הַפְּנִימִיִּים נִמְצָאִים לִפְנֵי חֲגוֹרַת הָאַסְטֵרוֹאִידִים, קָרוֹב לַשֶּׁמֶשׁ. הַחִיצוֹנִיִּים נִמְצָאִים אַחֲרֶיהָ, רָחוֹק מֵהַשֶּׁמֶשׁ.'),
    rubric: ['Inner: before the belt / close to the Sun', 'Outer: after the belt / far from the Sun', 'Talks about position, not material'],
  },
  {
    kind: 'say', id: 'u5-p4', unit: 'u5', concept: 'c-belt', pattern: 'location', role: 'review',
    prompt: t('Say in Hebrew: where is the asteroid belt?', 'אֱמוֹר בְּעִבְרִית: אֵיפֹה נִמְצֵאת חֲגוֹרַת הָאַסְטֵרוֹאִידִים?'),
    requiredTerms: ['מַאֲדִים', 'צֶדֶק'],
    example: t('The asteroid belt is between Mars and Jupiter.', 'חֲגוֹרַת הָאַסְטֵרוֹאִידִים נִמְצֵאת בֵּין מַאֲדִים לְצֶדֶק.'),
    rubric: ['Between Mars and Jupiter (both named)', 'Uses בֵּין … לְ…', 'Understandable Hebrew'],
  },
  // Unit 6
  {
    kind: 'arrange', id: 'u6-p1', unit: 'u6', concept: 'c-moon-light', pattern: 'cause', role: 'unit',
    prompt: t('Put the words in order: "The Moon is lit because it reflects sunlight."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['הַיָּרֵחַ', 'מוּאָר', 'כִּי', 'הוּא', 'מַחֲזִיר', 'אֶת', 'אוֹר הַשֶּׁמֶשׁ'],
    meaningEn: 'The Moon is lit because it reflects sunlight.',
  },
  {
    kind: 'complete', id: 'u6-p2', unit: 'u6', concept: 'c-moon-satellite', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'הַיָּרֵחַ מַקִּיף אֶת',
    after: '.',
    answer: 'כַּדּוּר הָאָרֶץ',
    bank: ['כַּדּוּר הָאָרֶץ', 'מַאֲדִים', 'צֶדֶק'],
    meaningEn: 'The Moon orbits Earth.',
  },
  {
    kind: 'say', id: 'u6-p3', unit: 'u6', concept: 'c-moon-satellite', pattern: 'definition', role: 'unit',
    prompt: t('Say in Hebrew: what is a moon? Try to use לַוְיָן טִבְעִי.', 'אֱמוֹר בְּעִבְרִית: מָה הוּא יָרֵחַ?'),
    requiredTerms: ['יָרֵחַ', 'מַקִּיף'],
    example: t('A moon is a natural satellite — a natural body that orbits a planet.', 'יָרֵחַ הוּא לַוְיָן טִבְעִי — גּוּף טִבְעִי שֶׁמַּקִּיף כּוֹכַב לֶכֶת.', 'ירח הוא לוויין טבעי — גוף טבעי שמקיף כוכב לכת.'),
    rubric: ['Orbits a planet', 'Natural (not built by people) / satellite', 'Understandable Hebrew'],
  },
  {
    kind: 'paper', id: 'u6-p4', unit: 'u6', concept: 'c-moon-light', pattern: 'cause', role: 'review',
    prompt: t('Write one sentence on paper: is the Moon מֵאִיר or מוּאָר? Why? Show it to Mum.', 'כְּתוֹב מִשְׁפָּט עַל דַּף: הַיָּרֵחַ מֵאִיר אוֹ מוּאָר? לָמָּה?'),
    requiredTerms: ['מוּאָר', 'כִּי'],
    example: t('The Moon is lit, because sunlight hits it and comes back to us.', 'הַיָּרֵחַ מוּאָר, כִּי אוֹר הַשֶּׁמֶשׁ פּוֹגֵעַ בּוֹ וְחוֹזֵר אֵלֵינוּ.'),
    rubric: ['Chooses מוּאָר', 'Gives the reason: sunlight reflects off the Moon', 'Uses כִּי (because)'],
  },
  // Unit 7
  {
    kind: 'arrange', id: 'u7-p1', unit: 'u7', concept: 'c-rot-orbit', pattern: 'comparison', role: 'unit',
    prompt: t('Put the words in order: "Earth rotates around its axis and orbits the Sun."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['כַּדּוּר הָאָרֶץ', 'מִסְתּוֹבֵב', 'סְבִיב', 'צִירוֹ', 'וּמַקִּיף', 'אֶת', 'הַשֶּׁמֶשׁ'],
    meaningEn: 'Earth rotates around its axis and orbits the Sun.',
  },
  {
    kind: 'complete', id: 'u7-p2', unit: 'u7', concept: 'c-periodic', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'תְּנוּעָה שֶׁחוֹזֶרֶת עַל עַצְמָהּ בְּאוֹפֶן קָבוּעַ נִקְרֵאת תְּנוּעָה',
    after: '.',
    answer: 'מַחֲזוֹרִית',
    bank: ['מַחֲזוֹרִית', 'מְהִירָה', 'אִיטִּית'],
    meaningEn: 'Motion that repeats itself regularly is called periodic motion.',
  },
  {
    kind: 'say', id: 'u7-p3', unit: 'u7', concept: 'c-rot-orbit', pattern: 'comparison', role: 'unit',
    prompt: t('Say in Hebrew: what is the difference between rotation (סִיבּוּב) and orbit (הַקָּפָה)?', 'אֱמוֹר בְּעִבְרִית: מָה הַהֶבְדֵּל בֵּין סִיבּוּב לְהַקָּפָה?'),
    requiredTerms: ['סִיבּוּב', 'הַקָּפָה', 'צִיר'],
    example: t('Rotation: Earth spins around its axis. Orbit: Earth travels around the Sun.', 'סִיבּוּב — כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב סְבִיב צִירוֹ. הַקָּפָה — כַּדּוּר הָאָרֶץ נָע מִסָּבִיב לַשֶּׁמֶשׁ.'),
    rubric: ['Rotation = spinning on its own axis', 'Orbit = travelling around the Sun (another body)', 'Does not say "orbits itself"'],
  },
  {
    kind: 'say', id: 'u7-p4', unit: 'u7', concept: 'c-periodic', pattern: 'cause', role: 'review',
    prompt: t('Say in Hebrew: give one example of periodic motion and say why it is periodic.', 'אֱמוֹר בְּעִבְרִית: תֵּן דּוּגְמָה לִתְנוּעָה מַחֲזוֹרִית, וְהַסְבֵּר לָמָּה.'),
    requiredTerms: ['מַחֲזוֹרִית', 'חוֹזֶרֶת'],
    example: t('A swing is periodic motion, because it repeats again and again.', 'נַדְנֵדָה הִיא תְּנוּעָה מַחֲזוֹרִית, כִּי הִיא חוֹזֶרֶת עַל עַצְמָהּ שׁוּב וָשׁוּב.'),
    rubric: ['A correct example (swing, pendulum, waves, Earth orbiting the Sun…)', 'Reason: it repeats regularly', 'Uses כִּי (because)'],
  },
];

export const PRODUCTION: ProductionTask[] = [...BASE_PRODUCTION, ...MORE_PRODUCTION];

export const productionFor = (unit: string, role?: ProductionTask['role']) => PRODUCTION.filter((p) => p.unit === unit && (!role || p.role === role));
export const productionById = (id: string) => PRODUCTION.find((p) => p.id === id);
