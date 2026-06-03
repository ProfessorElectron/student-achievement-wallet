import {
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Page =
  | "landing"
  | "login"
  | "dashboard"
  | "achievements"
  | "certificates"
  | "verify";

type Achievement = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  score: string;
  claimed: boolean;
  txHash?: string;
};

type Theme = "light" | "dark";

const achievements: Achievement[] = [
  {
    id: "ach-001",
    title: "Hackathon Winner",
    issuer: "College Innovation Cell",
    date: "2026-05-30",
    category: "Innovation",
    score: "1st Place",
    claimed: false,
  },
  {
    id: "ach-002",
    title: "Smart Contract Bootcamp",
    issuer: "UGF Campus Guild",
    date: "2026-04-18",
    category: "Blockchain",
    score: "Completed",
    claimed: true,
    txHash: "0x9f42...81ac",
  },
  {
    id: "ach-003",
    title: "Dean's Merit Badge",
    issuer: "Department of Physics",
    date: "2026-03-12",
    category: "Academic",
    score: "Top 5%",
    claimed: true,
    txHash: "0x24ba...f03e",
  },
];

const navItems: Array<{ id: Page; label: string; icon: typeof LayoutDashboard }> =
  [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "certificates", label: "Certificates", icon: BadgeCheck },
    { id: "verify", label: "Verify", icon: ShieldCheck },
  ];


  
function App() {
  const [page, setPage] = useState<Page>("landing");
  const [walletConnected, setWalletConnected] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState("");
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("student-wallet-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const walletAddress = "0xA71C...92B4";

  const stats = useMemo(
    () => ({
      total: achievements.length,
      claimed: achievements.filter((achievement) => achievement.claimed).length,
      pending: achievements.filter((achievement) => !achievement.claimed).length,
    }),
    []
  );

  const goToApp = () => setPage("dashboard");

  useEffect(() => {
    localStorage.setItem("student-wallet-theme", theme);
  }, [theme]);

  return (
    <div className="app" data-theme={theme}>
      <Navbar
        currentPage={page}
        theme={theme}
        walletAddress={walletConnected ? walletAddress : undefined}
        onNavigate={setPage}
        onThemeToggle={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onWalletToggle={() => setWalletConnected((current) => !current)}
      />

      {page === "landing" ? (
        <LandingPage onStart={() => setPage("login")} onDemo={goToApp} />
      ) : page === "login" ? (
        <LoginPage onLogin={goToApp} />
      ) : (
        <main className="workspace">
          <Sidebar currentPage={page} onNavigate={setPage} />

          <section className="content">
            {page === "dashboard" && (
              <Dashboard
                achievements={achievements}
                stats={stats}
                walletConnected={walletConnected}
                onClaim={() => setPage("achievements")}
                onVerify={() => setPage("verify")}
              />
            )}
            {page === "achievements" && (
              <AchievementList
                achievements={achievements}
                walletConnected={walletConnected}
                onConnectWallet={() => setWalletConnected(true)}
              />
            )}
            {page === "certificates" && (
              <CertificateViewer achievements={achievements} />
            )}
            {page === "verify" && (
              <VerificationPage
                verifiedCode={verifiedCode}
                onChangeCode={setVerifiedCode}
              />
            )}
          </section>
        </main>
      )}
    </div>
  );
}

function Navbar({
  currentPage,
  theme,
  walletAddress,
  onNavigate,
  onThemeToggle,
  onWalletToggle,
}: {
  currentPage: Page;
  theme: Theme;
  walletAddress?: string;
  onNavigate: (page: Page) => void;
  onThemeToggle: () => void;
  onWalletToggle: () => void;
}) {
  const showWallet = currentPage !== "landing" && currentPage !== "login";

  return (
    <header className="navbar">
      <button className="brand" onClick={() => onNavigate("landing")}>
        <span className="brandMark">
          <GraduationCap size={22} />
        </span>
        <span>Student Achievement Wallet</span>
      </button>
      <div className="navActions">
        <button
          className="themeToggle"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {showWallet && (
          <button
            className={walletAddress ? "walletButton connected" : "walletButton"}
            onClick={onWalletToggle}
          >
            {walletAddress ? <X size={18} /> : <Wallet size={18} />}
            <span>{walletAddress ?? "Connect Wallet"}</span>
          </button>
        )}
      </div>
    </header>
  );
}

function LandingPage({
  onStart,
  onDemo,
}: {
  onStart: () => void;
  onDemo: () => void;
}) {

  return (
    <main className="landing">
      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow">Gasless NFT certificates for students</span>
          <h1>Student Achievement Wallet</h1>
          <p>
            A clean wallet experience where students claim verifiable
            achievement NFTs without needing crypto.
          </p>
          <div className="heroActions">
            <button className="primaryButton" onClick={onStart}>
              <LogIn size={18} />
              <span>Student Login</span>
            </button>
            <button className="secondaryButton" onClick={onDemo}>
              <Sparkles size={18} />
              <span>Open Demo</span>
            </button>
          </div>
        </div>

        <div className="certificatePreview" aria-label="Certificate preview">
          <div className="certificateTop">
            <span>Verified Certificate</span>
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="certLabel">Awarded to</p>
            <h2>Johnny Cage</h2>
            <p>Hackathon Winner</p>
          </div>
          <div className="certificateMeta">
            <span>Issuer: College</span>
            <span>NFT: Ready to claim</span>
          </div>
        </div>
      </section>
      <section className="signalBand">
        <Metric label="Student pays" value="0 gas" />
        <Metric label="Claim path" value="1 click" />
        <Metric label="Verifier result" value="Authentic" />
      </section>
    </main>
  );
}

function LoginPage({ onLogin }: { onLogin: () => void }) {

  return (
    <main className="loginPage">
      <section className="loginPanel">
        <div>
          <span className="eyebrow">Student access</span>
          <h1>Continue to your achievement dashboard</h1>
        </div>

        <label>
          Student ID
          <input type="text" value="SAW-2026-014" readOnly />
        </label>

        <label>
          Password
          <input type="password" value="demopass" readOnly />
        </label>

        <button className="primaryButton fullWidth" onClick={onLogin}>
          <LogIn size={18} />
          <span>Login</span>
        </button>
      </section>
    </main>
  );
}

function Sidebar({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}) {

  return (
    <aside className="sidebar">
      <div className="profileSection">
        <div className="avatar">AS</div>
        <div>
          <strong>Johnny Cage</strong>
          <span>Physics Student</span>
        </div>
      </div>
      <nav className="sideNav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={currentPage === item.id ? "active" : ""}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function Dashboard({
  achievements,
  stats,
  walletConnected,
  onClaim,
  onVerify,
}: {
  achievements: Achievement[];
  stats: { total: number; claimed: number; pending: number };
  walletConnected: boolean;
  onClaim: () => void;
  onVerify: () => void;
}) {
  const nextClaim = achievements.find((achievement) => !achievement.claimed);


  return (
    <>
      <div className="pageHeader">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Achievement wallet overview</h1>
        </div>
        <button className="secondaryButton" onClick={onVerify}>
          <Search size={18} />
          <span>Verify Certificate</span>
        </button>
      </div>
      <div className="statsGrid">
        <Metric label="Total achievements" value={String(stats.total)} />
        <Metric label="NFT certificates" value={String(stats.claimed)} />
        <Metric label="Ready to claim" value={String(stats.pending)} />
      </div>
      <section className="claimPanel">
        <div>
          <span className="eyebrow">Next claim</span>
          <h2>{nextClaim?.title ?? "All certificates claimed"}</h2>
          <p>
            {walletConnected
              ? "UGF sponsorship is ready for the student claim flow."
              : "Connect wallet to prepare the gasless claim flow."}
          </p>
        </div>
        <button className="primaryButton" onClick={onClaim}>
          <Award size={18} />
          <span>View Achievements</span>
        </button>
      </section>
      <section className="compactList">
        {achievements.slice(0, 3).map((achievement) => (
          <AchievementRow key={achievement.id} achievement={achievement} />
        ))}
      </section>
    </>
  );
}

function AchievementList({
  achievements,
  walletConnected,
  onConnectWallet,
}: {
  achievements: Achievement[];
  walletConnected: boolean;
  onConnectWallet: () => void;
}) {

  return (
    <>
      <div className="pageHeader">
        <div>
          <span className="eyebrow">Achievements</span>
          <h1>Claimable student records</h1>
        </div>
      </div>
      <div className="cardGrid">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            walletConnected={walletConnected}
            onConnectWallet={onConnectWallet}
          />
        ))}
      </div>
    </>
  );
}

function AchievementCard({
  achievement,
  walletConnected,
  onConnectWallet,
}: {
  achievement: Achievement;
  walletConnected: boolean;
  onConnectWallet: () => void;
}) {

  const canClaim = walletConnected && !achievement.claimed;

  return (
    <article className="achievementCard">
      <div className="cardIcon">
        <Award size={22} />
      </div>
      <span className={achievement.claimed ? "status claimed" : "status"}>
        {achievement.claimed ? "Claimed" : "Ready"}
      </span>
      <h2>{achievement.title}</h2>
      <p>{achievement.issuer}</p>
      <dl>
        <div>
          <dt>Date</dt>
          <dd>{achievement.date}</dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd>{achievement.score}</dd>
        </div>
      </dl>

      {achievement.claimed ? (
        <button className="secondaryButton cardButton">
          <CheckCircle2 size={18} />
          <span>{achievement.txHash}</span>
        </button>
      ) : canClaim ? (
        <button className="primaryButton cardButton">
          <Sparkles size={18} />
          <span>Claim NFT</span>
        </button>
      ) : (
        <button className="secondaryButton cardButton" onClick={onConnectWallet}>
          <Wallet size={18} />
          <span>Connect Wallet</span>
        </button>
      )}
    </article>
  );
}

function CertificateViewer({
  achievements,
}: {
  achievements: Achievement[];
}) {

  const claimed = achievements.filter((achievement) => achievement.claimed);

  return (
    <>
      <div className="pageHeader">
        <div>
          <span className="eyebrow">Certificates</span>
          <h1>NFT certificate viewer</h1>
        </div>
      </div>
      <div className="certificateGrid">
        {claimed.map((achievement) => (
          <article className="certificateCard" key={achievement.id}>
            <div className="certificateHeader">
              <BadgeCheck size={28} />
              <span>On-chain</span>
            </div>
            <p className="certLabel">Certificate</p>
            <h2>{achievement.title}</h2>
            <p>{achievement.issuer}</p>
            <div className="certificateFooter">
              <span>{achievement.date}</span>
              <span>{achievement.txHash}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function VerificationPage({
  verifiedCode,
  onChangeCode,
}: {
  verifiedCode: string;
  onChangeCode: (value: string) => void;
}) {

  const hasResult = verifiedCode.trim().length > 0;

  return (
    <>
      <div className="pageHeader">
        <div>
          <span className="eyebrow">Verifier</span>
          <h1>Check certificate authenticity</h1>
        </div>
      </div>
      <section className="verifyPanel">
        <label>
          Certificate ID or wallet address
          <input
            value={verifiedCode}
            onChange={(event) => onChangeCode(event.target.value)}
            placeholder="SAW-CERT-002 or 0x..."
          />
        </label>
        <div className={hasResult ? "verifyResult visible" : "verifyResult"}>
          <ShieldCheck size={32} />
          <div>
            <strong>Authentic certificate</strong>
            <span>Owned by 0xA71C...92B4 and issued by UGF Campus Guild.</span>
          </div>
        </div>
      </section>
    </>
  );
}

function AchievementRow({ achievement }: { achievement: Achievement }) {

  return (
    <div className="achievementRow">
      <div className="rowIcon">
        <BookOpen size={18} />
      </div>
      <div>
        <strong>{achievement.title}</strong>
        <span>{achievement.issuer}</span>
      </div>
      <ChevronRight size={18} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {

  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
