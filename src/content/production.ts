import { t } from '../lib/hebrew';
import type { ProductionTask } from './types';

// Hebrew production: arrange (full word bank) → complete (small bank) → say aloud (no bank).
// Say/paper tasks are NOT recorded or graded by the app: the learner self-checks or waits for Mum.

export const PRODUCTION: ProductionTask[] = [
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
];

export const productionFor = (unit: string, role?: ProductionTask['role']) => PRODUCTION.filter((p) => p.unit === unit && (!role || p.role === role));
export const productionById = (id: string) => PRODUCTION.find((p) => p.id === id);
