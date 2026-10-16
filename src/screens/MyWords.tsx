import { useState } from 'react';
import { glossaryById } from '../content/glossary';
import { WordCard } from '../components/WordCard';
import { useNiqqud } from '../components/Bi';
import { Speak } from '../components/Speak';
import { useStore } from '../progress/store';
import { buildVocabQuiz, meaningOf, recordVocab, removeWord, type VocabQuestion } from '../lib/words';
import { jerusalemDate } from '../lib/dates';
import { testAttr } from '../lib/testattr';

/** "My words": every word the learner saved, what it means, and a vocabulary quiz. */
export function MyWords({ onExit }: { onExit: () => void }) {
  const { progress, update } = useStore();
  const niqqud = useNiqqud();
  const [quiz, setQuiz] = useState<VocabQuestion[] | null>(null);
  const words = [...progress.words].reverse(); // newest first
  const explained = words.filter((w) => meaningOf(w)).length;

  if (quiz) return <VocabQuiz questions={quiz} onExit={() => setQuiz(null)} />;
  return (
    <div className="stack" data-testid="my-words">
      <div className="row">
        <button type="button" className="small ghost" onClick={onExit}>← Home · בַּיִת</button>
        <h2>📖 My words · הַמִּילִּים שֶׁלִּי</h2>
      </div>
      <p className="small-text">Every word you saved is here. Words from the space chapter are explained right away; for other words, Mum adds the meaning.</p>
      {explained > 0 && (
        <button type="button" className="primary" onClick={() => setQuiz(buildVocabQuiz(progress.words, niqqud))} data-testid="vocab-start">
          🚀 Word quiz · חִידוֹן מִילִּים ({Math.min(explained, 8)} questions)
        </button>
      )}
      {words.length === 0 && <p className="panel">No words yet. When you meet a word you don't understand, paste it in the 📝 bar at the top, or select it and tap “Save”.</p>}
      <ul className="stack" style={{ listStyle: 'none', padding: 0 }}>
        {words.map((w) => {
          const g = w.glossId ? glossaryById(w.glossId) : undefined;
          const remove = <button type="button" className="small ghost" onClick={() => update((p) => removeWord(p, w.id))} aria-label={`Remove ${w.text}`}>🗑️ Remove</button>;
          const score = w.quiz ? <span className="tag" dir="ltr">quiz ✓{w.quiz.right} ✗{w.quiz.wrong}</span> : null;
          return (
            <li key={w.id} data-testid="my-word" data-word={w.id}>
              {g ? (
                <WordCard entry={g}><div className="row">{score}{remove}</div></WordCard>
              ) : (
                <div className="panel stack">
                  <div className="row"><strong dir="auto">{w.text}</strong><Speak text={w.text} lang="he" />{score}</div>
                  {w.meaning ? <p dir="auto" data-testid="parent-meaning">✍️ {w.meaning}</p> : <p className="muted small-text">⏳ Waiting for Mum to explain it · מְחַכֶּה לְהֶסְבֵּר</p>}
                  <div className="row">{remove}</div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function VocabQuiz({ questions, onExit }: { questions: VocabQuestion[]; onExit: () => void }) {
  const { update } = useStore();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const q = questions[i];
  const choose = (c: number) => {
    if (picked !== null) return;
    setPicked(c);
    const ok = c === q.answer;
    if (ok) setRight(right + 1);
    const now = new Date();
    update((p) => recordVocab(p, q.wordId, ok, now, jerusalemDate(now)));
  };
  if (!q) {
    return (
      <section className="panel stack" data-testid="vocab-done">
        <h3>Word quiz done 🚀 · כׇּל הַכָּבוֹד!</h3>
        <p dir="ltr">{right} / {questions.length} right the first time. Words you missed come first next time.</p>
        <div className="row end"><button className="primary" onClick={onExit}>Back to My words →</button></div>
      </section>
    );
  }
  return (
    <section className="panel stack" data-testid="vocab-question">
      <div className="row">
        <button type="button" className="small ghost" onClick={onExit}>← My words</button>
        <span className="muted small-text" dir="ltr">{i + 1} / {questions.length}</span>
      </div>
      <h3 lang="he" dir="rtl">{q.kind === 'meaning' ? 'מָה פֵּירוּשׁ הַמִּילָּה?' : 'אֵיזוֹ מִילָּה מַתְאִימָה לַהֶסְבֵּר?'}</h3>
      <p className="vocab-prompt" dir="auto"><strong>{q.prompt}</strong> <Speak text={q.prompt} lang="he" /></p>
      <div className="stack">
        {q.choices.map((c, k) => (
          <button key={k} type="button" dir="auto" onClick={() => choose(k)} {...testAttr('ok', k === q.answer)}
            className={`choice ${picked === null ? '' : k === q.answer ? 'correct' : k === picked ? 'wrong' : ''}`}>
            {c}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className={`feedback ${picked === q.answer ? 'good' : 'help'}`} role="status">{picked === q.answer ? 'Right! ✓ · נָכוֹן!' : 'Not this time — the green one is right. You will see this word again.'}</p>
          <div className="row end"><button className="primary" onClick={() => { setI(i + 1); setPicked(null); }} data-testid="vocab-next">Next →</button></div>
        </>
      )}
    </section>
  );
}
