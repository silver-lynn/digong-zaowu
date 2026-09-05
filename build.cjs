const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const files=['index.html','palace.css','palace-data.js','palace.mjs','palace-world.mjs','palace-models.mjs','palace-craft.mjs','workshop.html','workshop.css','art-v3.css','game-data.js','workshop.js','legacy.html','styles.css','app.js','adventure.js','model3d.js'];
for(const f of ['game-data.js','workshop.js','palace-data.js']) new vm.Script(fs.readFileSync(f,'utf8'),{filename:f});
for(const f of files.filter(f=>f.endsWith('.mjs'))){const r=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr||'Module check failed: '+f)}
const output=path.resolve(__dirname,'dist');if(path.dirname(output)!==__dirname||path.basename(output)!=='dist')throw new Error('Unsafe build target');if(fs.existsSync(output)&&fs.lstatSync(output).isSymbolicLink())throw new Error('Build target must not be a link');fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});for(const f of files)fs.copyFileSync(f,path.join(output,f));
fs.mkdirSync('dist/assets',{recursive:true});
for(const name of ['courtyard-v2.webp','aqiao-v2.webp','props-v3.png'])fs.copyFileSync(path.join('assets',name),path.join('dist/assets',name));
fs.mkdirSync('dist/assets/fonts',{recursive:true});
for(const name of ['noto-serif-sc-display.ttf','palace-display.ttf','OFL.txt'])fs.copyFileSync(path.join('assets/fonts',name),path.join('dist/assets/fonts',name));
fs.mkdirSync('dist/vendor/three',{recursive:true});for(const name of ['three.module.js','three.core.js','OrbitControls.js','LICENSE','package.json'])fs.copyFileSync(path.join('vendor/three',name),path.join('dist/vendor/three',name));
console.log('Built complete palace and preserved workshop: '+files.length+' application files.');
