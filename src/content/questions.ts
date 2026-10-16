import { t } from '../lib/hebrew';
import type { Choice, Question, Tx } from './types';

// Questions are original, written to the textbook's terminology and depth (book question numbers noted
// where a question is modelled on one). Roles: warmup = nonblocking knowledge check; check = in-unit
// comprehension; review = later-day / look-back items with different wording.

const ch = (id: string, en: string, heN: string): Choice => ({ id, text: t(en, heN) });
const TRUE = (): Choice[] => [ch('true', 'True', 'נָכוֹן'), ch('false', 'Not true', 'לֹא נָכוֹן')];
export const TF_CHOICES = TRUE();
const hint = (en: string, heN: string): Tx => t(en, heN);

export const QUESTIONS: Question[] = [
  // ---------------- Unit 1: our place in the universe ----------------
  {
    kind: 'mc', id: 'u1-q1', unit: 'u1', concept: 'c-universe', role: 'warmup', difficulty: 1,
    prompt: t('What is the universe?', 'מָה הוּא הַיְקוּם?'),
    choices: [
      ch('a', 'Space and all the bodies in it', 'הֶחָלָל וְכָל הַגּוּפִים שֶׁבּוֹ'),
      ch('b', 'Only the stars', 'רַק הַכּוֹכָבִים'),
      ch('c', 'Only Earth and the Moon', 'רַק כַּדּוּר הָאָרֶץ וְהַיָּרֵחַ'),
    ],
    correct: 'a',
    hint: hint('Is space part of it too?', 'הַאִם גַּם הֶחָלָל חֵלֶק מֵהַיְקוּם?'),
    why: t('The universe = space + all the bodies in it.', 'הַיְקוּם = הֶחָלָל + כָּל הַגּוּפִים.'),
  },
  {
    kind: 'tf', id: 'u1-q2', unit: 'u1', concept: 'c-universe', role: 'check', difficulty: 2,
    prompt: t('True or not? "Space is a box inside the galaxy."', 'נָכוֹן אוֹ לֹא? "הֶחָלָל הוּא קוּפְסָה בְּתוֹךְ הַגָּלַקְסְיָה."'),
    simpler: t('Is space a box?', 'הַאִם הֶחָלָל הוּא קוּפְסָה?'),
    truth: false,
    fix: {
      prompt: t('So what is space?', 'אָז מָה הוּא חָלָל?'),
      choices: [
        ch('a', 'The almost empty room between the bodies', 'הַמָּקוֹם הָרֵיק כִּמְעַט בֵּין הַגּוּפִים'),
        ch('b', 'A kind of galaxy', 'סוּג שֶׁל גָּלַקְסְיָה'),
        ch('c', 'A planet', 'כּוֹכַב לֶכֶת'),
      ],
      correct: 'a',
    },
    hint: hint('Space is everywhere around the bodies, not inside one of them.', 'הֶחָלָל נִמְצָא מִסָּבִיב לַגּוּפִים.'),
    why: t('Space is the room between the bodies. It is not one more box.', 'חָלָל הוּא הַמָּקוֹם בֵּין הַגּוּפִים. הוּא לֹא עוֹד קוּפְסָה.'),
    visual: 'universe-zoom',
  },
  {
    kind: 'mc', id: 'u1-q3', unit: 'u1', concept: 'c-universe', role: 'check', difficulty: 1,
    prompt: t('The Sun, the Moon, Earth and the stars are examples of…', 'הַשֶּׁמֶשׁ, הַיָּרֵחַ, כַּדּוּר הָאָרֶץ וְהַכּוֹכָבִים הֵם דּוּגְמָאוֹת שֶׁל…'),
    simpler: t('The Sun and the Moon are…', 'הַשֶּׁמֶשׁ וְהַיָּרֵחַ הֵם…'),
    choices: [
      ch('a', 'bodies in space', 'גּוּפִים בֶּחָלָל'),
      ch('b', 'galaxies', 'גָּלַקְסְיוֹת'),
      ch('c', 'space', 'חָלָל'),
    ],
    correct: 'a',
    hint: hint('They are things that are in space — not the space itself.', 'אֵלֶּה דְּבָרִים שֶׁנִּמְצָאִים בֶּחָלָל.'),
    why: t('They are bodies (גּוּפִים). Space is the room around them. (Book p.173, q.2)', 'הֵם גּוּפִים. הֶחָלָל הוּא הַמָּקוֹם סְבִיבָם.'),
  },
  {
    kind: 'mc', id: 'u1-q4', unit: 'u1', concept: 'c-universe', role: 'review', difficulty: 2,
    prompt: t('Which word means "space and all the bodies in it"?', 'אֵיזוֹ מִלָּה פֵּירוּשָׁהּ "הֶחָלָל וְכָל הַגּוּפִים שֶׁבּוֹ"?'),
    choices: [ch('a', 'universe — יְקוּם', 'יְקוּם'), ch('b', 'space — חָלָל', 'חָלָל'), ch('c', 'Solar System', 'מַעֲרֶכֶת הַשֶּׁמֶשׁ')],
    correct: 'a',
    hint: hint('Which one includes everything?', 'אֵיזוֹ מִלָּה כּוֹלֶלֶת הַכֹּל?'),
    why: t('יְקוּם = space + all the bodies. חָלָל is only the room between them.', 'יְקוּם = חָלָל + גּוּפִים. חָלָל הוּא רַק הַמָּקוֹם בֵּינֵיהֶם.'),
  },
  {
    kind: 'tf', id: 'u1-q5', unit: 'u1', concept: 'c-universe', role: 'review', difficulty: 1,
    prompt: t('True or not? "The Moon is part of the universe."', 'נָכוֹן אוֹ לֹא? "הַיָּרֵחַ הוּא חֵלֶק מֵהַיְקוּם."'),
    truth: true,
    hint: hint('Everything that exists is in the universe.', 'כָּל מָה שֶׁקַּיָּים נִמְצָא בַּיְקוּם.'),
    why: t('Yes: the Moon is a body, and all bodies are part of the universe.', 'כֵּן. הַיָּרֵחַ הוּא גּוּף, וְכָל הַגּוּפִים הֵם חֵלֶק מֵהַיְקוּם.'),
  },
  {
    kind: 'mc', id: 'u1-q6', unit: 'u1', concept: 'c-nesting', role: 'warmup', difficulty: 1,
    prompt: t('Which is the biggest?', 'מָה הֲכִי גָּדוֹל?'),
    choices: [ch('a', 'The universe', 'הַיְקוּם'), ch('b', 'The Milky Way', 'שְׁבִיל הֶחָלָב'), ch('c', 'The Solar System', 'מַעֲרֶכֶת הַשֶּׁמֶשׁ')],
    correct: 'a',
    hint: hint('Which one contains all the others?', 'מָה מֵכִיל אֶת כָּל הַשְּׁאָר?'),
    why: t('The universe contains the Milky Way, which contains the Solar System.', 'הַיְקוּם מֵכִיל אֶת שְׁבִיל הֶחָלָב, וְהוּא מֵכִיל אֶת מַעֲרֶכֶת הַשֶּׁמֶשׁ.'),
  },
  {
    kind: 'tf', id: 'u1-q7', unit: 'u1', concept: 'c-nesting', role: 'check', difficulty: 2,
    prompt: t('True or not? "The Milky Way is inside the Solar System."', 'נָכוֹן אוֹ לֹא? "שְׁבִיל הֶחָלָב נִמְצָא בְּתוֹךְ מַעֲרֶכֶת הַשֶּׁמֶשׁ."'),
    simpler: t('Is the galaxy inside the Solar System?', 'הַאִם הַגָּלַקְסְיָה בְּתוֹךְ מַעֲרֶכֶת הַשֶּׁמֶשׁ?'),
    truth: false,
    fix: {
      prompt: t('What is correct?', 'מָה נָכוֹן?'),
      choices: [
        ch('a', 'The Solar System is inside the Milky Way', 'מַעֲרֶכֶת הַשֶּׁמֶשׁ נִמְצֵאת בְּתוֹךְ שְׁבִיל הֶחָלָב'),
        ch('b', 'They are the same thing', 'הֵם אוֹתוֹ דָּבָר'),
        ch('c', 'The Solar System is inside Earth', 'מַעֲרֶכֶת הַשֶּׁמֶשׁ נִמְצֵאת בְּתוֹךְ כַּדּוּר הָאָרֶץ'),
      ],
      correct: 'a',
    },
    hint: hint('A galaxy has billions of stars. The Solar System has one star.', 'בְּגָלַקְסְיָה יֵשׁ מִילְיַארְדֵי כּוֹכָבִים. בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ יֵשׁ כּוֹכָב אֶחָד.'),
    why: t('Not true: the Solar System is inside the Milky Way. (Book p.173, q.3)', 'לֹא נָכוֹן: מַעֲרֶכֶת הַשֶּׁמֶשׁ נִמְצֵאת בְּתוֹךְ שְׁבִיל הֶחָלָב.'),
    visual: 'universe-zoom',
  },
  {
    kind: 'tf', id: 'u1-q8', unit: 'u1', concept: 'c-nesting', role: 'check', difficulty: 2,
    prompt: t('True or not? "Earth is part of the Milky Way."', 'נָכוֹן אוֹ לֹא? "כַּדּוּר הָאָרֶץ הוּא חֵלֶק מִשְּׁבִיל הֶחָלָב."'),
    truth: true,
    hint: hint('Earth is in the Solar System. Where is the Solar System?', 'כַּדּוּר הָאָרֶץ בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ. אֵיפֹה מַעֲרֶכֶת הַשֶּׁמֶשׁ?'),
    why: t('True: Earth is in the Solar System, which is in the Milky Way.', 'נָכוֹן: כַּדּוּר הָאָרֶץ בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ, וְהִיא בִּשְׁבִיל הֶחָלָב.'),
  },
  {
    kind: 'match', id: 'u1-q9', unit: 'u1', concept: 'c-nesting', role: 'check', difficulty: 2,
    prompt: t('Match each word to its meaning.', 'הַתְאֵם כָּל מִלָּה לַפֵּירוּשׁ שֶׁלָּהּ.'),
    pairs: [
      { left: t('universe', 'יְקוּם'), right: t('space and all the bodies', 'הֶחָלָל וְכָל הַגּוּפִים') },
      { left: t('galaxy', 'גָּלַקְסְיָה'), right: t('a giant group of stars', 'קְבוּצָה עֲנָקִית שֶׁל כּוֹכָבִים') },
      { left: t('Solar System', 'מַעֲרֶכֶת הַשֶּׁמֶשׁ'), right: t('the Sun and what orbits it', 'הַשֶּׁמֶשׁ וּמָה שֶׁמַּקִּיף אוֹתָהּ') },
      { left: t('Earth', 'כַּדּוּר הָאָרֶץ'), right: t('our planet', 'כּוֹכַב הַלֶּכֶת שֶׁלָּנוּ') },
    ],
    hint: hint('Start with the one you are sure about.', 'הַתְחֵל בַּמִּלָּה שֶׁאַתָּה בָּטוּחַ בָּהּ.'),
    why: t('Universe ⊃ galaxy ⊃ Solar System ⊃ Earth.', 'יְקוּם ⊃ גָּלַקְסְיָה ⊃ מַעֲרֶכֶת הַשֶּׁמֶשׁ ⊃ כַּדּוּר הָאָרֶץ'),
  },
  {
    kind: 'mc', id: 'u1-q10', unit: 'u1', concept: 'c-nesting', role: 'review', difficulty: 2,
    prompt: t("Noa lives in Ramat Gan. In her address in space, what comes right after \"Earth\"?", 'נוֹעָה גָּרָה בְּרָמַת גַּן. בַּכְּתוֹבֶת שֶׁלָּהּ בַּיְקוּם, מָה בָּא אַחֲרֵי "כַּדּוּר הָאָרֶץ"?'),
    simpler: t('Earth is inside…?', 'כַּדּוּר הָאָרֶץ נִמְצָא בְּתוֹךְ…?'),
    choices: [ch('a', 'The Solar System', 'מַעֲרֶכֶת הַשֶּׁמֶשׁ'), ch('b', 'The Milky Way', 'שְׁבִיל הֶחָלָב'), ch('c', 'The universe', 'הַיְקוּם')],
    correct: 'a',
    hint: hint('Go one step bigger than Earth.', 'צְעַד אֶחָד יוֹתֵר גָּדוֹל מִכַּדּוּר הָאָרֶץ.'),
    why: t('Earth → Solar System → Milky Way → universe. (Book p.173, q.4)', 'כַּדּוּר הָאָרֶץ ← מַעֲרֶכֶת הַשֶּׁמֶשׁ ← שְׁבִיל הֶחָלָב ← הַיְקוּם'),
  },
  {
    kind: 'mc', id: 'u1-q11', unit: 'u1', concept: 'c-nesting', role: 'review', difficulty: 3,
    prompt: t('Which is NOT inside the Milky Way?', 'מָה לֹא נִמְצָא בְּתוֹךְ שְׁבִיל הֶחָלָב?'),
    choices: [ch('a', 'Another galaxy', 'גָּלַקְסְיָה אַחֶרֶת'), ch('b', 'The Sun', 'הַשֶּׁמֶשׁ'), ch('c', 'Earth', 'כַּדּוּר הָאָרֶץ')],
    correct: 'a',
    hint: hint('The Sun and Earth are in our Solar System. Is a whole galaxy inside our galaxy?', 'הַשֶּׁמֶשׁ וְכַדּוּר הָאָרֶץ בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ. הַאִם גָּלַקְסְיָה שְׁלֵמָה בְּתוֹךְ הַגָּלַקְסְיָה שֶׁלָּנוּ?'),
    why: t('Other galaxies are outside the Milky Way, elsewhere in the universe.', 'גָּלַקְסְיוֹת אֲחֵרוֹת נִמְצָאוֹת מִחוּץ לִשְׁבִיל הֶחָלָב.'),
  },

  // ---------------- Unit 2: star or planet ----------------
  {
    kind: 'mc', id: 'u2-q1', unit: 'u2', concept: 'c-star', role: 'warmup', difficulty: 1,
    prompt: t('Is the Sun a star or a planet?', 'הַשֶּׁמֶשׁ הִיא כּוֹכָב אוֹ כּוֹכַב לֶכֶת?'),
    choices: [ch('a', 'A star', 'כּוֹכָב'), ch('b', 'A planet', 'כּוֹכַב לֶכֶת'), ch('c', 'A moon', 'יָרֵחַ')],
    correct: 'a',
    hint: hint('Does the Sun make its own light?', 'הַאִם לַשֶּׁמֶשׁ יֵשׁ אוֹר מִשֶּׁלָּהּ?'),
    why: t('The Sun makes its own light and heat, so it is a star.', 'לַשֶּׁמֶשׁ יֵשׁ אוֹר וְחוֹם מִשֶּׁלָּהּ, לָכֵן הִיא כּוֹכָב.'),
  },
  {
    kind: 'mc', id: 'u2-q2', unit: 'u2', concept: 'c-star', role: 'check', difficulty: 1,
    prompt: t('What is a star?', 'מָה הוּא כּוֹכָב?'),
    simpler: t('A star — what is it?', 'כּוֹכָב — מָה זֶה?'),
    choices: [
      ch('a', 'A huge, hot ball of gas that makes light and heat', 'כַּדּוּר גַּז עֲנָק וְלוֹהֵט שֶׁמֵּפִיק אוֹר וְחוֹם'),
      ch('b', 'A body that orbits the Sun', 'גּוּף שֶׁמַּקִּיף אֶת הַשֶּׁמֶשׁ'),
      ch('c', 'A small rock in space', 'סֶלַע קָטָן בֶּחָלָל'),
    ],
    correct: 'a',
    hint: hint('Think of the Sun. What does it give us?', 'חֲשׁוֹב עַל הַשֶּׁמֶשׁ. מָה הִיא נוֹתֶנֶת לָנוּ?'),
    why: t('A star is a huge, hot ball of gas. It makes light and heat. (Book p.174)', 'כּוֹכָב הוּא כַּדּוּר גַּז עֲנָק וְלוֹהֵט. הוּא מֵפִיק אוֹר וְחוֹם.'),
  },
  {
    kind: 'tf', id: 'u2-q3', unit: 'u2', concept: 'c-star', role: 'check', difficulty: 2,
    prompt: t('True or not? "A star gets its light from the Sun."', 'נָכוֹן אוֹ לֹא? "כּוֹכָב מְקַבֵּל אֶת הָאוֹר שֶׁלּוֹ מֵהַשֶּׁמֶשׁ."'),
    simpler: t('Does a star need the Sun to shine?', 'הַאִם כּוֹכָב צָרִיךְ אֶת הַשֶּׁמֶשׁ כְּדֵי לְהָאִיר?'),
    truth: false,
    fix: {
      prompt: t("Where does a star's light come from?", 'מֵאֵיפֹה הָאוֹר שֶׁל כּוֹכָב?'),
      choices: [
        ch('a', 'It makes its own light', 'הוּא מֵפִיק אוֹר בְּעַצְמוֹ'),
        ch('b', 'From the Moon', 'מֵהַיָּרֵחַ'),
        ch('c', 'From Earth', 'מִכַּדּוּר הָאָרֶץ'),
      ],
      correct: 'a',
    },
    hint: hint('The Sun is itself a star. Where does the Sun get its light?', 'גַּם הַשֶּׁמֶשׁ הִיא כּוֹכָב. מֵאֵיפֹה הָאוֹר שֶׁלָּהּ?'),
    why: t('Not true: every star makes its own light — it is מֵאִיר.', 'לֹא נָכוֹן: כָּל כּוֹכָב מֵפִיק אוֹר בְּעַצְמוֹ. הוּא מֵאִיר.'),
  },
  {
    kind: 'mc', id: 'u2-q4', unit: 'u2', concept: 'c-star', role: 'review', difficulty: 2,
    prompt: t('Complete: "The Sun is a body that is ___."', 'הַשְׁלֵם: "הַשֶּׁמֶשׁ הִיא גּוּף ___."'),
    choices: [ch('a', 'מֵאִיר — gives off its own light', 'מֵאִיר'), ch('b', 'מוּאָר — is lit by something else', 'מוּאָר')],
    correct: 'a',
    hint: hint('Does anything shine on the Sun, or does the Sun shine by itself?', 'מִישֶׁהוּ מֵאִיר עַל הַשֶּׁמֶשׁ, אוֹ שֶׁהִיא מְאִירָה בְּעַצְמָהּ?'),
    why: t('The Sun is a גּוּף מֵאִיר: it makes its own light.', 'הַשֶּׁמֶשׁ הִיא גּוּף מֵאִיר. יֵשׁ לָהּ אוֹר מִשֶּׁלָּהּ.'),
  },
  {
    kind: 'tf', id: 'u2-q5', unit: 'u2', concept: 'c-star', role: 'review', difficulty: 2,
    prompt: t('True or not? "The North Star (Polaris) makes its own light."', 'נָכוֹן אוֹ לֹא? "כּוֹכַב הַצָּפוֹן מֵפִיק אוֹר בְּעַצְמוֹ."'),
    truth: true,
    hint: hint('Polaris is a star.', 'כּוֹכַב הַצָּפוֹן הוּא כּוֹכָב.'),
    why: t('True: Polaris is a star, so it makes its own light.', 'נָכוֹן: כּוֹכַב הַצָּפוֹן הוּא כּוֹכָב, לָכֵן הוּא מֵאִיר.'),
  },
  {
    kind: 'tf', id: 'u2-q6', unit: 'u2', concept: 'c-lit', role: 'warmup', difficulty: 1,
    prompt: t('True or not? "Planets make their own light."', 'נָכוֹן אוֹ לֹא? "כּוֹכְבֵי לֶכֶת מְפִיקִים אוֹר בְּעַצְמָם."'),
    truth: false,
    fix: {
      prompt: t('So why can we see planets?', 'אָז לָמָּה אֲנַחְנוּ רוֹאִים כּוֹכְבֵי לֶכֶת?'),
      choices: [
        ch('a', 'Sunlight shines on them', 'אוֹר הַשֶּׁמֶשׁ מֵאִיר עֲלֵיהֶם'),
        ch('b', 'They are on fire', 'הֵם בּוֹעֲרִים'),
        ch('c', 'They are made of light', 'הֵם עֲשׂוּיִים מֵאוֹר'),
      ],
      correct: 'a',
    },
    hint: hint('What would we see if the Sun went out?', 'מָה הָיִינוּ רוֹאִים אִם הַשֶּׁמֶשׁ הָיְתָה נִכְבֵּית?'),
    why: t('Not true: planets are lit by the Sun — they are מוּאָרִים.', 'לֹא נָכוֹן: כּוֹכְבֵי לֶכֶת מוּאָרִים עַל יְדֵי הַשֶּׁמֶשׁ.'),
  },
  {
    kind: 'mc', id: 'u2-q7', unit: 'u2', concept: 'c-lit', role: 'check', difficulty: 1,
    prompt: t('Complete: "Earth is a body that is ___."', 'הַשְׁלֵם: "כַּדּוּר הָאָרֶץ הוּא גּוּף ___."'),
    choices: [ch('a', 'מוּאָר — lit by the Sun', 'מוּאָר'), ch('b', 'מֵאִיר — makes its own light', 'מֵאִיר')],
    correct: 'a',
    hint: hint('Does Earth make light, or does the Sun shine on it?', 'כַּדּוּר הָאָרֶץ מֵפִיק אוֹר, אוֹ שֶׁהַשֶּׁמֶשׁ מְאִירָה עָלָיו?'),
    why: t('Earth is a planet: the Sun lights it, so it is מוּאָר.', 'כַּדּוּר הָאָרֶץ הוּא כּוֹכַב לֶכֶת. הַשֶּׁמֶשׁ מְאִירָה עָלָיו, לָכֵן הוּא מוּאָר.'),
  },
  {
    kind: 'mc', id: 'u2-q8', unit: 'u2', concept: 'c-lit', role: 'check', difficulty: 2, visual: 'star-planet-light',
    prompt: t('Look at the picture and turn the Sun off. What happens to the planet?', 'הִסְתַּכֵּל בַּתְּמוּנָה וְכַבֵּה אֶת הַשֶּׁמֶשׁ. מָה קוֹרֶה לְכוֹכַב הַלֶּכֶת?'),
    simpler: t('No Sun. What happens to the planet?', 'אֵין שֶׁמֶשׁ. מָה קוֹרֶה לְכוֹכַב הַלֶּכֶת?'),
    choices: [
      ch('a', 'It goes dark', 'הוּא נַעֲשֶׂה חָשׁוּךְ'),
      ch('b', 'It shines by itself', 'הוּא מֵאִיר בְּעַצְמוֹ'),
      ch('c', 'It turns into a star', 'הוּא הוֹפֵךְ לְכוֹכָב'),
    ],
    correct: 'a',
    hint: hint('Try the "Sun off" button in the picture.', 'נַסֵּה אֶת הַכַּפְתּוֹר "לְכַבּוֹת אֶת הַשֶּׁמֶשׁ".'),
    why: t('Without the Sun the planet has no light: it is lit, not a light source.', 'בְּלִי הַשֶּׁמֶשׁ אֵין לְכוֹכַב הַלֶּכֶת אוֹר. הוּא מוּאָר.'),
  },
  {
    kind: 'match', id: 'u2-q9', unit: 'u2', concept: 'c-lit', role: 'check', difficulty: 2,
    prompt: t('Match each word to its meaning.', 'הַתְאֵם כָּל מִלָּה לַפֵּירוּשׁ שֶׁלָּהּ.'),
    pairs: [
      { left: t('star', 'כּוֹכָב'), right: t('makes light and heat', 'מֵפִיק אוֹר וְחוֹם') },
      { left: t('planet', 'כּוֹכַב לֶכֶת'), right: t('orbits a star and is lit by it', 'מַקִּיף כּוֹכָב וּמוּאָר עַל יָדוֹ') },
      { left: t('gives off light', 'מֵאִיר'), right: t('has its own light', 'יֵשׁ לוֹ אוֹר מִשֶּׁלּוֹ') },
      { left: t('is lit', 'מוּאָר'), right: t('light from another body shines on it', 'אוֹר מִגּוּף אַחֵר מֵאִיר עָלָיו') },
    ],
    hint: hint('Start with מֵאִיר: who has its own light?', 'הַתְחֵל בְּ"מֵאִיר": לְמִי יֵשׁ אוֹר מִשֶּׁלּוֹ?'),
    why: t('Star = מֵאִיר. Planet = מוּאָר.', 'כּוֹכָב = מֵאִיר. כּוֹכַב לֶכֶת = מוּאָר.'),
  },
  {
    kind: 'mc', id: 'u2-q10', unit: 'u2', concept: 'c-lit', role: 'review', difficulty: 2,
    prompt: t('Jupiter looks bright in the night sky. Why?', 'צֶדֶק נִרְאֶה בָּהִיר בַּשָּׁמַיִם בַּלַּיְלָה. לָמָּה?'),
    choices: [
      ch('a', 'Sunlight shines on it', 'אוֹר הַשֶּׁמֶשׁ מֵאִיר עָלָיו'),
      ch('b', 'It is a star', 'הוּא כּוֹכָב'),
      ch('c', 'It makes its own light', 'הוּא מֵפִיק אוֹר בְּעַצְמוֹ'),
    ],
    correct: 'a',
    hint: hint('Jupiter is a planet.', 'צֶדֶק הוּא כּוֹכַב לֶכֶת.'),
    why: t('Jupiter is a planet, so it is lit by the Sun — מוּאָר.', 'צֶדֶק הוּא כּוֹכַב לֶכֶת, לָכֵן הוּא מוּאָר עַל יְדֵי הַשֶּׁמֶשׁ.'),
  },
  {
    kind: 'tf', id: 'u2-q11', unit: 'u2', concept: 'c-lit', role: 'review', difficulty: 1,
    prompt: t('True or not? "The word מוּאָר fits Mars."', 'נָכוֹן אוֹ לֹא? "הַמִּלָּה מוּאָר מַתְאִימָה לְמַאֲדִים."'),
    truth: true,
    hint: hint('Mars is a planet.', 'מַאֲדִים הוּא כּוֹכַב לֶכֶת.'),
    why: t('True: Mars is a planet, lit by the Sun.', 'נָכוֹן: מַאֲדִים הוּא כּוֹכַב לֶכֶת, וְהוּא מוּאָר.'),
  },
];

export const questionById = (id: string): Question => {
  const q = QUESTIONS.find((x) => x.id === id);
  if (!q) throw new Error(`Unknown question ${id}`);
  return q;
};
export const questionsFor = (unit: string, role?: Question['role']) => QUESTIONS.filter((q) => q.unit === unit && (!role || q.role === role));
