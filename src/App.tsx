import { StorageNotice } from './components/StorageNotice';
import { t } from './lib/hebrew';

const TITLE = t("Yahli's Space Lab", 'מַעְבֶּדֶת הֶחָלָל שֶׁל יַהֲלִי');

export function App() {
  return (
    <div className="app">
      {__APP_ENV__ === 'dev' && <div className="dev-badge">DEV — not Yahli's version</div>}
      <header className="top">
        <h1 lang="he" dir="rtl">{TITLE.heN}</h1>
        <p className="en" lang="en" dir="ltr">{TITLE.en}</p>
      </header>
      <StorageNotice />
      <main id="main" />
    </div>
  );
}
