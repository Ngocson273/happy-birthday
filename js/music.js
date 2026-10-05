/* Nhạc viết bằng code (không cần file mp3).
   Dùng: trong js/config.js đặt  music: 'code'  */
function makeMusicURL() {
  const sr = 22050, beat = 0.55;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);          // số nốt MIDI -> tần số
  const G4 = 67, A4 = 69, B4 = 71, C5 = 72, D5 = 74, E5 = 76, F5 = 77, G5 = 79;
  /* Giai điệu Happy Birthday: [nốt, số phách] — sửa ở đây để đổi bài */
  const mel = [
    [G4,.75],[G4,.25],[A4,1],[G4,1],[C5,1],[B4,2],
    [G4,.75],[G4,.25],[A4,1],[G4,1],[D5,1],[C5,2],
    [G4,.75],[G4,.25],[G5,1],[E5,1],[C5,1],[B4,1],[A4,1],
    [F5,.75],[F5,.25],[E5,1],[C5,1],[D5,1],[C5,2]
  ];
  const beats = mel.reduce((s, n) => s + n[1], 0);
  const buf = new Float32Array(Math.floor((beats * beat + 3) * sr));
  const bell = (m, start, dur, amp) => {                      // âm sắc hộp nhạc
    const f = hz(m), n = Math.floor(dur * sr), i0 = Math.floor(start * sr);
    for (let i = 0; i < n && i0 + i < buf.length; i++) {
      const t = i / sr;
      const s = Math.sin(2*Math.PI*f*t) + .4*Math.sin(4*Math.PI*f*t) + .25*Math.sin(6.02*Math.PI*f*t) + .12*Math.sin(8.4*Math.PI*f*t);
      buf[i0 + i] += amp * s * Math.exp(-t * 3.2) * Math.min(1, t * 400);
    }
  };
  let t0 = 0;
  mel.forEach(([m, b]) => { bell(m, t0, 2.2, .3); t0 += b * beat; });          // giai điệu
  for (let bar = 0; bar <= beats / 3; bar++)                                    // nền nhẹ
    [48, 55, 60].forEach((m, k) => bell(m, (bar * 3 + k) * beat, 1.2, .12));
  let mx = 0; for (const v of buf) mx = Math.max(mx, Math.abs(v));
  /* đóng gói thành file WAV trong bộ nhớ */
  const wav = new DataView(new ArrayBuffer(44 + buf.length * 2)), w = (o, s) => [...s].forEach((c, i) => wav.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); wav.setUint32(4, 36 + buf.length * 2, true); w(8, 'WAVEfmt ');
  wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true);
  wav.setUint32(24, sr, true); wav.setUint32(28, sr * 2, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true);
  w(36, 'data'); wav.setUint32(40, buf.length * 2, true);
  buf.forEach((v, i) => wav.setInt16(44 + i * 2, Math.max(-1, Math.min(1, v / (mx * 1.1))) * 32767, true));
  return URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
}
