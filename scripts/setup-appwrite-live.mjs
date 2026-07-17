#!/usr/bin/env node
const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID || 'wishlist';
const tableIds = {
  profiles: process.env.APPWRITE_PROFILES_TABLE_ID || process.env.VITE_APPWRITE_PROFILES_TABLE_ID || 'profiles',
  wishes: process.env.APPWRITE_WISHES_TABLE_ID || process.env.VITE_APPWRITE_WISHES_TABLE_ID || 'wishes',
  steps: process.env.APPWRITE_STEPS_TABLE_ID || process.env.VITE_APPWRITE_STEPS_TABLE_ID || 'wish_steps',
  updates: process.env.APPWRITE_UPDATES_TABLE_ID || process.env.VITE_APPWRITE_UPDATES_TABLE_ID || 'wish_updates',
  help: process.env.APPWRITE_HELP_TABLE_ID || process.env.VITE_APPWRITE_HELP_TABLE_ID || 'help_offers',
  follows: process.env.APPWRITE_FOLLOWS_TABLE_ID || process.env.VITE_APPWRITE_FOLLOWS_TABLE_ID || 'wish_follows',
};
if (!endpoint || !project || !key) {
  console.error('Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY. Do not use API keys in frontend VITE_ variables.');
  process.exit(1);
}
const headers = { 'Content-Type': 'application/json', 'X-Appwrite-Project': project, 'X-Appwrite-Key': key };
async function request(path, init = {}) {
  const res = await fetch(`${endpoint.replace(/\/$/, '')}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok && res.status !== 409) throw new Error(`${init.method || 'GET'} ${path} failed: ${res.status} ${text}`);
  return body;
}
const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
async function database() { await post('/databases', { databaseId, name: 'Wishlist' }); }
async function collection(id, name) { await post(`/databases/${databaseId}/collections`, { collectionId: id, name, permissions: ['create("users")'], documentSecurity: true, enabled: true }); }
async function attr(c, kind, key, required, extra = {}) { await post(`/databases/${databaseId}/collections/${c}/attributes/${kind}`, { key, required, ...extra }); }
async function idx(c, key, type, attributes, orders) { await post(`/databases/${databaseId}/collections/${c}/indexes`, { key, type, attributes, orders }); }
const string = (c, key, required, size = 255, array = false) => attr(c, 'string', key, required, { size, array });
const datetime = (c, key, required) => attr(c, 'datetime', key, required);
const bool = (c, key, required, xdefault) => attr(c, 'boolean', key, required, { default: xdefault });
const integer = (c, key, required) => attr(c, 'integer', key, required);
await database();
for (const [k, id] of Object.entries(tableIds)) await collection(id, k.replace(/^./, (x) => x.toUpperCase()));
await Promise.all([
  string(tableIds.profiles,'user_id',true), string(tableIds.profiles,'display_name',true), string(tableIds.profiles,'avatar_url',false,2048), string(tableIds.profiles,'location',false), string(tableIds.profiles,'bio',false,2000), string(tableIds.profiles,'offers_text',false,4000), string(tableIds.profiles,'offer_tags',false,64,true), string(tableIds.profiles,'contact_email',false), string(tableIds.profiles,'contact_whatsapp',false), string(tableIds.profiles,'contact_url',false,2048), datetime(tableIds.profiles,'created_at',true), datetime(tableIds.profiles,'updated_at',true),
  string(tableIds.wishes,'owner_id',true), string(tableIds.wishes,'owner_name',true), string(tableIds.wishes,'title',true,180), string(tableIds.wishes,'slug',true), string(tableIds.wishes,'description',true,4000), string(tableIds.wishes,'image_url',false,2048), string(tableIds.wishes,'visibility',true), string(tableIds.wishes,'status',true), string(tableIds.wishes,'location',false), datetime(tableIds.wishes,'target_date',false), bool(tableIds.wishes,'accepts_help',true,true), datetime(tableIds.wishes,'created_at',true), datetime(tableIds.wishes,'updated_at',true),
  string(tableIds.steps,'wish_id',true), string(tableIds.steps,'owner_id',true), string(tableIds.steps,'title',true,180), string(tableIds.steps,'description',false,2000), integer(tableIds.steps,'position',true), string(tableIds.steps,'status',true), string(tableIds.steps,'step_type',false), datetime(tableIds.steps,'target_date',false), datetime(tableIds.steps,'created_at',true), datetime(tableIds.steps,'updated_at',true),
  string(tableIds.updates,'wish_id',true), string(tableIds.updates,'actor_id',true), string(tableIds.updates,'actor_name',true), string(tableIds.updates,'event_type',true), string(tableIds.updates,'message',true,2000), datetime(tableIds.updates,'created_at',true),
  string(tableIds.help,'wish_id',true), string(tableIds.help,'step_id',false), string(tableIds.help,'wish_owner_id',true), string(tableIds.help,'helper_id',true), string(tableIds.help,'helper_name',true), string(tableIds.help,'offer_type',true), string(tableIds.help,'message',true,2000), string(tableIds.help,'contact_url',false,2048), string(tableIds.help,'status',true), datetime(tableIds.help,'created_at',true), datetime(tableIds.help,'updated_at',true),
  string(tableIds.follows,'wish_id',true), string(tableIds.follows,'user_id',true), datetime(tableIds.follows,'created_at',true),
]);
await new Promise(r => setTimeout(r, 5000));
await Promise.all([
  idx(tableIds.profiles,'user_id_unique','unique',['user_id']),
  idx(tableIds.wishes,'owner_id','key',['owner_id']), idx(tableIds.wishes,'slug_unique','unique',['slug']), idx(tableIds.wishes,'visibility_updated_at','key',['visibility','updated_at'],['ASC','DESC']), idx(tableIds.wishes,'status_updated_at','key',['status','updated_at'],['ASC','DESC']),
  idx(tableIds.steps,'wish_id_position','key',['wish_id','position'],['ASC','ASC']), idx(tableIds.steps,'owner_id','key',['owner_id']),
  idx(tableIds.updates,'wish_id_created_at','key',['wish_id','created_at'],['ASC','DESC']),
  idx(tableIds.help,'wish_id_created_at','key',['wish_id','created_at'],['ASC','DESC']), idx(tableIds.help,'step_id','key',['step_id']), idx(tableIds.help,'wish_owner_id','key',['wish_owner_id']), idx(tableIds.help,'helper_id','key',['helper_id']),
  idx(tableIds.follows,'wish_id_user_id_unique','unique',['wish_id','user_id']), idx(tableIds.follows,'user_id','key',['user_id']),
]);
console.log('Wishlist Appwrite schema is present. Re-run safely if a resource already existed.');
