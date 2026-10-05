const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
function fit(){document.documentElement.style.setProperty('--s',Math.min(1.5,Math.max(.5,Math.min(innerWidth/760,innerHeight/620))))}
fit();addEventListener('resize',fit);
$('sub').textContent = CONFIG.subtitle;

/* Thông báo nhỏ ở đáy màn hình (dùng khi có lỗi) */
window.toast = window.toast || function(m){
  const d=document.createElement('div');d.textContent=m;
  d.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:999;background:#7a1f4b;color:#fff;padding:10px 16px;border-radius:12px;font:14px sans-serif;max-width:90vw;text-align:center';
  document.body.appendChild(d);setTimeout(()=>d.remove(),7000);
};
