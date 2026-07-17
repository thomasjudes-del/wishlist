import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { api } from "./services/data";
import type {
  OfferType,
  Profile,
  User,
  Visibility,
  Wish,
  WishBundle,
  WishStatus,
  WishStep,
} from "./types/domain";

const statuses: WishStatus[] = [
  "dreaming",
  "exploring",
  "in_progress",
  "on_hold",
  "achieved",
  "abandoned",
  "transformed",
];
const vis: Visibility[] = ["private", "link", "public"];
const fallbackImage =
  "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80";
const prompts = [
  "Clarify this wish",
  "Reality-check this wish",
  "Turn this wish into an ordered path",
  "Identify assumptions to test",
  "Propose the smallest useful experiment",
  "Improve the public presentation",
];
const offerLabels: Record<OfferType, string> = {
  help: "I want to help",
  idea: "I have an idea",
  know_someone: "I know someone",
  done_this: "I have done this",
  join: "I want to join",
  offer_something: "I can offer something",
};
const pretty = (value: string) => value.replaceAll("_", " ");
const promptText = (wish: Partial<Wish>, label: string) =>
  `${label}. My wish is: "${wish.title || "Untitled wish"}". Description: ${wish.description || "No description yet."}. Please be concrete, warm, and practical. Return suggestions I can adapt manually.`;

type OutletContext = {
  user: User | null;
  setUser: (user: User | null) => void;
};
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void api
      .currentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
  return { user, setUser, loading };
}
function useWishlistOutlet() {
  return useOutletContext<OutletContext>();
}

export function App() {
  const { user, setUser } = useSession();
  async function signOut() {
    await api.signOut();
    setUser(null);
  }
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          Wishlist
        </Link>
        <nav>
          {api.demoMode && (
            <button
              className="demo-badge"
              title="Seeded wishes and localStorage persistence are active. Configure public Appwrite environment variables to use live data."
            >
              Demo
            </button>
          )}
          <Link to="/">Explore</Link>
          <Link to="/mine">My Wishlist</Link>
          <Link to="/profile">Profile</Link>
          {user && (
            <Link className="button primary small-button" to="/wish/new">
              Add a wish
            </Link>
          )}
          {user ? (
            <button onClick={() => void signOut()}>Sign out</button>
          ) : (
            <Link className="button small-button" to="/auth">
              Sign in
            </Link>
          )}
        </nav>
      </header>
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}

export function HomePage() {
  const [filter, setFilter] = useState("New");
  const [wishes, setWishes] = useState<Wish[]>([]);
  useEffect(() => {
    void api.listExplore(filter).then(setWishes);
  }, [filter]);
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Share a wish. Build the path.</p>
          <h1>What would you love to make happen?</h1>
        </div>
        <Link className="button primary" to="/wish/new">
          Add a wish
        </Link>
      </section>
      <section id="explore" className="section-head explore-head">
        <h2>Open wishes</h2>
        <div className="filters">
          {["New", "Active", "Achieved"].map((item) => (
            <button
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
      <div className="wish-grid">
        {wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} />
        ))}
      </div>
    </>
  );
}
function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      className={className}
      src={!src || failed ? fallbackImage : src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
function WishCard({ wish }: { wish: Wish }) {
  return (
    <Link className="wish-card" to={`/w/${wish.slug}`}>
      <SafeImage src={wish.imageUrl} alt="" />
      <div>
        <p className="eyebrow">
          {wish.ownerName} · {pretty(wish.status)}
        </p>
        <h2>{wish.title}</h2>
        <p>{wish.description}</p>
        <span>{wish.acceptsHelp ? "Open to help" : "Private path"}</span>
      </div>
    </Link>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useWishlistOutlet();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const u =
        mode === "up"
          ? await api.signUp(
              String(f.get("email")),
              String(f.get("password")),
              String(f.get("name")),
            )
          : await api.signIn(String(f.get("email")), String(f.get("password")));
      setUser(u);
      navigate("/mine");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not authenticate");
    }
  }
  return (
    <section className="panel narrow">
      <h1>{mode === "up" ? "Create account" : "Sign in"}</h1>
      <form onSubmit={submit} className="form">
        {mode === "up" && (
          <input name="name" placeholder="Display name" required />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={api.demoMode ? "demo@wishlist.local" : ""}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={api.demoMode ? "password" : ""}
          required
        />
        <button className="button primary">
          {mode === "up" ? "Create account" : "Sign in"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => setMode(mode === "up" ? "in" : "up")}>
        {mode === "up" ? "I already have an account" : "Create an account"}
      </button>
    </section>
  );
}
function AuthNudge() {
  return (
    <section className="panel narrow">
      <h1>Sign in first.</h1>
      <p>Demo sign-in is prefilled and keeps changes in this browser.</p>
      <Link className="button primary" to="/auth">
        Sign in
      </Link>
    </section>
  );
}
export function MyWishlistPage() {
  const { user } = useWishlistOutlet();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    if (user) {
      void api.myWishes(user.id).then(setWishes);
      void api.profile(user.id).then(setProfile);
    }
  }, [user]);
  if (!user) return <AuthNudge />;
  return (
    <>
      <section className="profile-strip">
        <div>
          <p className="eyebrow">Your offering</p>
          <h1>{profile?.displayName || user.name}</h1>
          <p>
            {profile?.offersText ||
              "Add what you can offer so people know how to involve you."}
          </p>
        </div>
        <Link className="button" to="/profile">
          Edit profile
        </Link>
      </section>
      <div className="section-head">
        <h2>My Wishlist</h2>
        <Link className="button primary" to="/wish/new">
          Add a wish
        </Link>
      </div>
      <div className="wish-list">
        {wishes.map((w) => (
          <div className="manage-row" key={w.id}>
            <div>
              <h3>{w.title}</h3>
              <p>
                {w.visibility} · {pretty(w.status)}
              </p>
            </div>
            <div className="actions">
              <Link className="button" to={`/w/${w.slug}`}>
                Open
              </Link>
              <Link className="button primary" to={`/wish/${w.slug}/edit`}>
                Edit
              </Link>
            </div>
          </div>
        ))}
        {!wishes.length && (
          <p className="empty">
            No wishes yet. Start with one honest sentence.
          </p>
        )}
      </div>
    </>
  );
}

export function WishEditor() {
  const { user } = useWishlistOutlet();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [wish, setWish] = useState<Partial<Wish>>({
    visibility: "private",
    status: "dreaming",
    acceptsHelp: true,
  });
  const [steps, setSteps] = useState<Partial<WishStep>[]>([
    { title: "", status: "planned", stepType: "action" },
  ]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  useEffect(() => {
    if (slug)
      void api.bundle(slug).then((b) => {
        setWish(b.wish);
        setSteps(
          b.steps.length
            ? b.steps
            : [{ title: "", status: "planned", stepType: "action" }],
        );
      });
  }, [slug]);
  if (!user) return <AuthNudge />;
  const currentUser = user;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("Saving…");
    try {
      const saved = await api.saveWish(
        wish,
        steps.filter((s) => s.title),
        currentUser,
      );
      setNotice("Wish saved");
      setTimeout(() => navigate(`/w/${saved.slug}`), 500);
    } catch (err) {
      setNotice("");
      setError(err instanceof Error ? err.message : "Could not save wish");
    }
  }
  const patchStep = (i: number, next: Partial<WishStep>) =>
    setSteps(steps.map((s, idx) => (idx === i ? { ...s, ...next } : s)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= steps.length) return;
    const n = [...steps];
    [n[i], n[j]] = [n[j], n[i]];
    setSteps(n);
  };
  async function copyPrompt(label: string) {
    await navigator.clipboard.writeText(promptText(wish, label));
    setCopied("Prompt copied");
  }
  return (
    <section className="panel">
      <h1>{slug ? "Edit wish" : "Add a wish"}</h1>
      <form onSubmit={submit} className="form editor">
        <label>
          Title
          <input
            value={wish.title || ""}
            onChange={(e) => setWish({ ...wish, title: e.target.value })}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={wish.description || ""}
            onChange={(e) => setWish({ ...wish, description: e.target.value })}
            required
          />
        </label>
        <label>
          Image URL
          <input
            value={wish.imageUrl || ""}
            onChange={(e) => setWish({ ...wish, imageUrl: e.target.value })}
            placeholder="https://…"
          />
        </label>
        <div className="row">
          <select
            value={wish.visibility}
            onChange={(e) =>
              setWish({ ...wish, visibility: e.target.value as Visibility })
            }
          >
            {vis.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select
            value={wish.status}
            onChange={(e) =>
              setWish({ ...wish, status: e.target.value as WishStatus })
            }
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label className="check">
            <input
              type="checkbox"
              checked={wish.acceptsHelp ?? true}
              onChange={(e) =>
                setWish({ ...wish, acceptsHelp: e.target.checked })
              }
            />{" "}
            accepts help
          </label>
        </div>
        <h2>Ordered path</h2>
        {steps.map((step, index) => (
          <div className="step-edit" key={step.id || index}>
            <span>{index + 1}</span>
            <input
              value={step.title || ""}
              onChange={(e) => patchStep(index, { title: e.target.value })}
              placeholder="Step title"
            />
            <select
              value={step.status}
              onChange={(e) =>
                patchStep(index, {
                  status: e.target.value as WishStep["status"],
                })
              }
            >
              <option>planned</option>
              <option>active</option>
              <option>completed</option>
              <option>skipped</option>
            </select>
            <button
              type="button"
              onClick={() => patchStep(index, { status: "completed" })}
            >
              Complete
            </button>
            <button type="button" onClick={() => move(index, -1)}>
              ↑
            </button>
            <button type="button" onClick={() => move(index, 1)}>
              ↓
            </button>
            <button
              type="button"
              onClick={() => setSteps(steps.filter((_, i) => i !== index))}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSteps([
              ...steps,
              { title: "", status: "planned", stepType: "action" },
            ])
          }
        >
          Add step
        </button>
        <details className="utility">
          <summary>Use your AI to improve this wish</summary>
          <p>These buttons copy full prompts only. No AI service is called.</p>
          <div className="prompt-list">
            {prompts.map((p) => (
              <button type="button" key={p} onClick={() => void copyPrompt(p)}>
                {p}
              </button>
            ))}
          </div>
          {copied && (
            <p className="success" role="status">
              {copied}
            </p>
          )}
        </details>
        {notice && <p className="success">{notice}</p>}
        {error && <p className="error">{error}</p>}
        <button className="button primary">Save wish</button>
      </form>
    </section>
  );
}

export function WishPage() {
  const { user } = useWishlistOutlet();
  const { slug } = useParams();
  const [bundle, setBundle] = useState<WishBundle | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const shareUrl = useMemo(
    () => `${location.origin}/w/${bundle?.wish.slug || slug || ""}`,
    [bundle, slug],
  );
  async function load() {
    if (slug) setBundle(await api.bundle(slug));
  }
  useEffect(() => {
    let ignore = false;
    if (slug)
      void api.bundle(slug).then((next) => {
        if (!ignore) setBundle(next);
      });
    return () => {
      ignore = true;
    };
  }, [slug]);
  if (!bundle) return <p className="empty">Loading wish…</p>;
  const { wish, steps, updates, offers, follows } = bundle;
  async function share() {
    if (navigator.share)
      await navigator
        .share({ title: wish.title, text: wish.description, url: shareUrl })
        .catch(() => navigator.clipboard.writeText(shareUrl));
    else await navigator.clipboard.writeText(shareUrl);
    setNotice("Link copied");
  }
  async function follow() {
    if (!user) {
      setNotice("Sign in to follow");
      return;
    }
    await api.follow(wish, user);
    await load();
    setNotice(
      follows.some((f) => f.userId === user.id)
        ? "Follow removed"
        : "Following wish",
    );
  }
  return (
    <>
      <article className="public-wish">
        <SafeImage src={wish.imageUrl} alt="" />
        <div>
          <p className="eyebrow">
            {wish.ownerName} · {pretty(wish.status)}
          </p>
          <h1>{wish.title}</h1>
          <p>{wish.description}</p>
          <p>
            <b>{offers.length}</b> helpers · <b>{steps.length}</b> path steps
          </p>
          <div className="actions">
            {wish.acceptsHelp && (
              <button
                className="button primary"
                onClick={() => setHelpOpen(true)}
              >
                I can help
              </button>
            )}
            <button className="button" onClick={() => void follow()}>
              {user && follows.some((f) => f.userId === user.id)
                ? "Following"
                : "Follow"}
            </button>
            <button className="button" onClick={() => void share()}>
              Share
            </button>
            {user?.id === wish.ownerId && (
              <Link className="button" to={`/wish/${wish.slug}/edit`}>
                Edit
              </Link>
            )}
          </div>
          {notice && <p className="success">{notice}</p>}
        </div>
      </article>
      <section className="columns">
        <div>
          <h2>Ordered path</h2>
          <ol className="path">
            {steps.map((s) => (
              <li className={s.status} key={s.id}>
                <b>{s.title}</b>
                {s.description && <p>{s.description}</p>}
                <span>{pretty(s.status)}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside>
          <h2>Recent activity</h2>
          <div className="journal">
            {updates.slice(0, 6).map((u) => (
              <p key={u.id}>{u.message}</p>
            ))}
          </div>
          <div className="participation">
            <h2>Participation</h2>
            {offers.length ? (
              offers.map((o) => (
                <p key={o.id}>
                  <b>{o.helperName}</b>: {o.message}
                </p>
              ))
            ) : (
              <p>No offers yet.</p>
            )}
          </div>
        </aside>
      </section>
      {helpOpen && (
        <OfferModal
          wish={wish}
          user={user}
          onClose={() => setHelpOpen(false)}
          onDone={async () => {
            setHelpOpen(false);
            setNotice("Offer sent");
            await load();
          }}
        />
      )}
    </>
  );
}
function OfferModal({
  wish,
  user,
  onClose,
  onDone,
}: {
  wish: Wish;
  user: User | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<OfferType>("help");
  const [contact, setContact] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    await api.offer(wish, user, type, message, contact);
    onDone();
  }
  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <button className="close" type="button" onClick={onClose}>
          Close
        </button>
        <h2>I can help</h2>
        {!user ? (
          <>
            <p>Sign in to offer concrete help.</p>
            <Link className="button primary" to="/auth">
              Sign in
            </Link>
          </>
        ) : (
          <>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OfferType)}
            >
              {Object.entries(offerLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A short concrete offer"
              required
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Optional contact URL"
            />
            <button className="button primary">Send offer</button>
          </>
        )}
      </form>
    </div>
  );
}

export function ProfilePage() {
  const { user } = useWishlistOutlet();
  const [profile, setProfile] = useState<Partial<Profile>>({ offerTags: [] });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (user)
      void api.profile(user.id).then((p) => {
        if (p) setProfile(p);
      });
  }, [user]);
  if (!user) return <AuthNudge />;
  const currentUser = user;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await api.saveProfile(profile, currentUser);
    setNotice("Profile saved");
  }
  return (
    <section className="panel">
      <h1>Profile</h1>
      <form className="form" onSubmit={submit}>
        <input
          placeholder="Display name"
          value={profile.displayName || ""}
          onChange={(e) =>
            setProfile({ ...profile, displayName: e.target.value })
          }
        />
        <input
          placeholder="Location"
          value={profile.location || ""}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        />
        <textarea
          placeholder="Short bio"
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <textarea
          placeholder="What I can offer"
          value={profile.offersText || ""}
          onChange={(e) =>
            setProfile({ ...profile, offersText: e.target.value })
          }
        />
        <input
          placeholder="Tags, comma separated"
          value={(profile.offerTags || []).join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              offerTags: e.target.value
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
        />
        <input
          placeholder="Contact URL"
          value={profile.contactUrl || ""}
          onChange={(e) =>
            setProfile({ ...profile, contactUrl: e.target.value })
          }
        />
        {notice && <p className="success">{notice}</p>}
        <button className="button primary">Save profile</button>
      </form>
    </section>
  );
}
