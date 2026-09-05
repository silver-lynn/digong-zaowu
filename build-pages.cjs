const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const result=spawnSync(process.execPath,['build.cjs'],{stdio:'inherit',cwd:__dirname});
if(result.status!==0)process.exit(result.status||1);
const origin='https://tiangong-toy-workshop.crafty-lynx-0539.chatgpt.site';
fs.writeFileSync('dist/client/runtime-config.mjs',`export const API_ORIGIN = ${JSON.stringify(origin)};\n`);
fs.writeFileSync('dist/client/.nojekyll','');
console.log('GitHub Pages build ready in dist/client.');
