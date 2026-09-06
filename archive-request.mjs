import {API_ORIGIN} from './runtime-config.mjs?v=433f66e85192';

const IDENTITY_KEY='digong-zaowu-guest-v1';
let sessionToken;
export function guestToken(){
 if(sessionToken)return sessionToken;
 try{const stored=localStorage.getItem(IDENTITY_KEY);if(/^[a-f0-9]{64}$/.test(stored||''))return sessionToken=stored}catch{}
 const bytes=crypto.getRandomValues(new Uint8Array(32));
 sessionToken=Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');
 try{localStorage.setItem(IDENTITY_KEY,sessionToken)}catch{/* The session still works; export a backup before closing. */}
 return sessionToken;
}
export function archiveRequest(options={}){
 return fetch(API_ORIGIN+'/api/records',{
  ...options,credentials:API_ORIGIN?'omit':'same-origin',
  headers:{...options.headers,'X-Digong-Guest':guestToken()}
 });
}
