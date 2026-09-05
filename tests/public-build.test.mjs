import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {archiveRequest,guestToken} from '../archive-request.mjs';
test('public archive client uses a persistent private guest key, never a URL credential',async()=>{
 const originalFetch=globalThis.fetch,originalStorage=globalThis.localStorage,values=new Map();
 globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 const calls=[];globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response('{}')};
 try{await archiveRequest({method:'PUT',headers:{'Content-Type':'application/json'},body:'{}'});await archiveRequest();
  const token=guestToken();assert.match(token,/^[a-f0-9]{64}$/);assert.equal(values.get('digong-zaowu-guest-v1'),token);
  assert.ok(calls.every(c=>!c.url.includes(token)&&c.options.headers['X-Digong-Guest']===token));assert.equal(calls[0].options.headers['Content-Type'],'application/json');
 }finally{globalThis.fetch=originalFetch;globalThis.localStorage=originalStorage}
});
test('game entries and module assets resolve below a GitHub project path',()=>{
 const root='https://silver-lynn.github.io/digong-zaowu/';
 for(const f of ['index.html','palace-v2.html','workshop.html','legacy.html']){
  const source=fs.readFileSync(f,'utf8');assert.ok(source.includes('地宫造物'),f);
  for(const match of source.matchAll(/(?:src|href)="([^"]+)"/g)){
   const ref=match[1];if(/^(?:https?:|#|data:)/.test(ref))continue;
   assert.ok(new URL(ref,root).href.startsWith(root),ref);assert.ok(fs.existsSync(ref.split(/[?#]/)[0]),ref);
  }
 }
});
