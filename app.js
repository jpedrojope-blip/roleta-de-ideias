const defaultIdeas = [
  { name: "Clínicas de saúde e estética", offer: "Site + agendamento online + lembretes por WhatsApp." },
  { name: "Restaurantes e delivery", offer: "Cardápio digital + pedidos próprios pelo WhatsApp." },
  { name: "Escritórios de advocacia", offer: "Site profissional + blog SEO + landing pages por área." },
  { name: "Imobiliárias e corretores", offer: "Catálogo de imóveis + landing pages + CRM de leads." },
  { name: "Barbearias e salões", offer: "Agendamento online + clube de corte + fidelidade." },
  { name: "Academias e personal trainers", offer: "Gestão de alunos + pagamentos + área de treinos." },
  { name: "Contabilidades", offer: "Portal do cliente + envio de documentos + automação." },
  { name: "Oficinas e assistências técnicas", offer: "Ordens de serviço + estoque + orçamento por WhatsApp." },
  { name: "Lojas e varejo local", offer: "Loja virtual + catálogo + integração com Instagram." },
  { name: "Escolas e professores", offer: "Matrículas online + área de membros + gestão." },
  { name: "Mercados", offer: "Catálogo digital + pedidos pelo WhatsApp + presença local." },
  { name: "Construtoras", offer: "Landing pages de empreendimentos + captação de leads." },
  { name: "Lojas de roupas", offer: "Loja virtual + catálogo para Instagram e WhatsApp." },
  { name: "Aulas de dança", offer: "Matrículas online + agenda de turmas + pagamentos." },
  { name: "Cursinhos", offer: "Matrículas online + área de aulas + gestão de alunos." }
];

const wheelLabels = {
  "Clínicas de saúde e estética": "Clínicas",
  "Restaurantes e delivery": "Restaurantes",
  "Escritórios de advocacia": "Advocacia",
  "Imobiliárias e corretores": "Imobiliárias",
  "Barbearias e salões": "Barbearias",
  "Academias e personal trainers": "Academias",
  "Contabilidades": "Contabilidade",
  "Oficinas e assistências técnicas": "Oficinas",
  "Lojas e varejo local": "Varejo local",
  "Escolas e professores": "Escolas",
  "Mercados": "Mercados",
  "Construtoras": "Construtoras",
  "Lojas de roupas": "Roupas",
  "Aulas de dança": "Dança",
  "Cursinhos": "Cursinhos"
};

const state = { ideas: [...defaultIdeas], angle: 0, spinning: false, sound: true };
const rotor = document.querySelector("#wheel-rotor");
const wheel = document.querySelector("#wheel");
const itemList = document.querySelector("#item-list");
const itemCount = document.querySelector("#item-count");
const panelCount = document.querySelector("#panel-count");
const newItem = document.querySelector("#new-item");
const spinButton = document.querySelector("#spin-button");
const stageMessage = document.querySelector("#stage-message");
const resultCard = document.querySelector("#result-card");
const resultTitle = document.querySelector("#result-title");
const resultOffer = document.querySelector("#result-offer");
const itemsPanel = document.querySelector("#items-panel");
const panelBackdrop = document.querySelector("#panel-backdrop");
const itemsToggle = document.querySelector("#items-toggle");
const toast = document.querySelector("#toast");
let toastTimer;

function escapeXml(value) {
  return value.replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char]));
}

function polar(cx, cy, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function sectorPath(cx, cy, radius, startAngle, endAngle) {
  const start = polar(cx, cy, radius, endAngle);
  const end = polar(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function renderWheel() {
  wheel.setAttribute("aria-label", state.ideas.length
    ? `Roleta com ${state.ideas.length} ideias de negócio`
    : "Roleta sem itens");
  if (!state.ideas.length) {
    rotor.innerHTML = `<circle cx="260" cy="260" r="232" fill="#fff"/><circle cx="260" cy="260" r="225" fill="#eeecff" stroke="#d7d5ef" stroke-width="2"/><text x="260" y="246" fill="#6366f1" font-size="18" font-weight="800" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif">Sem itens</text><text x="260" y="274" fill="#777394" font-size="12" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif">Abra Itens para adicionar</text>`;
    return;
  }
  const colors = [
    { fill: "#35AA76", text: "#070707" },
    { fill: "#3EF284", text: "#070707" },
    { fill: "#08AF7B", text: "#070707" },
    { fill: "#070707", text: "#3EF284" }
  ];
  const count = state.ideas.length;
  const step = 360 / count;
  const center = 260;
  const outer = 225;
  const textRadius = count > 12 ? 176 : 162;
  const fontSize = count > 12 ? 10.5 : count > 8 ? 12 : 14;
  const maxLabelWidth = count > 12 ? 56 : 84;
  const parts = [
    `<circle cx="${center}" cy="${center}" r="232" fill="#fff"/>`,
    `<circle cx="${center}" cy="${center}" r="228" fill="none" stroke="#bcc9f3" stroke-width="2"/>`,
    `<circle cx="${center}" cy="${center}" r="220" fill="none" stroke="#ffffff" stroke-opacity=".72" stroke-width="2"/>`
  ];

  state.ideas.forEach((idea, index) => {
    const startAngle = index * step;
    const endAngle = (index + 1) * step;
    const midAngle = startAngle + step / 2;
    const textPoint = polar(center, center, textRadius, midAngle);
    const normalized = ((midAngle + 90) % 360 + 360) % 360;
    const textRotation = normalized > 180 ? midAngle + 180 : midAngle;
    const label = wheelLabels[idea.name] || (idea.name.length > 16 ? `${idea.name.slice(0, 15)}…` : idea.name);
    const palette = colors[index % colors.length];
    const estimatedWidth = label.length * fontSize * .58;
    const textFit = estimatedWidth > maxLabelWidth
      ? ` textLength="${maxLabelWidth}" lengthAdjust="spacingAndGlyphs"`
      : "";
    const dot = polar(center, center, outer - 4, startAngle);
    parts.push(`<g><title>${escapeXml(idea.name)} — ${escapeXml(idea.offer)}</title><path d="${sectorPath(center, center, outer, startAngle, endAngle)}" fill="${palette.fill}" stroke="#fff" stroke-width="2.5"/><text x="${textPoint.x}" y="${textPoint.y}" transform="rotate(${textRotation} ${textPoint.x} ${textPoint.y})" fill="${palette.text}" font-size="${fontSize}" font-weight="800" letter-spacing="-.02em" text-anchor="middle" dominant-baseline="middle" font-family="Plus Jakarta Sans, Arial, sans-serif"${textFit}>${escapeXml(label)}</text></g>`);
    parts.push(`<circle cx="${dot.x}" cy="${dot.y}" r="3" fill="#fff" opacity=".8"/>`);
  });
  parts.push(`<circle cx="${center}" cy="${center}" r="81" fill="#fff"/>`);
  parts.push(`<circle cx="${center}" cy="${center}" r="71" fill="#f4fff9" stroke="#b7e7cd" stroke-width="2"/>`);
  parts.push(`<g transform="translate(${center - 31} ${center - 31})"><rect width="62" height="62" rx="15" fill="#070707"/><text x="6" y="45" fill="#3EF284" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="-5">N</text><text x="29" y="45" fill="#35AA76" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="-5">G</text></g>`);
  rotor.innerHTML = parts.join("");
}

function persist() {
  localStorage.setItem("roleta-de-ideias", JSON.stringify(state.ideas));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function renderItems() {
  itemCount.textContent = state.ideas.length;
  panelCount.textContent = state.ideas.length;
  itemList.replaceChildren();
  if (!state.ideas.length) {
    const empty = document.createElement("li");
    empty.className = "empty-list";
    empty.textContent = "Nenhum item ainda. Adicione sua primeira ideia acima.";
    itemList.append(empty);
    renderWheel();
    persist();
    return;
  }
  state.ideas.forEach((idea, index) => {
    const row = document.createElement("li");
    row.className = "item-row";
    const number = document.createElement("span");
    number.className = "item-index";
    number.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = idea.name;
    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.type = "button";
    remove.setAttribute("aria-label", `Remover ${idea.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => removeItem(index));
    row.append(number, name, remove);
    itemList.append(row);
  });
  renderWheel();
  persist();
}

function addItem(event) {
  event.preventDefault();
  const name = newItem.value.trim();
  if (!name) { newItem.focus(); return; }
  if (state.ideas.some((idea) => idea.name.toLowerCase() === name.toLowerCase())) {
    showToast("Esse item já está na roleta.");
    newItem.select();
    return;
  }
  state.ideas.push({ name, offer: "Transforme esta ideia em uma oferta específica e valide com três clientes." });
  newItem.value = "";
  renderItems();
  showToast("Item adicionado.");
  newItem.focus();
}

function removeItem(index) {
  const [removed] = state.ideas.splice(index, 1);
  renderItems();
  showToast(`${removed.name} removido.`);
}

function shuffleItems() {
  for (let index = state.ideas.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [state.ideas[index], state.ideas[swap]] = [state.ideas[swap], state.ideas[index]];
  }
  renderItems();
  showToast("Itens misturados.");
}

function clearItems() {
  state.ideas = [];
  resultTitle.textContent = "Adicione um item";
  resultOffer.textContent = "Abra a aba Itens para continuar.";
  resultCard.classList.remove("has-result");
  renderItems();
  showToast("Roleta limpa.");
}

function spin() {
  if (state.spinning) return;
  if (!state.ideas.length) {
    showToast("Adicione pelo menos um item para girar.");
    openPanel();
    newItem.focus();
    return;
  }
  state.spinning = true;
  spinButton.disabled = true;
  spinButton.querySelector("span").textContent = "Girando...";
  stageMessage.textContent = "A roda está escolhendo...";
  resultCard.classList.remove("has-result");
  const winnerIndex = Math.floor(Math.random() * state.ideas.length);
  const step = 360 / state.ideas.length;
  // Pointer sits at 3 o'clock (90deg); include prior rotation for repeat spins.
  const currentAngle = ((state.angle % 360) + 360) % 360;
  const desiredAngle = winnerIndex * step + step / 2;
  const delta = (90 - desiredAngle - currentAngle + 360) % 360;
  const target = 360 * 6 + delta;
  state.angle += target;
  rotor.style.transform = `rotate(${state.angle}deg)`;
  setTimeout(() => {
    const winner = state.ideas[winnerIndex];
    resultTitle.textContent = winner.name;
    resultOffer.textContent = winner.offer;
    resultCard.classList.add("has-result");
    stageMessage.textContent = "Ideia escolhida — bora validar?";
    spinButton.disabled = false;
    spinButton.querySelector("span").textContent = "Girar";
    state.spinning = false;
    showToast(`Sua próxima ideia: ${winner.name}`);
  }, 4850);
}

function openPanel() {
  itemsPanel.classList.add("is-open");
  itemsPanel.inert = false;
  itemsPanel.setAttribute("aria-hidden", "false");
  itemsToggle.setAttribute("aria-expanded", "true");
  panelBackdrop.hidden = false;
  requestAnimationFrame(() => newItem.focus());
}

function closePanel() {
  itemsPanel.classList.remove("is-open");
  itemsPanel.inert = true;
  itemsPanel.setAttribute("aria-hidden", "true");
  itemsToggle.setAttribute("aria-expanded", "false");
  panelBackdrop.hidden = true;
}

function toggleFullscreen() {
  const stage = document.querySelector(".wheel-card");
  if (!document.fullscreenElement) stage.requestFullscreen?.();
  else document.exitFullscreen?.();
}

itemsToggle.addEventListener("click", openPanel);
document.querySelector("#items-close").addEventListener("click", closePanel);
document.querySelector("#items-done").addEventListener("click", closePanel);
panelBackdrop.addEventListener("click", closePanel);
document.querySelector("#add-form").addEventListener("submit", addItem);
spinButton.addEventListener("click", spin);
wheel.addEventListener("click", spin);

document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
  if (button.dataset.action === "shuffle") shuffleItems();
  if (button.dataset.action === "clear") clearItems();
  if (button.dataset.action === "fullscreen") toggleFullscreen();
  if (button.dataset.action === "sound") {
    state.sound = !state.sound;
    button.setAttribute("aria-label", state.sound ? "Som ligado" : "Som desligado");
    button.style.opacity = state.sound ? "1" : ".55";
    showToast(state.sound ? "Som ligado." : "Som desligado.");
  }
}));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanel();
  if (event.code === "Space" && document.activeElement.tagName !== "INPUT" && !itemsPanel.classList.contains("is-open")) {
    event.preventDefault();
    spin();
  }
});

const saved = localStorage.getItem("roleta-de-ideias");
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      state.ideas = parsed.filter((item) => item?.name);
      const newDefaultNames = ["Mercados", "Construtoras", "Lojas de roupas", "Aulas de dança", "Cursinhos"];
      defaultIdeas
        .filter((idea) => newDefaultNames.includes(idea.name))
        .forEach((idea) => {
          if (!state.ideas.some((savedIdea) => savedIdea.name.toLowerCase() === idea.name.toLowerCase())) {
            state.ideas.push(idea);
          }
        });
    }
  } catch { localStorage.removeItem("roleta-de-ideias"); }
}
itemsPanel.inert = true;
renderItems();
