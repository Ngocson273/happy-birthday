/* Ảnh mẫu: tự vẽ SVG (thay bằng ảnh thật qua CONFIG.photos) */
function mock(i){
  const h=(330+i*23)%360, s=`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},70%,82%)"/><stop offset="1" stop-color="hsl(${h+30},60%,62%)"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><ellipse cx="150" cy="420" rx="120" ry="130" fill="hsl(${h},35%,95%)"/><path d="M95 170Q95 70 150 70Q205 70 205 170L215 270Q150 230 85 270Z" fill="#2b1a22"/><circle cx="150" cy="155" r="48" fill="#f7d9c8"/><path d="M104 150Q150 80 196 150Q150 120 104 150Z" fill="#2b1a22"/><text x="150" y="385" text-anchor="middle" font-size="22" fill="#fff" font-family="sans-serif">Ảnh ${i+1}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
}
const N = 12;
const PH = Array.from({length:N},(_,i)=>CONFIG.photos.length?CONFIG.photos[i%CONFIG.photos.length]:mock(i));
const bgi = u => `background-image:url("${u}")`;
