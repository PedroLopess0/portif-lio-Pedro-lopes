/* ===== CONFIGURAÇÃO (edite aqui) ===== */
// Habilidades: { sigla: "JS", nome: "JavaScript", nota: "texto opcional" }
const SKILLS = [
  { sigla: "</>", nome: "Programação", nota: "Área de estudo" },
  { sigla: "WEB", nome: "Desenvolvimento web", nota: "Área de estudo" },
  { sigla: "TI", nome: "Soluções digitais", nota: "Área de interesse" }
];
// Projetos: { nome, descricao, tecnologias: [], imagem: "url", link: "url", github: "url" }
const PROJECTS = [];
// Endpoint de formulário (ex.: Formspree, Web3Forms). Vazio = envio NÃO configurado.
const FORM_ENDPOINT = "";
/* ===================================== */

const $ = (s, r = document) => r.querySelector(s);
const root = document.documentElement;
function esc(t){ const d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; }
function safeUrl(u){ return /^https?:\/\//i.test(u || "") ? esc(u) : ""; }

/* tema */
try { const t = localStorage.getItem("phpl-tema"); if (t === "light" || t === "dark") root.dataset.theme = t; } catch (e) {}
$("#theme").addEventListener("click", () => {
  const n = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = n;
  try { localStorage.setItem("phpl-tema", n); } catch (e) {}
});

/* menu mobile */
const nav = $("#nav"), burger = $("#burger");
function closeMenu(){ nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
burger.addEventListener("click", () => {
  const o = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(o));
});
nav.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

/* habilidades */
$("#skills").innerHTML = SKILLS.map(s =>
  `<div class="sk rv"><div class="ico" aria-hidden="true">${esc(s.sigla)}</div><div><h3>${esc(s.nome)}</h3>${s.nota ? `<p>${esc(s.nota)}</p>` : ""}</div></div>`
).join("");

/* projetos */
(function(){
  const slots = [0, 1, 2].map(i => PROJECTS[i] || null);
  let h = slots.map((p, i) => {
    if (!p) return `<article class="card rv"><div class="shot"><span class="ph" aria-hidden="true">0${i + 1}</span></div><div class="cb"><h3>Espaço para o projeto ${i + 1}</h3><p>Adicione nome, descrição, tecnologias e links na lista <code>PROJECTS</code>.</p></div></article>`;
    const img = safeUrl(p.imagem), l = safeUrl(p.link), g = safeUrl(p.github);
    return `<article class="card rv"><div class="shot">${img ? `<img src="${img}" alt="Captura de tela de ${esc(p.nome)}" loading="lazy">` : `<span class="ph" aria-hidden="true">0${i + 1}</span>`}</div><div class="cb"><h3>${esc(p.nome)}</h3><p>${esc(p.descricao)}</p><div class="chips">${(p.tecnologias || []).map(t => `<span>${esc(t)}</span>`).join("")}</div><div class="links">${l ? `<a class="btn" href="${l}" target="_blank" rel="noopener">VER PROJETO</a>` : ""}${g ? `<a class="btn o" href="${g}" target="_blank" rel="noopener">GITHUB</a>` : ""}</div></div></article>`;
  }).join("");
  if (!PROJECTS.length) h += `<p class="empty rv">NOVOS PROJETOS EM DESENVOLVIMENTO.</p>`;
  $("#proj").innerHTML = h;
})();

/* formulário */
const f = $("#form"), st = $("#st");
function say(msg, cls){ st.className = "show " + cls; st.textContent = msg; }
function bad(id, eid, msg){ const el = $(id); el.setAttribute("aria-invalid", "true"); $(eid).textContent = msg; return el; }
f.addEventListener("submit", async e => {
  e.preventDefault();
  ["#fn", "#fe", "#fm"].forEach(i => $(i).removeAttribute("aria-invalid"));
  ["#en", "#ee", "#em"].forEach(i => $(i).textContent = "");
  st.className = "";
  const n = $("#fn").value.trim(), m = $("#fe").value.trim(), t = $("#fm").value.trim();
  let first = null;
  if (n.length < 2) first = first || bad("#fn", "#en", "Digite seu nome (mínimo de 2 letras).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) first = first || bad("#fe", "#ee", "Digite um e-mail válido, como nome@exemplo.com.");
  if (t.length < 10) first = first || bad("#fm", "#em", "Escreva uma mensagem com pelo menos 10 caracteres.");
  if (first) { first.focus(); return; }
  if (!FORM_ENDPOINT) {
    say("O envio ainda não está configurado: nenhuma mensagem foi enviada. Defina FORM_ENDPOINT no código com o endereço de um serviço como Formspree ou Web3Forms. Enquanto isso, escreva para 40321@raphaeldisanto.com.br.", "bad");
    return;
  }
  const btn = $("#send"); btn.disabled = true; say("Enviando…", "");
  try {
    const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ nome: n, email: m, mensagem: t }) });
    if (!r.ok) throw new Error("http " + r.status);
    f.reset(); say("Mensagem enviada. Obrigado pelo contato!", "ok");
  } catch (err) {
    say("Não foi possível enviar agora. Tente novamente ou escreva para 40321@raphaeldisanto.com.br.", "bad");
  } finally { btn.disabled = false; }
});

/* rolagem: progresso, topo, link ativo */
const prog = $("#prog"), top = $("#top");
const links = [...document.querySelectorAll("nav a")];
const secs = links.map(a => $(a.getAttribute("href")));
function onScroll(){
  const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (max > 0 ? y / max * 100 : 0) + "%";
  top.classList.toggle("show", y > 600);
  let cur = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < window.innerHeight * .4) cur = i; });
  links.forEach((a, i) => a.classList.toggle("on", i === cur));
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* animações de entrada */
const rvs = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
  rvs.forEach(el => io.observe(el));
} else rvs.forEach(el => el.classList.add("in"));

$("#yr").textContent = new Date().getFullYear();
