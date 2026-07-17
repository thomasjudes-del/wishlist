import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { api } from './services/data';
import type {
  HelpOffer,
  OfferType,
  Profile,
  User,
  Visibility,
  Wish,
  WishBundle,
  WishStatus,
  WishStep,
} from './types/domain';

const statuses: WishStatus[] = [
  'dreaming',
  'exploring',
  'in_progress',
  'on_hold',
  'achieved',
  'abandoned',
  'transformed',
];

const vis: Visibility[] = ['private', 'link', 'public'];

const prompts = [
  'Clarify this wish',
  'Reality-check this wish',
  'Turn this wish into an ordered path',
  'Identify assumptions to test',
  'Propose the smallest useful experiment',
  'Improve the public presentation',
];

const promptText = (wish: Wish, label: string) =>
  `${label}. My wish is: "${wish.title}". Description: ${wish.description}. Please be concrete, warm, and practical. Return suggestions I can adapt manually.`;

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
      .then((currentUser) => setUser(currentUser))
      .finally(() => setLoading(false));
  }, []);

  return { user, setUser, loading };
}

export function App() {
  const { user, setUser } = useSession();

  const signOut = async () => {
    await api.signOut();
    setUser(null);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          Wishlist
        </Link>
        <nav>
          <Link to="/">Explore</Link>
          <Link to="/mine">My Wishlist</Link>
          {user ? (
            <button onClick={() => void signOut()}>Sign out</button>
          ) : (
            <Link to="/auth">Sign in</Link>
          )}
        </nav>
      </header>

      {api.demoMode && (
        <div className="demo-ribbon">
          Demo mode: seeded local data is active because Appwrite public
          environment variables are not configured.
        </div>
      )}

      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}

function useWishlistOutlet() {
  return useOutletContext<OutletContext>();
}

export function HomePage() {
  const [filter, setFilter] = useState('New');
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    void api.listExplore(filter).then(setWishes);
  }, [filter]);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Share a wish. Build the path. Let people jump in.</p>
        <h1>What would you love to make happen?</h1>
        <div className="actions">
          <Link className="button primary" to="/wish/new">
            Add a wish
          </Link>
          <a className="button" href="#explore">
            Explore
          </a>
        </div>
      </section>

      <section id="explore" className="section-head">
        <h2>Open wishes</h2>
        <div className="filters">
          {['New', 'Active', 'Achieved', 'I may be able to help'].map((item) => (
            <button
              className={filter === item ? 'active' : ''}
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

function WishCard({ wish }: { wish: Wish }) {
  return (
    <Link className="wish-card" to={`/w/${wish.slug}`}>
      <img
        src={
          wish.imageUrl ||
          'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1000&q=80'
        }
        alt=""
      />
      <div>
        <p className="eyebrow">
          {wish.ownerName} · {wish.status.replace('_', ' ')}
        </p>
        <h2>{wish.title}</h2>
        <p>{wish.description}</p>
      </div>
    </Link>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useWishlistOutlet();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const nextUser =
        mode === 'up'
          ? await api.signUp(
              String(form.get('email')),
              String(form.get('password')),
              String(form.get('name')),
            )
          : await api.signIn(
              String(form.get('email')),
              String(form.get('password')),
            );

      setUser(nextUser);
      navigate('/mine');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not authenticate',
      );
    }
  }

  return (
    <section className="panel narrow">
      <h1>{mode === 'up' ? 'Create account' : 'Sign in'}</h1>
      <form onSubmit={submit} className="form">
        {mode === 'up' && (
          <input name="name" placeholder="Display name" required />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={api.demoMode ? 'demo@wishlist.local' : ''}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={api.demoMode ? 'password' : ''}
          required
        />
        <button className="button primary">
          {mode === 'up' ? 'Create account' : 'Sign in'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => setMode(mode === 'up' ? 'in' : 'up')}>
        {mode === 'up' ? 'I already have an account' : 'Create an account'}
      </button>
    </section>
  );
}

export function MyWishlistPage() {
  const { user } = useWishlistOutlet();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [profile, setProfile] = useState<Profile | undefined>();

  useEffect(() => {
    if (!user) return;
    const currentUser = user;
    void api.myWishes(currentUser.id).then(setWishes);
    void api.profile(currentUser.id).then(setProfile);
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
              'Add what you can offer so people know how to involve you.'}
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

      <div className="wish-grid">
        {wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} />
        ))}
        {!wishes.length && (
          <p className="empty">No wishes yet. Start with one honest sentence.</p>
        )}
      </div>
    </>
  );
}

function AuthNudge() {
  return (
    <section className="panel narrow">
      <h1>Come in first.</h1>
      <p>
        Create an account or sign in to keep wishes, paths, follows, and offers
        connected to you.
      </p>
      <Link className="button primary" to="/auth">
        Sign in
      </Link>
    </section>
  );
}

export function WishEditor() {
  const { user } = useWishlistOutlet();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [wish, setWish] = useState<Partial<Wish>>({
    visibility: 'private',
    status: 'dreaming',
    acceptsHelp: true,
  });
  const [steps, setSteps] = useState<Partial<WishStep>[]>([
    { title: '', status: 'planned', stepType: 'action' },
  ]);

  useEffect(() => {
    if (!slug) return;
    void api.bundle(slug).then((bundle) => {
      setWish(bundle.wish);
      setSteps(bundle.steps);
    });
  }, [slug]);

  if (!user) return <AuthNudge />;
  const currentUser = user;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await api.saveWish(
      wish,
      steps.filter((step) => step.title),
      currentUser,
    );
    navigate(`/w/${saved.slug}`);
  }

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    setSteps((current) => {
      const next = [...current];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  return (
    <section className="panel">
      <h1>{slug ? 'Edit wish' : 'Add a wish'}</h1>
      <form onSubmit={submit} className="form editor">
        <input
          value={wish.title || ''}
          onChange={(event) => setWish({ ...wish, title: event.target.value })}
          placeholder="Wish title"
          required
        />
        <textarea
          value={wish.description || ''}
          onChange={(event) =>
            setWish({ ...wish, description: event.target.value })
          }
          placeholder="Short description"
          required
        />
        <input
          value={wish.imageUrl || ''}
          onChange={(event) =>
            setWish({ ...wish, imageUrl: event.target.value })
          }
          placeholder="Optional image URL"
        />

        <div className="row">
          <select
            value={wish.visibility}
            onChange={(event) =>
              setWish({ ...wish, visibility: event.target.value as Visibility })
            }
          >
            {vis.map((visibility) => (
              <option key={visibility}>{visibility}</option>
            ))}
          </select>
          <select
            value={wish.status}
            onChange={(event) =>
              setWish({ ...wish, status: event.target.value as WishStatus })
            }
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={wish.acceptsHelp ?? true}
              onChange={(event) =>
                setWish({ ...wish, acceptsHelp: event.target.checked })
              }
            />{' '}
            accepts participation
          </label>
        </div>

        <h2>Ordered path</h2>
        {steps.map((step, index) => (
          <div className="step-edit" key={step.id || index}>
            <span>{index + 1}</span>
            <input
              value={step.title || ''}
              onChange={(event) =>
                setSteps(
                  steps.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, title: event.target.value }
                      : item,
                  ),
                )
              }
              placeholder="Step title"
            />
            <select
              value={step.status}
              onChange={(event) =>
                setSteps(
                  steps.map((item, itemIndex) =>
                    itemIndex === index
                      ? {
                          ...item,
                          status: event.target.value as WishStep['status'],
                        }
                      : item,
                  ),
                )
              }
            >
              <option>planned</option>
              <option>active</option>
              <option>completed</option>
              <option>skipped</option>
            </select>
            <button
              type="button"
              onClick={() =>
                setSteps(steps.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Delete
            </button>
            <button type="button" onClick={() => moveStepUp(index)}>
              ↑
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setSteps([
              ...steps,
              { title: '', status: 'planned', stepType: 'action' },
            ])
          }
        >
          Add step
        </button>
        <button className="button primary">Save wish</button>
      </form>
    </section>
  );
}

export function WishPage() {
  const { user } = useWishlistOutlet();
  const { slug } = useParams();
  const [bundle, setBundle] = useState<WishBundle | null>(null);
  const [copied, setCopied] = useState('');

  const shareUrl = useMemo(
    () => `${location.origin}/w/${bundle?.wish.slug || slug || ''}`,
    [bundle, slug],
  );

  const load = async (): Promise<void> => {
    if (!slug) return;
    const nextBundle = await api.bundle(slug);
    setBundle(nextBundle);
  };

  useEffect(() => {
    void load();
    // load is intentionally driven only by the route slug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!bundle) return <p className="empty">Loading wish…</p>;

  const { wish, steps, updates, offers, follows } = bundle;

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: wish.title,
        text: wish.description,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied('Link copied');
    }
  }

  const toggleFollow = async () => {
    if (!user) return;
    await api.follow(wish, user);
    await load();
  };

  return (
    <>
      <article className="public-wish">
        <img src={wish.imageUrl} alt="" />
        <div>
          <p className="eyebrow">
            {wish.ownerName} · {wish.visibility} ·{' '}
            {wish.status.replace('_', ' ')}
          </p>
          <h1>{wish.title}</h1>
          <p>{wish.description}</p>
          <div className="actions">
            <button className="button primary" onClick={() => void share()}>
              Share
            </button>
            {user && (
              <button className="button" onClick={() => void toggleFollow()}>
                {follows.some((follow) => follow.userId === user.id)
                  ? 'Following'
                  : 'Follow'}
              </button>
            )}
            {user?.id === wish.ownerId && (
              <Link className="button" to={`/wish/${wish.slug}/edit`}>
                Edit
              </Link>
            )}
          </div>
          {copied && <p>{copied}</p>}
        </div>
      </article>

      <section className="share-preview">
        <b>Share preview</b>
        <span>{wish.title}</span>
        <span>
          {steps.length} steps · {offers.length} helpers
        </span>
      </section>

      <section className="columns">
        <div>
          <h2>The path</h2>
          <ol className="path">
            {steps.map((step) => (
              <li className={step.status} key={step.id}>
                <b>{step.title}</b>
                <p>{step.description}</p>
                {user && wish.acceptsHelp && (
                  <OfferMini
                    wish={wish}
                    user={user}
                    stepId={step.id}
                    onDone={() => void load()}
                  />
                )}
              </li>
            ))}
          </ol>

          <h2>Prompt templates</h2>
          <div className="prompt-list">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() =>
                  void navigator.clipboard.writeText(promptText(wish, prompt))
                }
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <aside>
          <OfferBox wish={wish} user={user} onDone={() => void load()} />
          <h2>Activity</h2>
          <div className="journal">
            {updates.map((update) => (
              <p key={update.id}>{update.message}</p>
            ))}
          </div>
          <h2>Participation</h2>
          {offers.map((offer) => (
            <p key={offer.id}>
              <b>{offer.helperName}</b>: {offer.message}
            </p>
          ))}
        </aside>
      </section>
    </>
  );
}

function OfferMini({
  wish,
  user,
  stepId,
  onDone,
}: {
  wish: Wish;
  user: User;
  stepId: string;
  onDone: () => void;
}) {
  const offerHelp = async () => {
    await api.offer(
      wish,
      user,
      'help',
      'I can help with this step.',
      undefined,
      stepId,
    );
    onDone();
  };

  return (
    <button onClick={() => void offerHelp()}>Offer help for this step</button>
  );
}

function OfferBox({
  wish,
  user,
  onDone,
}: {
  wish: Wish;
  user: User | null;
  onDone: () => void;
}) {
  const [message, setMessage] = useState('');
  const [offerType, setType] = useState<OfferType>('help');

  if (!user) {
    return (
      <div className="panel small">
        <p>Sign in to follow or offer concrete help.</p>
        <Link to="/auth">Sign in</Link>
      </div>
    );
  }

  const currentUser = user;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.offer(wish, currentUser, offerType, message);
    setMessage('');
    onDone();
  }

  return (
    <form className="panel small" onSubmit={submit}>
      <h2>Jump in</h2>
      <select
        value={offerType}
        onChange={(event) => setType(event.target.value as OfferType)}
      >
        <option value="help">I want to help</option>
        <option value="idea">I have an idea</option>
        <option value="know_someone">I know someone</option>
        <option value="done_this">I’ve done this</option>
        <option value="join">I want to join</option>
        <option value="offer_something">I can offer something</option>
      </select>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="A short concrete offer"
        required
      />
      <button className="button primary">Send offer</button>
    </form>
  );
}

export function ProfilePage() {
  const { user } = useWishlistOutlet();
  const [profile, setProfile] = useState<Partial<Profile>>({ offerTags: [] });

  useEffect(() => {
    if (!user) return;
    void api.profile(user.id).then((existing) => {
      if (existing) setProfile(existing);
    });
  }, [user]);

  if (!user) return <AuthNudge />;
  const currentUser = user;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.saveProfile(profile, currentUser);
    alert('Profile saved');
  }

  return (
    <section className="panel">
      <h1>Profile</h1>
      <form className="form" onSubmit={submit}>
        <input
          placeholder="Display name"
          value={profile.displayName || ''}
          onChange={(event) =>
            setProfile({ ...profile, displayName: event.target.value })
          }
        />
        <input
          placeholder="Approximate location"
          value={profile.location || ''}
          onChange={(event) =>
            setProfile({ ...profile, location: event.target.value })
          }
        />
        <textarea
          placeholder="Short line"
          value={profile.bio || ''}
          onChange={(event) =>
            setProfile({ ...profile, bio: event.target.value })
          }
        />
        <textarea
          placeholder="What I can offer"
          value={profile.offersText || ''}
          onChange={(event) =>
            setProfile({ ...profile, offersText: event.target.value })
          }
        />
        <input
          placeholder="Offer tags, comma separated"
          value={(profile.offerTags || []).join(', ')}
          onChange={(event) =>
            setProfile({
              ...profile,
              offerTags: event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />
        <input
          placeholder="External contact URL"
          value={profile.contactUrl || ''}
          onChange={(event) =>
            setProfile({ ...profile, contactUrl: event.target.value })
          }
        />
        <button className="button primary">Save profile</button>
      </form>
    </section>
  );
}
