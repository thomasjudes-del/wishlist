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

const baseUrl = endpoint.replace(/\/$/, '');
const headers = { 'Content-Type': 'application/json', 'X-Appwrite-Project': project, 'X-Appwrite-Key': key };
const databasePath = `/tablesdb/${encodeURIComponent(databaseId)}`;
const tablePath = (tableId) => `${databasePath}/tables/${encodeURIComponent(tableId)}`;
const columnPath = (tableId, key) => `${tablePath(tableId)}/columns/${encodeURIComponent(key)}`;
const indexPath = (tableId, key) => `${tablePath(tableId)}/indexes/${encodeURIComponent(key)}`;

async function request(path, init = {}) {
  const method = init.method || 'GET';
  const res = await fetch(`${baseUrl}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  const text = await res.text();
  let body = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { method, path, status: res.status, ok: res.ok, text, body };
}

function fail(label, response) {
  console.error(`Failed ${label}`);
  throw new Error(`${response.method} ${response.path} failed: ${response.status} ${response.text}`);
}

async function getOrCreate(label, getPath, postPath, body) {
  const existing = await request(getPath);
  if (existing.status === 200) {
    console.log(`Already present ${label}`);
    return existing.body;
  }
  if (existing.status !== 404) fail(label, existing);

  const created = await request(postPath, { method: 'POST', body: JSON.stringify(body) });
  if (!created.ok) fail(label, created);
  console.log(`Created ${label}`);
  return created.body;
}

const tableName = (key) => key.replace(/^./, (x) => x.toUpperCase()).replace(/s$/, key === 'profiles' || key === 'wishes' ? 's' : '');
async function database() { await getOrCreate(`database ${databaseId}`, databasePath, '/tablesdb', { databaseId, name: 'Wishlist', enabled: true }); }
async function table(id, name) { await getOrCreate(`table ${id}`, tablePath(id), `${databasePath}/tables`, { tableId: id, name, permissions: ['create("users")'], rowSecurity: true, enabled: true }); }
async function column(tableId, kind, key, required, extra = {}) { await getOrCreate(`column ${tableId}.${key}`, columnPath(tableId, key), `${tablePath(tableId)}/columns/${kind}`, { key, required, ...extra }); }
async function idx(tableId, key, type, columns, orders) { await getOrCreate(`index ${tableId}.${key}`, indexPath(tableId, key), `${tablePath(tableId)}/indexes`, { key, type, columns, orders }); }
const string = (t, key, required, size = 255, array = false) => column(t, 'string', key, required, { size, array });
const datetime = (t, key, required) => column(t, 'datetime', key, required);
const bool = (t, key, required, xdefault) => column(t, 'boolean', key, required, { default: xdefault });
const integer = (t, key, required) => column(t, 'integer', key, required);

await database();
for (const [keyName, id] of Object.entries(tableIds)) await table(id, tableName(keyName));

const columns = [
  [string,tableIds.profiles,'user_id',true], [string,tableIds.profiles,'display_name',true], [string,tableIds.profiles,'avatar_url',false,2048], [string,tableIds.profiles,'location',false], [string,tableIds.profiles,'bio',false,2000], [string,tableIds.profiles,'offers_text',false,4000], [string,tableIds.profiles,'offer_tags',false,64,true], [string,tableIds.profiles,'contact_email',false], [string,tableIds.profiles,'contact_whatsapp',false], [string,tableIds.profiles,'contact_url',false,2048], [datetime,tableIds.profiles,'created_at',true], [datetime,tableIds.profiles,'updated_at',true],
  [string,tableIds.wishes,'owner_id',true], [string,tableIds.wishes,'owner_name',true], [string,tableIds.wishes,'title',true,180], [string,tableIds.wishes,'slug',true], [string,tableIds.wishes,'description',true,4000], [string,tableIds.wishes,'image_url',false,2048], [string,tableIds.wishes,'visibility',true], [string,tableIds.wishes,'status',true], [string,tableIds.wishes,'location',false], [datetime,tableIds.wishes,'target_date',false], [bool,tableIds.wishes,'accepts_help',true], [datetime,tableIds.wishes,'created_at',true], [datetime,tableIds.wishes,'updated_at',true],
  [string,tableIds.steps,'wish_id',true], [string,tableIds.steps,'owner_id',true], [string,tableIds.steps,'title',true,180], [string,tableIds.steps,'description',false,2000], [integer,tableIds.steps,'position',true], [string,tableIds.steps,'status',true], [string,tableIds.steps,'step_type',false], [datetime,tableIds.steps,'target_date',false], [datetime,tableIds.steps,'created_at',true], [datetime,tableIds.steps,'updated_at',true],
  [string,tableIds.updates,'wish_id',true], [string,tableIds.updates,'actor_id',true], [string,tableIds.updates,'actor_name',true], [string,tableIds.updates,'event_type',true], [string,tableIds.updates,'message',true,2000], [datetime,tableIds.updates,'created_at',true],
  [string,tableIds.help,'wish_id',true], [string,tableIds.help,'step_id',false], [string,tableIds.help,'wish_owner_id',true], [string,tableIds.help,'helper_id',true], [string,tableIds.help,'helper_name',true], [string,tableIds.help,'offer_type',true], [string,tableIds.help,'message',true,2000], [string,tableIds.help,'contact_url',false,2048], [string,tableIds.help,'status',true], [datetime,tableIds.help,'created_at',true], [datetime,tableIds.help,'updated_at',true],
  [string,tableIds.follows,'wish_id',true], [string,tableIds.follows,'user_id',true], [datetime,tableIds.follows,'created_at',true],
];
for (const [fn, ...args] of columns) await fn(...args);

console.log('Waiting for Appwrite to finish processing columns before creating indexes...');
await new Promise((r) => setTimeout(r, 5000));

const indexes = [
  [tableIds.profiles,'user_id_unique','unique',['user_id']],
  [tableIds.wishes,'owner_id','key',['owner_id']], [tableIds.wishes,'slug_unique','unique',['slug']], [tableIds.wishes,'visibility_updated_at','key',['visibility','updated_at'],['ASC','DESC']], [tableIds.wishes,'status_updated_at','key',['status','updated_at'],['ASC','DESC']],
  [tableIds.steps,'wish_id_position','key',['wish_id','position'],['ASC','ASC']], [tableIds.steps,'owner_id','key',['owner_id']],
  [tableIds.updates,'wish_id_created_at','key',['wish_id','created_at'],['ASC','DESC']],
  [tableIds.help,'wish_id_created_at','key',['wish_id','created_at'],['ASC','DESC']], [tableIds.help,'step_id','key',['step_id']], [tableIds.help,'wish_owner_id','key',['wish_owner_id']], [tableIds.help,'helper_id','key',['helper_id']],
  [tableIds.follows,'wish_id_user_id_unique','unique',['wish_id','user_id']], [tableIds.follows,'user_id','key',['user_id']],
];
for (const args of indexes) await idx(...args);

console.log('Wishlist Appwrite TablesDB schema is present. Re-run safely if a resource already existed. Required scopes: databases.write, tables.write, columns.write, indexes.write.');
