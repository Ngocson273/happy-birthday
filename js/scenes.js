/* Điều khiển cảnh */
let cur='s1';
function show(id){$(cur).classList.remove('on');cur=id;$(id).classList.add('on')}

/* Nhạc nền + nút bật/tắt (hiện suốt từ đầu đến cuối) */
/* Nếu index.html thiếu thẻ <audio>/nút nhạc thì tự tạo, tránh lỗi */
let bgm=$('bgm');
if(!bgm){bgm=document.createElement('audio');bgm.id='bgm';bgm.loop=true;document.body.appendChild(bgm)}
let mute=$('mute');
if(!mute){
  mute=document.createElement('button');mute.id='mute';mute.textContent='🔇';mute.title='Bật/tắt nhạc';
  mute.style.cssText='position:fixed;right:16px;top:16px;z-index:99;width:44px;height:44px;border:0;border-radius:50%;background:#fffffff0;font-size:20px;cursor:pointer;box-shadow:0 4px 16px #e86da655';
  document.body.appendChild(mute);
}
const musicURL=()=>CONFIG.music==='code'&&typeof makeMusicURL==='function'?makeMusicURL():CONFIG.music;
let wantMusic=true,loaded=false;
function icon(){mute.textContent=(!bgm.paused&&wantMusic)?'🔊':'🔇';mute.classList.toggle('off',bgm.paused||!wantMusic)}
function startMusic(){
  if(!CONFIG.music||!wantMusic)return;
  try{
    if(!loaded){bgm.src=musicURL();bgm.volume=.7;loaded=true}
    const p=bgm.play();
    if(p&&p.then)p.then(icon).catch(icon);else icon();
  }catch(e){toast('Không phát được nhạc: '+e.message)}
}
if(!CONFIG.music)mute.style.display='none';
mute.onclick=()=>{
  if(!CONFIG.music)return;
  if(!loaded||bgm.paused){wantMusic=true;startMusic()}   // đang tắt -> bật
  else{wantMusic=false;bgm.pause()}                       // đang bật -> tắt
  icon();
};
bgm.onplay=bgm.onpause=icon;icon();
let fallback=false;
bgm.onerror=()=>{                                  // file nhạc sai tên/đường dẫn/không đọc được
  if(fallback)return;fallback=true;
  toast('Không tải được "'+CONFIG.music+'" – đang dùng nhạc dự phòng. Kiểm tra tên file trong thư mục audio/');
  try{bgm.src=makeMusicURL();const p=bgm.play();if(p&&p.catch)p.then(icon).catch(icon)}catch(e){}
};

/* S1 → S2 */
let opened=false;
$('s1').onclick=()=>{
  if(opened)return;opened=true;
  startMusic();
  document.body.classList.add('party');show('s2');
};
$('go').onclick=()=>{show('s3');startAlbum()};

/* S3 – album 3D */
const book=$('book');
const leaves=[
  [`<div class="cover"><big>Happy<br>Birthday</big><small>PHOTO ALBUM</small><span>🎁</span></div>`,bgi(PH[0])],
  [bgi(PH[1]),bgi(PH[2])],[bgi(PH[3]),bgi(PH[4])],[bgi(PH[5]),bgi(PH[6])]
];
book.innerHTML=`<div class="pg" style='${bgi(PH[7])}'></div>`+leaves.map((l,k)=>{
  const front=l[0].startsWith('<')?l[0].replace('<div class="cover">','<div class="cover" style="position:absolute;inset:0">'):`<div class="a" style='${l[0]}'></div>`;
  const fr=l[0].startsWith('<')?`<div class="a cover">${l[0].replace(/^<div class="cover">|<\/div>$/g,'')}</div>`:front;
  return `<div class="leaf" data-k="${k}" style="z-index:${20-k}">${fr}<div class="b" style='${l[1]}'></div></div>`;
}).join('');
let flips=0,busy=false;
const TOTAL=book.querySelectorAll('.leaf').length;
async function flip(){
  if(busy||flips>=TOTAL)return;
  busy=true;
  const L=book.querySelectorAll('.leaf')[flips];
  if(flips===0)book.classList.remove('closed');
  L.classList.add('f');
  const k=flips;setTimeout(()=>L.style.zIndex=k+1,550);
  flips++;
  await wait(1250);busy=false;
  if(flips>=TOTAL){                      // hết ảnh: chỉ còn nút lá thư
    const bar=$('bar');bar.classList.add('swap');
    await wait(350);
    bar.innerHTML='<button id="mail" title="Mở thư">✉️</button>';
    bar.classList.remove('swap');
    $('mail').onclick=()=>show('s4');
  }
}
function startAlbum(){}                  // lật ảnh khi bấm, không tự chạy
book.onclick=flip;
$('nx').onclick=e=>{e.stopPropagation();flip()};

/* S4 – phong thư & thư */
$('hrt').onclick=async()=>{
  $('env').classList.add('open');
  await wait(700);
  $('paper').classList.add('show');
  $('env').classList.add('gone');
};
let started=false;
$('ck').onclick=()=>{if(started)return;started=true;show('s5');runLoad()};

/* S5 – tải */
function runLoad(){
  let p=0;const t=setInterval(()=>{
    p=Math.min(100,p+Math.random()*7+2);
    $('pb').style.width=p+'%';$('pct').textContent=Math.floor(p)+'%';
    if(p>=100){clearInterval(t);setTimeout(()=>{show('s6');startFinale()},500)}
  },120);
}
