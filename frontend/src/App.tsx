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
  | "signup"
  | "dashboard"
  | "achievements"
  | "certificates"
  | "verify";

type Achievement = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  category: string;
  score: string;
  claimed: boolean;
  txHash?: string;
  tx_Hash?: string;
  token_id?: string | null;
  certificate?: string;
  certificate_code?: string;
};

type Theme = "light" | "dark";
type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
};
type WalletState = {
  balance: number;
  wallet_address?: string;
};
type EthereumProvider = {
  request: (request: { method: string; params?: unknown[] }) => Promise<string[]>;
};

const API_BASE_URL = "http://127.0.0.1:8000";

const getCertificateUrl = (path: string) => {
  if (!path) return "";
  return `${API_BASE_URL}${path}`;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
export {};

const navItems: Array<{ id: Page; label: string; icon: typeof LayoutDashboard }> =
  [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "certificates", label: "Certificates", icon: BadgeCheck },
    { id: "verify", label: "Verify", icon: ShieldCheck },
  ];


  
function App() {
  const [page, setPage] = useState<Page>("landing");
  const [wallet, setWallet] = useState<WalletState>({ balance: 0 });
  const [walletAddress, setWalletAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState("");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? (JSON.parse(saved) as UserData) : null;
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("student-wallet-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  // const walletAddress = "0xA71C...92B4";

  const stats = useMemo(
    () => ({
      total: achievements.length,
      claimed: achievements.filter((achievement) => achievement.claimed).length,
      pending: achievements.filter((achievement) => !achievement.claimed).length,
    }),
    [achievements]
  );

  const navigatePage = (newPage: Page) => {
  window.history.pushState({ page: newPage }, "");
  setPage(newPage);
};

useEffect(() => {
    localStorage.setItem("student-wallet-theme", theme);
  }, [theme]);
  useEffect(() => {
  window.history.replaceState({ page: "landing" }, "");
}, []);

useEffect(() => {
  const handlePopState = (event: PopStateEvent) => {
    if (event.state?.page) {
      setPage(event.state.page);
    } else {
      setPage("landing");
    }
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`${API_BASE_URL}/api/achievements/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setAchievements(data);
      } else {
        setAchievements([]); // prevent crash
      }
    });
}, [page]);

useEffect(() => {
  if (!walletConnected) return;
  fetch(`${API_BASE_URL}/api/wallet/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => res.json())
  .then((data) => {
      console.log("wallet data:", data);
      setWallet(data);
    })
    .catch((err) => console.error("wallet fetch error:", err));
}, [walletConnected]);

const connectWallet = async() =>{
  try{
    if(!window.ethereum){
      alert("MetaMask is not installed");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });


    const address = accounts[0];
    setWalletAddress(address);
    setWalletConnected(true);

     const token = localStorage.getItem("token");

    await fetch(`${API_BASE_URL}/api/connect-wallet/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wallet_address: address,
      }),
    });
  }catch (error){
    console.error(error);
  }
};

const disconnectWallet = () => {
  setWalletAddress("");
  setWalletConnected(false);
}
const handleWalletToggle = () =>{
  if(walletConnected){
    disconnectWallet();
  }else{
    connectWallet();
  }
};

useEffect(() => {
  const fetchWallet = async () => {

    const token = localStorage.getItem("token");

    if (!token) return;

    const res = await fetch(
      `${API_BASE_URL}/api/wallet/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.wallet_address) {
      setWalletAddress(data.wallet_address);
      setWalletConnected(true);
    }
    if (typeof data.balance === "number") {
      setWallet((current) => ({ ...current, balance: data.balance }));
    }
  };

  fetchWallet();
}, []);

const claimAchievement = async (achievementId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigatePage("login");
    return;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/achievements/${achievementId}/claim/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    alert(data.error ?? "Could not claim this certificate");
    return;
  }

  setAchievements((current) =>
    current.map((achievement) =>
      achievement.id === achievementId
        ? {
            ...achievement,
            claimed: true,
            token_id: data.token_id,
            txHash: data.txHash ?? data.tx_Hash,
            tx_Hash: data.tx_Hash ?? data.txHash,
          }
        : achievement
    )
  );
};



  return (
    <div className="app" data-theme={theme}>
      <Navbar
        currentPage={page}
        theme={theme}
        walletAddress={walletConnected ? walletAddress : undefined}
        onNavigate={navigatePage}
        onThemeToggle={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        // onWalletToggle={() => setWalletConnected((current) => !current)}
        onWalletToggle={handleWalletToggle}
      />

      {page === "landing" ? (
        <LandingPage onStart={() => navigatePage("login")} onDemo={() => navigatePage("dashboard")} />
      ) : page === "login" ? (
        <LoginPage onLogin={(userData)=>{setUser(userData); navigatePage("dashboard");}} onSignupClick={() => navigatePage("signup")} />
      ):page === "signup" ? (
        <SignupPage onLoginClick = {() => 
          navigatePage("login")
        }/>
      ): (
        <main className="workspace">
          <Sidebar currentPage={page} onNavigate={navigatePage} user={user}/>

          <section className="content">
            {page === "dashboard" && (
              <Dashboard
                achievements={achievements}
                stats={stats}
                wallet={wallet}
                walletConnected={walletConnected}
                onClaim={() => navigatePage("achievements")}
                onVerify={() => navigatePage("verify")}
              />
            )}
            {page === "achievements" && (
              <AchievementList
                achievements={achievements}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                // onConnectWallet={() => setWalletConnected(true)}
                onConnectWallet={connectWallet}
                onClaimAchievement={claimAchievement}
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
  const showWallet =
    currentPage !== "landing" &&
    currentPage !== "login" &&
    currentPage !== "signup";

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

function LoginPage({
  onLogin,
  onSignupClick,
}: {
  onLogin: (userData: UserData) => void;
  onSignupClick: () => void;
}) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleLogin = async() =>{ 
    const res = await fetch(`${API_BASE_URL}/api/login/`, {
        method : "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({
          email,
          password, 
        }),
    });
    const data = await res.json();
    if(data.access){
      localStorage.setItem(
        "token",
        data.access
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() =>{
      onLogin(data.user);
    }, 0);
    }else{
      alert(data.error);
    }
    }

  return (
    <main className="loginPage">
      <section className="loginPanel">
        <div>
          <span className="eyebrow">Student access</span>
          <h1>Continue to your achievement dashboard</h1>
        </div>

        <label>
          Student ID
          <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        </label>

        <label>
          Password
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button className="primaryButton fullWidth" onClick={handleLogin}>
          <LogIn size={18} />
          <span>Login</span>
        </button>
        <p>
          Don't have an account?
        </p>
        <button className = "secondaryButton" onClick = {onSignupClick}>
          Sign Up
        </button>
      </section>
    </main>
  );
}


function SignupPage({
  onLoginClick,
} : {
  onLoginClick: () => void;
}){
  const [name,  setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSignUp = async() => {
    const res = await fetch(
      `${API_BASE_URL}/api/signup/`,
      {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({
          name, 
          email,
          password,
        }),
      }
    );
    const data = await res.json();
    if(res.ok){
      alert(data.message)
    }else{
      alert(data.error)
    }
  };
  return (
    <main className="loginPage">
      <section className="loginPanel">
        <h1>Create Account</h1>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button className="primaryButton fullWidth" onClick={handleSignUp}>
          SignUp
        </button>
        <button className="secondaryButton" onClick={onLoginClick}>
          Back to Login
        </button>
      </section>
    </main>
  )
}

function Sidebar({
  currentPage,
  onNavigate,
  user,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: UserData | null;
}) {

  return (
    <aside className="sidebar">
      <div className="profileSection">
        <div className="avatar">{user?.name? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase(): "S"}</div>
        <div>
          <strong>{user?.name?? "Guest User"}</strong>
          <span>{user?.role?? "Student"}</span>
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
  wallet,
}: {
  achievements: Achievement[];
  stats: { total: number; claimed: number; pending: number };
  walletConnected: boolean;
  onClaim: () => void;
  onVerify: () => void;
  wallet: {balance: number};
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
        <Metric label="Wallet Balance" value={String(wallet.balance)} />
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
  walletAddress,
  onConnectWallet,
  onClaimAchievement,
}: {
  achievements: Achievement[];
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onClaimAchievement: (achievementId: number) => void;
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
            walletAddress={walletAddress}
            onClaimAchievement={onClaimAchievement}
          />
        ))}
      </div>
    </>
  );
}

function AchievementCard({
  achievement,
  walletConnected,
  walletAddress,
  onConnectWallet,
  onClaimAchievement,
}: {
  achievement: Achievement;
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onClaimAchievement: (achievementId: number) => void;
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
          <span>{achievement.txHash ?? achievement.tx_Hash ?? "Claimed"}</span>
        </button>
      ) : canClaim ? (
        <button
          className="primaryButton cardButton"
          onClick={() => onClaimAchievement(achievement.id)}
        >
          <Sparkles size={18} />
          <span>Claim NFT</span>
        </button>
      ) : (
        <button className="secondaryButton cardButton" onClick={onConnectWallet}>
          <Wallet size={18} />
          <span>{walletConnected? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`: "Connect Wallet"}</span>
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

  const claimed = achievements;

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
            {achievement.certificate && (
              <button onClick={() => window.open(getCertificateUrl(achievement.certificate?? ""), "_blank")}>
                View Certificate
                </button>
            )}
            <div className="certificateFooter">
              <span>{achievement.date}</span>
              <span>{achievement.txHash ?? achievement.tx_Hash}</span>
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
