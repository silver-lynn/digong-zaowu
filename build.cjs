const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const files=['index.html','workshop.css','game-data.js','workshop.js','legacy.html','styles.css','app.js','adventure.js','model3d.js'];
for(const f of ['game-data.js','workshop.js']) new vm.Script(fs.readFileSync(f,'utf8'),{filename:f});
fs.mkdirSync('dist',{recursive:true});for(const f of files)fs.copyFileSync(f,path.join('dist',f));
console.log('Built static workshop: '+files.length+' files.');
