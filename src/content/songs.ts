// Memory rhymes (שירי זיכרון), one per unit. Written for this lab: they only repeat facts the unit
// already teaches from the book (pages in the unit's sources) — no new facts. `en` gives the meaning.

export interface MemorySong {
  lines: string[]; // vocalized Hebrew
  en: string;
}

export const SONGS: Record<string, MemorySong> = {
  u1: {
    lines: ['כַּדּוּר הָאָרֶץ — הַבַּיִת הַקָּטָן,', 'בְּמַעֲרֶכֶת הַשֶּׁמֶשׁ הוּא נִמְצָא כָּאן,', 'הַמַּעֲרֶכֶת — בְּתוֹךְ שְׁבִיל הֶחָלָב,', 'וְהַכֹּל בַּיְּקוּם, הַגָּדוֹל וְהָרָחָב!'],
    en: 'Earth is inside the Solar System, the Solar System is inside the Milky Way, and everything is in the huge universe.',
  },
  u2: {
    lines: ['כּוֹכָב — מֵאִיר, יֵשׁ לוֹ אוֹר מִשֶּׁלּוֹ,', 'כּוֹכַב לֶכֶת — מוּאָר, מִכּוֹכָב בָּא אוֹרוֹ.', 'הַשֶּׁמֶשׁ — כּוֹכָב לוֹהֵט וְגָדוֹל,', 'מֵאִירָה וּמְחַמֶּמֶת אֶת הַכֹּל!'],
    en: 'A star gives off its own light (מֵאִיר); a planet is lit by a star (מוּאָר). The Sun is a huge hot star.',
  },
  u3: {
    lines: ['חַמָּה, נוֹגַהּ, אֶרֶץ, מַאְדִּים —', 'אַרְבָּעָה קְטַנִּים וּקְרוֹבִים.', 'צֶדֶק, שַׁבְּתַאי, אוּרָנוּס, נֶפְּטוּן —', 'אַרְבָּעָה עֲנָקִים, וְזֶה הַסִּיּוּם!'],
    en: 'The planets in order from the Sun: Mercury, Venus, Earth, Mars (four small, close ones), then Jupiter, Saturn, Uranus, Neptune (four giants). In English: "My Very Educated Mother Just Served Us Noodles".',
  },
  u4: {
    lines: ['אַרְבָּעָה מִסֶּלַע — אַרְצִיִּים וּקְרוֹבִים,', 'אַרְבָּעָה מִגַּז — עֲנָקִים וּרְחוֹקִים,', 'וּפְלוּטוֹ הַקָּטָן, נַנָּסִי וְעָגוֹל,', 'מַקִּיף אֶת הַשֶּׁמֶשׁ — אֲבָל הוּא לֹא גָּדוֹל!'],
    en: 'Four rocky planets close to the Sun, four gas giants far away, and Pluto: a small, round dwarf planet that orbits the Sun.',
  },
  u10: {
    lines: ['פַּעַם בְּלִי טֶלֶסְקוֹפּ — עֵינַיִם וְדִמְיוֹן,', 'חִיבְּרוּ כּוֹכָבִים לָעֲגָלָה וּלְאוֹרְיוֹן.', 'כּוֹכַב הַצָּפוֹן — תָּמִיד בְּאוֹתוֹ מָקוֹם,', 'מַרְאֶה לַמְּטַיְּילִים: צָפוֹנָה הוֹלְכִים לְשָׁם!', 'גָּלִילֵאוֹ לָקַח טֶלֶסְקוֹפּ שֶׁל יַמָּאִים,', 'וְגִילָּה בַּשָּׁמַיִם דְּבָרִים חֲדָשִׁים!'],
    en: 'Long ago people used only their eyes and imagination to make constellations. The North Star stays in place and shows north. Galileo took the sailors\' telescope and discovered new things in the sky.',
  },
  u11: {
    lines: ['רָחוֹק מֵהַשֶּׁמֶשׁ — קַר יוֹתֵר,', 'וְגַם הַהַקָּפָה — אֲרוּכָּה יוֹתֵר!', 'רַק נוֹגַהּ, עִם עֲנָנִים סְמִיכִים,', 'חַם אֲפִילוּ מֵחַמָּה — וְזֶה יוֹצֵא דּוֹפֶן, חֲבֵרִים!'],
    en: 'Farther from the Sun: colder, and a longer orbit. Venus, with its thick clouds, is the exception: even hotter than Mercury.',
  },
  u5: {
    lines: ['בֵּין מַאְדִּים לְצֶדֶק — חֲגוֹרָה שֶׁל סְלָעִים,', 'לִפְנֶיהָ — פְּנִימִיִּים, אַחֲרֶיהָ — חִיצוֹנִיִּים!'],
    en: 'Between Mars and Jupiter is a belt of rocks (the asteroid belt). Before it: the inner planets; after it: the outer planets.',
  },
  u6: {
    lines: ['הַיָּרֵחַ מַקִּיף אֶת כַּדּוּר הָאָרֶץ סָבִיב,', 'אוֹר מִשֶּׁלּוֹ אֵין לוֹ — הַשֶּׁמֶשׁ מְאִירָה עָלָיו!', 'הוּא מוּאָר, לֹא מֵאִיר,', 'וְזֶה כְּדַאי לִזְכּוֹר וּלְהַסְבִּיר!'],
    en: 'The Moon orbits Earth. It has no light of its own — the Sun shines on it. It is lit (מוּאָר), not a light-giver (מֵאִיר).',
  },
  u7: {
    lines: ['סִיבּוּב — סְבִיב הַצִּיר, כְּמוֹ סְבִיבוֹן שֶׁל חֲנוּכָּה,', 'הַקָּפָה — סְבִיב הַשֶּׁמֶשׁ, דֶּרֶךְ אֲרוּכָּה!', 'שׁוּב וָשׁוּב, בְּלִי הַפְסָקָה —', 'תְּנוּעָה מַחְזוֹרִית, כְּמוֹ נַדְנֵדָה!'],
    en: 'Rotation: spinning on the axis, like a Hanukkah dreidel. Orbit: the long way around the Sun. Again and again: periodic motion, like a swing.',
  },
  u12: {
    lines: ['שָׁבִיט — קֶרַח וְאָבָק, עִם זָנָב זוֹהֵר,', 'מֶטֵאוֹר — "כּוֹכָב נוֹפֵל" שֶׁבָּאֲוִויר מֵאִיר,', 'מֶטֵאוֹרִיט — הִגִּיעַ עַד הָאֲדָמָה,', 'וְקוֹפֶּרְנִיקוּס: הַשֶּׁמֶשׁ בָּאֶמְצַע — זֹאת הַתְּשׁוּבָה!'],
    en: 'A comet: ice and dust with a glowing tail. A meteor: a "shooting star" glowing in the air. A meteorite: reached the ground. Copernicus: the Sun is in the middle.',
  },
  u8: {
    lines: ['כַּדּוּר הָאָרֶץ סְבִיב הַשֶּׁמֶשׁ — הַקָּפָה אַחַת:', 'עָבְרָה שָׁנָה — וְיוֹם הַהוּלֶּדֶת שׁוּב בָּא!', 'הַיָּרֵחַ סְבִיב כַּדּוּר הָאָרֶץ — בְּעֵרֶךְ חוֹדֶשׁ,', 'וְאַרְבַּע עוֹנוֹת — וְהַשָּׁנָה מִתְחַדֶּשֶׁת!'],
    en: 'One orbit of Earth around the Sun = a year (365¼ days) — your birthday comes again! The Moon around Earth ≈ a month. Four seasons, and a new year begins.',
  },
  u9: {
    lines: ['מַיִם נוֹזְלִיִּים, אֲוִויר עִם חַמְצָן,', 'לֹא חַם וְלֹא קַר — יֵשׁ חַיִּים כָּאן!', 'נוֹגַהּ — לוֹהֵט, מַאְדִּים — קָפוּא,', 'וְכַדּוּר הָאָרֶץ — בְּדִיּוּק בָּאֶמְצַע הוּא!'],
    en: 'Liquid water, air with oxygen, not too hot and not too cold — there is life here. Venus is burning hot, Mars is frozen, Earth is just in between.',
  },
  u13: {
    lines: ['בַּמִּזְרָח זוֹרַחַת, בַּמַּעֲרָב שׁוֹקַעַת,', 'אֲבָל הַשֶּׁמֶשׁ בִּכְלָל לֹא נוֹסַעַת!', 'כַּדּוּר הָאָרֶץ מִסְתּוֹבֵב עַל צִירוֹ —', 'יוֹם וְלַיְלָה: יְמָמָה, 24 שָׁעוֹת בְּסִיבּוּבוֹ!'],
    en: 'The Sun rises in the east and sets in the west — but it does not really travel! Earth spins on its axis: day and night, one יְמָמָה, 24 hours per spin.',
  },
};
