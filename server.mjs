import {sanitizeCampaign} from './chronicle-data.mjs';
import {sanitizeWork} from './atelier-data.mjs';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const PUBLIC_GAME_ORIGIN='https://silver-lynn.github.io';
const digestIdentity=async(prefix,value)=>prefix+Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),n=>n.toString(16).padStart(2,'0')).join('');
export async function accountIdentity(request){
 const origin=request.headers.get('Origin'),crossOrigin=origin&&origin!==new URL(request.url).origin;
 // The hosting gateway validates platform headers. Cross-origin visitors use only their guest key.
 if(!crossOrigin){const id=request.headers.get('oai-authenticated-user-id');if(id)return 'id:'+id;const email=request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();if(email&&email.length<=320&&email.includes('@'))return digestIdentity('email:',email)}
 const token=request.headers.get('X-Digong-Guest');
 return /^[a-f0-9]{64}$/.test(token||'')?digestIdentity('guest:',token):null;
}
export function repository(db,owner){return {
 list:()=>db.prepare('SELECT key, value, revision, updated FROM tiangong_records WHERE owner = ? ORDER BY updated DESC LIMIT 260').bind(owner).all(),
 put:async(key,value,revision)=>{const now=Date.now(),data=JSON.stringify(value);if(revision===0)return db.prepare('INSERT INTO tiangong_records (owner, key, value, revision, updated) SELECT ?, ?, ?, 1, ? WHERE (SELECT count(*) FROM tiangong_records WHERE owner = ?) < 260 ON CONFLICT (owner, key) DO NOTHING RETURNING revision, updated').bind(owner,key,data,now,owner).first();return db.prepare('UPDATE tiangong_records SET value = ?, revision = revision + 1, updated = ? WHERE owner = ? AND key = ? AND revision = ? RETURNING revision, updated').bind(data,now,owner,key,revision).first()},
 resetAll:()=>db.prepare('DELETE FROM tiangong_records WHERE owner = ? RETURNING key').bind(owner).all(),
 remove:(key,revision)=>db.prepare('DELETE FROM tiangong_records WHERE owner = ? AND key = ? AND revision = ? RETURNING key').bind(owner,key,revision).first()
}}
export async function api(request,env){
 const url=new URL(request.url),origin=request.headers.get('Origin');
 if(origin&&origin!==url.origin&&origin!==PUBLIC_GAME_ORIGIN)return json({error:'origin_mismatch'},403);
 if(request.headers.get('Sec-Fetch-Site')==='cross-site'&&origin!==PUBLIC_GAME_ORIGIN)return json({error:'origin_mismatch'},403);
 let response;
 if(request.method==='OPTIONS'){
  if(url.pathname!=='/api/records')return json({error:'not_found'},404);
  const method=request.headers.get('Access-Control-Request-Method');
  const headers=(request.headers.get('Access-Control-Request-Headers')||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);
  if(!['GET','PUT','DELETE'].includes(method)||headers.some(h=>!['content-type','x-digong-guest'].includes(h)))return json({error:'invalid_preflight'},403);
  response=new Response(null,{status:204,headers:{'Access-Control-Allow-Methods':'GET, PUT, DELETE','Access-Control-Allow-Headers':'Content-Type, X-Digong-Guest','Access-Control-Max-Age':'600'}});
 }else try{response=await recordsApi(request,env)}catch{response=json({error:'temporarily_unavailable'},503)}
 if(origin===PUBLIC_GAME_ORIGIN){response.headers.set('Access-Control-Allow-Origin',origin);response.headers.set('Vary','Origin')}
 return response;
}
async function recordsApi(request,env){const url=new URL(request.url);if(url.pathname!=='/api/records')return json({error:'not_found'},404);const owner=await accountIdentity(request);if(!owner)return json({error:'identity_required'},401);if(!env.DB)return json({error:'storage_unavailable'},503);const repo=repository(env.DB,owner);if(request.method==='GET'){const rows=await repo.list();return json({scope:owner,records:rows.results.map(r=>({...r,value:JSON.parse(r.value)}))})}
 if(!['PUT','DELETE'].includes(request.method))return json({error:'method_not_allowed'},405);if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'json_required'},415);if(Number(request.headers.get('Content-Length'))>65536)return json({error:'too_large'},413);const body=await request.text();if(body.length>65536)return json({error:'too_large'},413);let input;try{input=JSON.parse(body)}catch{return json({error:'invalid_json'},400)}if(request.method==='DELETE'&&input?.resetAll===true){if(input.scope!==owner||input.confirmation!=='RESET_ALL_ARCHIVES')return json({error:'reset_confirmation_required'},403);await repo.resetAll();return json({reset:true})}if(!input||typeof input.key!=='string'||!/^((campaign-[0-3])|draft|(work-[a-zA-Z0-9-]{1,90}))$/.test(input.key)||!Number.isSafeInteger(input.revision)||input.revision<0)return json({error:'invalid_record'},400);
 if(request.method==='DELETE'){if(!input.key.startsWith('work-'))return json({error:'invalid_record'},400);const deleted=await repo.remove(input.key,input.revision);return deleted?json({deleted:true}):json({error:'conflict'},409)}let value;try{value=input.key.startsWith('campaign-')?sanitizeCampaign(input.value):sanitizeWork(input.value)}catch{return json({error:'invalid_value'},400)}if(!value||input.key.startsWith('work-')&&!value.nodes.length||input.key.startsWith('campaign-')&&Number(input.key.slice(-1))!==value.era)return json({error:'invalid_value'},400);const saved=await repo.put(input.key,value,input.revision);return saved?json(saved):json({error:'conflict_or_capacity'},409)
}
export default {async fetch(request,env){try{if(new URL(request.url).pathname.startsWith('/api/'))return await api(request,env);return await env.ASSETS.fetch(request)}catch{return json({error:'temporarily_unavailable'},503)}}};
