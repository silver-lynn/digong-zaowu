const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const files=['index.html','workshop.css','art-v3.css','game-data.js','workshop.js','legacy.html','styles.css','app.js','adventure.js','model3d.js'];
for(const f of ['game-data.js','workshop.js']) new vm.Script(fs.readFileSync(f,'utf8'),{filename:f});
fs.mkdirSync('dist',{recursive:true});for(const f of files)fs.copyFileSync(f,path.join('dist',f));
fs.mkdirSync('dist/assets',{recursive:true});
for(const name of ['courtyard-v2.webp','aqiao-v2.webp','props-v3.png'])fs.copyFileSync(path.join('assets',name),path.join('dist/assets',name));
fs.mkdirSync('dist/assets/fonts',{recursive:true});
for(const name of ['noto-serif-sc-display.ttf','OFL.txt'])fs.copyFileSync(path.join('assets/fonts',name),path.join('dist/assets/fonts',name));
console.log('Built static workshop: '+files.length+' files.');
