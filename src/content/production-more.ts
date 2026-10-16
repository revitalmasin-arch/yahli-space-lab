import { t } from '../lib/hebrew';
import type { ProductionTask } from './types';

// Hebrew production for units 8–13. Say/paper tasks are never recorded or graded by the app.

export const MORE_PRODUCTION: ProductionTask[] = [
  // Unit 10: looking at the sky
  {
    kind: 'arrange', id: 'u10-p1', unit: 'u10', concept: 'c-sky-ancient', pattern: 'cause', role: 'unit',
    prompt: t('Put the words in order: "Sailors used the North Star because it shows north."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['מַלָּחִים', 'הִשְׁתַּמְּשׁוּ', 'בְּכוֹכַב הַצָּפוֹן', 'כִּי', 'הוּא', 'מַרְאֶה', 'אֶת הַצָּפוֹן'],
    meaningEn: 'Sailors used the North Star because it shows north.',
  },
  {
    kind: 'complete', id: 'u10-p2', unit: 'u10', concept: 'c-telescope', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'הַכְּלִי שֶׁעוֹזֵר לִרְאוֹת גּוּפִים רְחוֹקִים נִקְרָא',
    after: '.',
    answer: 'טֶלֶסְקוֹפּ',
    bank: ['טֶלֶסְקוֹפּ', 'מַדְחוֹם', 'מַצְפֵּן'],
    meaningEn: 'The tool that helps us see far-away bodies is called a telescope.',
  },
  {
    kind: 'say', id: 'u10-p3', unit: 'u10', concept: 'c-sky-ancient', pattern: 'cause', role: 'unit',
    prompt: t('Say in Hebrew: why did people long ago think the Sun goes around Earth?', 'אֱמוֹר בְּעִבְרִית: לָמָּה הַקַּדְמוֹנִים חָשְׁבוּ שֶׁהַשֶּׁמֶשׁ מַקִּיפָה אֶת כַּדּוּר הָאָרֶץ?'),
    requiredTerms: ['מִזְרָח', 'מַעֲרָב'],
    example: t('They saw the Sun move across the sky from east to west, so they thought it goes around Earth.', 'הֵם רָאוּ אֶת הַשֶּׁמֶשׁ זָזָה בַּשָּׁמַיִם מִמִּזְרָח לְמַעֲרָב, וְלָכֵן חָשְׁבוּ שֶׁהִיא מַקִּיפָה אֶת כַּדּוּר הָאָרֶץ.'),
    rubric: ['Mentions what they saw: the Sun moving from east to west', 'Gives the conclusion: Earth in the centre / the Sun goes around', 'Uses כִּי or לָכֵן'],
  },
  {
    kind: 'say', id: 'u10-p4', unit: 'u10', concept: 'c-sky-ancient', pattern: 'definition', role: 'review',
    prompt: t('Say in Hebrew: what is a constellation? Give an example.', 'אֱמוֹר בְּעִבְרִית: מָה הִיא קְבוּצַת כּוֹכָבִים? תֵּן דּוּגְמָה.'),
    requiredTerms: ['קְבוּצַת כּוֹכָבִים'],
    example: t('A constellation is a shape made by joining stars with imaginary lines. For example, the Big Dipper.', 'קְבוּצַת כּוֹכָבִים הִיא צוּרָה שֶׁיּוֹצְרִים כְּשֶׁמְּחַבְּרִים כּוֹכָבִים בְּקַוִּים דִּמְיוֹנִיִּים. לְמָשָׁל, הָעֲגָלָה הַגְּדוֹלָה.'),
    rubric: ['Stars joined by imaginary lines into a shape', 'A correct example (Big Dipper, Little Dipper, Cassiopeia, Orion)', 'Understandable Hebrew'],
  },
  // Unit 11: planet fact files and a model
  {
    kind: 'arrange', id: 'u11-p1', unit: 'u11', concept: 'c-planet-data', pattern: 'comparison', role: 'unit',
    prompt: t('Put the words in order: "The farther from the Sun, the lower the temperature."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['כְּכָל שֶׁמִּתְרַחֲקִים', 'מֵהַשֶּׁמֶשׁ', 'הַטֶּמְפֶּרָטוּרָה', 'יוֹרֶדֶת'],
    meaningEn: 'The farther from the Sun, the lower the temperature.',
  },
  {
    kind: 'complete', id: 'u11-p2', unit: 'u11', concept: 'c-orbit-time', pattern: 'cause', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'כְּכָל שֶׁמִּתְרַחֲקִים מֵהַשֶּׁמֶשׁ, זְמַן הַהַקָּפָה',
    after: '.',
    answer: 'גָּדֵל',
    bank: ['גָּדֵל', 'קָטֵן', 'נֶעֱלָם'],
    meaningEn: 'The farther from the Sun, the longer the orbit time.',
  },
  {
    kind: 'say', id: 'u11-p3', unit: 'u11', concept: 'c-orbit-time', pattern: 'cause', role: 'unit',
    prompt: t('Say in Hebrew: why does Neptune take so long to go around the Sun?', 'אֱמוֹר בְּעִבְרִית: לָמָּה לְנֶפְּטוּן לוֹקֵחַ הַרְבֵּה זְמַן לְהַקִּיף אֶת הַשֶּׁמֶשׁ?'),
    requiredTerms: ['רָחוֹק', 'מַסְלוּל'],
    example: t('Neptune is very far from the Sun, so its path around the Sun is longer.', 'נֶפְּטוּן רָחוֹק מְאוֹד מֵהַשֶּׁמֶשׁ, וְלָכֵן הַמַּסְלוּל שֶׁלּוֹ סְבִיב הַשֶּׁמֶשׁ אָרוֹךְ יוֹתֵר.'),
    rubric: ['Neptune is far from the Sun', 'So its path (orbit) is longer', 'Uses לָכֵן or כִּי'],
  },
  {
    kind: 'paper', id: 'u11-p4', unit: 'u11', concept: 'c-planet-data', pattern: 'comparison', role: 'review',
    prompt: t('Write on paper: compare Mercury and Neptune — distance from the Sun, temperature, orbit time. Show it to Mum.', 'כְּתוֹב עַל דַּף: הַשְׁוֵה בֵּין חַמָּה לְנֶפְּטוּן — מֶרְחָק, טֶמְפֶּרָטוּרָה, זְמַן הַקָּפָה.'),
    requiredTerms: ['קָרוֹב', 'רָחוֹק'],
    example: t('Mercury is close to the Sun, it is hot there and its orbit is short. Neptune is far, it is very cold and its orbit is very long.', 'חַמָּה קָרוֹב לַשֶּׁמֶשׁ, חַם בּוֹ וְזְמַן הַהַקָּפָה שֶׁלּוֹ קָצָר. נֶפְּטוּן רָחוֹק, קַר בּוֹ מְאוֹד וְזְמַן הַהַקָּפָה שֶׁלּוֹ אָרוֹךְ מְאוֹד.'),
    rubric: ['Distance: Mercury close, Neptune far', 'Temperature: hotter vs. much colder', 'Orbit time: short vs. long'],
  },
  // Unit 12: comets, meteors, two models
  {
    kind: 'arrange', id: 'u12-p1', unit: 'u12', concept: 'c-comet', pattern: 'definition', role: 'unit',
    prompt: t('Put the words in order: "A comet is made of ice and dust."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['שָׁבִיט', 'עָשׂוּי', 'מִקֶּרַח', 'וְאָבָק'],
    meaningEn: 'A comet is made of ice and dust.',
  },
  {
    kind: 'complete', id: 'u12-p2', unit: 'u12', concept: 'c-helio', pattern: 'location', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'בַּמּוֹדֶל שֶׁל קוֹפֶּרְנִיקוּס,',
    after: 'בַּמֶּרְכָּז.',
    answer: 'הַשֶּׁמֶשׁ',
    bank: ['הַשֶּׁמֶשׁ', 'כַּדּוּר הָאָרֶץ', 'הַיָּרֵחַ'],
    meaningEn: "In Copernicus's model, the Sun is in the centre.",
  },
  {
    kind: 'say', id: 'u12-p3', unit: 'u12', concept: 'c-helio', pattern: 'comparison', role: 'unit',
    prompt: t("Say in Hebrew: what is the difference between the ancient Greeks' model and Copernicus's model?", 'אֱמוֹר בְּעִבְרִית: מָה הַהֶבְדֵּל בֵּין הַמּוֹדֶל שֶׁל הַיְּווָנִים הַקַּדְמוֹנִים לַמּוֹדֶל שֶׁל קוֹפֶּרְנִיקוּס?'),
    requiredTerms: ['מֶרְכָּז', 'קוֹפֶּרְנִיקוּס'],
    example: t('According to the ancient Greeks, Earth is in the centre. According to Copernicus, the Sun is in the centre and Earth goes around it.', 'לְפִי הַיְּווָנִים הַקַּדְמוֹנִים, כַּדּוּר הָאָרֶץ בַּמֶּרְכָּז. לְפִי קוֹפֶּרְנִיקוּס, הַשֶּׁמֶשׁ בַּמֶּרְכָּז וְכַדּוּר הָאָרֶץ מַקִּיף אוֹתָהּ.'),
    rubric: ['Greeks: Earth in the centre', 'Copernicus: the Sun in the centre, Earth orbits it', 'The difference is what is in the centre (book p.182)'],
  },
  {
    kind: 'say', id: 'u12-p4', unit: 'u12', concept: 'c-meteor', pattern: 'comparison', role: 'review',
    prompt: t('Say in Hebrew: what is the difference between a meteor and a meteorite?', 'אֱמוֹר בְּעִבְרִית: מָה הַהֶבְדֵּל בֵּין מֶטֶאוֹר לְמֶטֶאוֹרִיט?'),
    requiredTerms: ['מֶטֶאוֹר', 'מֶטֶאוֹרִיט'],
    example: t('A meteor glows in the air — a shooting star. A meteorite is a rock from space that reached the ground.', 'מֶטֶאוֹר זוֹהֵר בָּאֲוִויר — כּוֹכָב נוֹפֵל. מֶטֶאוֹרִיט הוּא סֶלַע מֵהֶחָלָל שֶׁהִגִּיעַ לָאֲדָמָה.'),
    rubric: ['Meteor: glowing in the air ("shooting star")', 'Meteorite: reached the ground', 'Both terms used'],
  },
  // Unit 8: year, month and the calendar
  {
    kind: 'arrange', id: 'u8-p1', unit: 'u8', concept: 'c-year', pattern: 'duration', role: 'unit',
    prompt: t('Put the words in order: "Earth goes around the Sun once a year."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['כַּדּוּר הָאָרֶץ', 'מַקִּיף', 'אֶת הַשֶּׁמֶשׁ', 'פַּעַם אַחַת', 'בְּשָׁנָה'],
    meaningEn: 'Earth goes around the Sun once a year.',
  },
  {
    kind: 'complete', id: 'u8-p2', unit: 'u8', concept: 'c-calendar', pattern: 'duration', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'בְּלוּחַ הַשָּׁנָה הַכְּלָלִי יֵשׁ',
    after: 'חוֹדָשִׁים.',
    answer: '12',
    bank: ['12', '7', '24'],
    meaningEn: 'The general calendar has 12 months.',
  },
  {
    kind: 'say', id: 'u8-p3', unit: 'u8', concept: 'c-year', pattern: 'duration', role: 'unit',
    prompt: t('Say in Hebrew: what is a year, and how long is it?', 'אֱמוֹר בְּעִבְרִית: מָה הִיא שָׁנָה, וְכַמָּה זְמַן הִיא נִמְשֶׁכֶת?'),
    requiredTerms: ['שָׁנָה', 'מַקִּיף', '365'],
    example: t('A year is the time Earth takes to go around the Sun once — about 365 days.', 'שָׁנָה הִיא הַזְּמַן שֶׁבּוֹ כַּדּוּר הָאָרֶץ מַקִּיף אֶת הַשֶּׁמֶשׁ פַּעַם אַחַת — בְּעֵרֶךְ 365 יָמִים.'),
    rubric: ['One orbit of Earth around the Sun', 'About 365 (365¼) days', 'Uses מַקִּיף / הַקָּפָה, not סִיבּוּב'],
  },
  {
    kind: 'paper', id: 'u8-p4', unit: 'u8', concept: 'c-month', pattern: 'comparison', role: 'review',
    prompt: t('Write on paper: which motion gives us a year, and which gives us a month? Show it to Mum.', 'כְּתוֹב עַל דַּף: אֵיזוֹ תְּנוּעָה קוֹבַעַת שָׁנָה, וְאֵיזוֹ קוֹבַעַת חוֹדֶשׁ?'),
    requiredTerms: ['שָׁנָה', 'חוֹדֶשׁ'],
    example: t('Earth going around the Sun — a year. The Moon going around Earth — a month.', 'הַקָּפַת כַּדּוּר הָאָרֶץ סְבִיב הַשֶּׁמֶשׁ — שָׁנָה. הַקָּפַת הַיָּרֵחַ סְבִיב כַּדּוּר הָאָרֶץ — חוֹדֶשׁ.'),
    rubric: ['Year = Earth orbiting the Sun', 'Month = the Moon orbiting Earth', 'Not mixed up with rotation (a יְמָמָה)'],
  },
  // Unit 9: life on Earth
  {
    kind: 'arrange', id: 'u9-p1', unit: 'u9', concept: 'c-life', pattern: 'cause', role: 'unit',
    prompt: t('Put the words in order: "There is life on Earth because it has liquid water."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['יֵשׁ', 'חַיִּים', 'בְּכַדּוּר הָאָרֶץ', 'כִּי', 'יֵשׁ', 'בּוֹ', 'מַיִם נוֹזְלִיִּים'],
    meaningEn: 'There is life on Earth because it has liquid water.',
  },
  {
    kind: 'complete', id: 'u9-p2', unit: 'u9', concept: 'c-life', pattern: 'definition', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'בָּאֲוִויר שֶׁל כַּדּוּר הָאָרֶץ יֵשׁ',
    after: 'שֶׁאֲנַחְנוּ נוֹשְׁמִים.',
    answer: 'חַמְצָן',
    bank: ['חַמְצָן', 'מֶלַח', 'זָהָב'],
    meaningEn: "Earth's air has oxygen, which we breathe.",
  },
  {
    kind: 'say', id: 'u9-p3', unit: 'u9', concept: 'c-life', pattern: 'cause', role: 'unit',
    prompt: t('Say in Hebrew: what three things does Earth have that life needs?', 'אֱמוֹר בְּעִבְרִית: אֵילוּ שְׁלוֹשָׁה דְּבָרִים יֵשׁ בְּכַדּוּר הָאָרֶץ שֶׁחַיִּים צְרִיכִים?'),
    requiredTerms: ['מַיִם', 'טֶמְפֶּרָטוּרָה', 'חַמְצָן'],
    example: t('Earth has liquid water, a suitable temperature and air with oxygen.', 'בְּכַדּוּר הָאָרֶץ יֵשׁ מַיִם נוֹזְלִיִּים, טֶמְפֶּרָטוּרָה מַתְאִימָה וַאֲוִויר עִם חַמְצָן.'),
    rubric: ['Liquid water', 'Suitable temperature', 'Air with oxygen'],
  },
  {
    kind: 'paper', id: 'u9-p4', unit: 'u9', concept: 'c-life', pattern: 'cause', role: 'review',
    prompt: t('Write one sentence on paper: why is there no life on Venus? Show it to Mum.', 'כְּתוֹב מִשְׁפָּט אֶחָד עַל דַּף: לָמָּה אֵין חַיִּים בְּנוֹגַהּ?'),
    requiredTerms: ['חַם', 'מַיִם'],
    example: t('On Venus it is very hot, and there is no liquid water.', 'בְּנוֹגַהּ חַם מְאוֹד, וְאֵין בּוֹ מַיִם נוֹזְלִיִּים.'),
    rubric: ['Too hot (about 450°C)', 'No liquid water', 'Uses כִּי or a clear reason'],
  },
  // Unit 13: day and night, sunrise and sunset, time
  {
    kind: 'arrange', id: 'u13-p1', unit: 'u13', concept: 'c-sunpath', pattern: 'location', role: 'unit',
    prompt: t('Put the words in order: "The Sun rises in the east and sets in the west."', 'סַדֵּר אֶת הַמִּלִּים לְמִשְׁפָּט.'),
    words: ['הַשֶּׁמֶשׁ', 'זוֹרַחַת', 'בַּמִּזְרָח', 'וְשׁוֹקַעַת', 'בַּמַּעֲרָב'],
    meaningEn: 'The Sun rises in the east and sets in the west.',
  },
  {
    kind: 'complete', id: 'u13-p2', unit: 'u13', concept: 'c-time-units', pattern: 'duration', role: 'unit',
    prompt: t('Complete the sentence.', 'הַשְׁלֵם אֶת הַמִּשְׁפָּט.'),
    before: 'יְמָמָה הִיא יוֹם וְלַיְלָה, וְהִיא נִמְשֶׁכֶת',
    after: 'שָׁעוֹת.',
    answer: '24',
    bank: ['24', '12', '60'],
    meaningEn: 'A yemama is a day and a night, and it lasts 24 hours.',
  },
  {
    kind: 'say', id: 'u13-p3', unit: 'u13', concept: 'c-day', pattern: 'cause', role: 'unit',
    prompt: t('Say in Hebrew: why is there day and night?', 'אֱמוֹר בְּעִבְרִית: לָמָּה יֵשׁ יוֹם וְלַיְלָה?'),
    requiredTerms: ['מִסְתּוֹבֵב', 'צִיר'],
    example: t('There is day and night because Earth spins on its axis. The side facing the Sun is lit — day; the other side is dark — night.', 'יֵשׁ יוֹם וְלַיְלָה כִּי כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב סְבִיב צִירוֹ. הַצַּד שֶׁפּוֹנֶה לַשֶּׁמֶשׁ מוּאָר — יוֹם, וְהַצַּד הַשֵּׁנִי חָשׁוּךְ — לַיְלָה.'),
    rubric: ['Cause: Earth rotates on its axis (not the orbit)', 'The side facing the Sun is lit = day', 'Uses כִּי'],
  },
  {
    kind: 'say', id: 'u13-p4', unit: 'u13', concept: 'c-sunpath', pattern: 'cause', role: 'review',
    prompt: t('Say in Hebrew: why does the Sun seem to move from east to west?', 'אֱמוֹר בְּעִבְרִית: לָמָּה נִדְמֶה שֶׁהַשֶּׁמֶשׁ זָזָה מִמִּזְרָח לְמַעֲרָב?'),
    requiredTerms: ['מִסְתּוֹבֵב', 'מִזְרָח', 'מַעֲרָב'],
    example: t('Because Earth spins from west to east, so it seems that the Sun moves from east to west.', 'כִּי כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב מִמַּעֲרָב לְמִזְרָח, וְלָכֵן נִדְמֶה שֶׁהַשֶּׁמֶשׁ זָזָה מִמִּזְרָח לְמַעֲרָב.'),
    rubric: ['Earth spins west → east', 'So the Sun only seems to move east → west', 'Says the motion is apparent (נִדְמֶה)'],
  },
];
