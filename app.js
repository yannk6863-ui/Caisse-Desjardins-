const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const fmtXOF = (n) => new Intl.NumberFormat("fr-FR").format(n) + " $ CAD";

const DEMO = {
  bank: {
    name: "Caisse Desjardins des Rivières",
    address: "2287 avenue Chauveau, Québec (QC) G2C 0G7, Canada 🇨🇦",
    phone: "1-877-842-1214",
  },
  customer: {
    name: "Lyne Proulx",
    accountMasked: "815-20359-391967-7",
    accountLast: "967-7",
    cardMasked: "4540023590444593",
    birth: "06/06/1955",
    birthplace: "Montmagny, Québec",
    address: "2061 rue de la Presqu’ile, app. 204",
    lastLogin: "27/02/2026 19:42",
  },
  account: {
    label: "Compte courant",
    status: "Actif",
    available: 121000,
    currency: "CAD",
  },
  ops: [
    { date: "27/02/2026", label: "Virement recu de Interpol Wallet remboursement", amount: +121000.00 },
  ]
};

function setRoute(route){
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.route === route));
  render(route);
}

function card(colSpan, title, innerHtml){
  const el = document.createElement("div");
  el.className = "card";
  el.style.gridColumn = `span ${colSpan}`;
  el.innerHTML = `<h3>${title}</h3>${innerHtml}`;
  return el;
}

function money(n){
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" }).format(n);
}

function renderDashboard(view){
  view.appendChild(card(7, "Aperçu", `
    <div class="badge">✅ ${DEMO.account.status} • ${DEMO.account.label}</div>
    <div style="margin-top:10px" class="big">${money(DEMO.account.available)}</div>
    <div style="color: var(--muted); margin-top:6px; font-size:13px;">Solde disponible</div>

    <div class="kpis">
      <div class="kpi-row"><span>No de compte (masqué)</span><strong>${DEMO.customer.accountMasked}</strong></div>
      <div class="kpi-row"><span>No de carte (masqué)</span><strong>${DEMO.customer.cardMasked}</strong></div>
      <div class="kpi-row"><span>Tél. Caisse</span><strong>${DEMO.bank.phone}</strong></div>
    </div>
  `));

  view.appendChild(card(5, "Actions rapides", `
    <div class="kpis">
      <div class="kpi-row"><span>Virement</span><strong></strong></div>
      <div class="kpi-row"><span>Verrouiller carte</span><strong></strong></div>
      <div class="kpi-row"><span>Ajouter bénéficiaire</span><strong></strong></div>
    </div>
    <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
      <button class="btn subtle" onclick="showModal('Virement', 'Virement simulé. En production: validation + OTP.')">Nouveau virement</button>
      <button class="btn subtle" onclick="showModal('Carte', 'Carte verrouillée.')">Verrouiller carte</button>
    </div>
  `));

  const ops = DEMO.ops.slice(0,4);
  view.appendChild(card(12, "Dernières opérations", `
    <table class="table">
      <thead><tr><th>Date</th><th>Libellé</th><th>Montant</th></tr></thead>
      <tbody>
        ${ops.map(o => `
          <tr>
            <td>${o.date}</td>
            <td>${o.label}</td>
            <td class="${o.amount >= 0 ? "pos" : "neg"}">${o.amount >= 0 ? "+" : ""}${money(Math.abs(o.amount))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `));
}

function renderHistory(view){
  const ops = DEMO.ops;
  view.appendChild(card(12, "Historique des opérations", `
    <table class="table">
      <thead><tr><th>Date</th><th>Libellé</th><th>Montant</th></tr></thead>
      <tbody>
        ${ops.map(o => `
          <tr>
            <td>${o.date}</td>
            <td>${o.label}</td>
            <td class="${o.amount >= 0 ? "pos" : "neg"}">${o.amount >= 0 ? "+" : ""}${money(Math.abs(o.amount))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `));
}

function renderTransfers(view){
  view.appendChild(card(7, "Nouveau virement", `
    <div style="display:grid; gap:10px;">
      <label style="color:var(--muted); font-size:13px;">Bénéficiaire
        <input placeholder="Ex : Entreprise" />
      </label>
      <label style="color:var(--muted); font-size:13px;">Compte bénéficiaire
        <input placeholder="****-****-****" />
      </label>
      <label style="color:var(--muted); font-size:13px;">Montant (CAD)
        <input type="number" placeholder="50" />
      </label>
      <button class="btn primary" id="send-transfer">Envoyer</button>
      <div style="font-size:12px; color:var(--muted);">
        En production : confirmation + OTP.
      </div>
    </div>
  `));

  view.appendChild(card(5, "Infos Caisse", `
    <div class="kpis">
      <div class="kpi-row"><span>Nom</span><strong>${DEMO.bank.name}</strong></div>
      <div class="kpi-row"><span>Adresse</span><strong>${DEMO.bank.address}</strong></div>
      <div class="kpi-row"><span>Téléphone</span><strong>${DEMO.bank.phone}</strong></div>
    </div>
  `));

  $("#send-transfer")?.addEventListener("click", () => {
    showModal("Virement", "Virement simulé envoyé.");
  });
}

function renderCards(view){
  view.appendChild(card(12, "Carte bancaire", `
    <div class="badge">💳 Carte • ${DEMO.customer.cardMasked}</div>
    <div class="kpis" style="margin-top:12px;">
      <div class="kpi-row"><span>Nom</span><strong>${DEMO.customer.name}</strong></div>
      <div class="kpi-row"><span>Statut</span><strong>Active</strong></div>
      <div class="kpi-row"><span>Support</span><strong>${DEMO.bank.phone}</strong></div>
    </div>
    <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
      <button class="btn subtle" onclick="showModal('Carte', 'Action simulée : verrouillage.')">Verrouiller</button>
      <button class="btn subtle" onclick="showModal('Carte', 'Action simulée : opposition.')">Faire opposition</button>
    </div>
  `));
}

function renderProfile(view){
  view.appendChild(card(12, "Profil", `
    <div class="badge">👤 ${DEMO.customer.name}</div>
    <div class="kpis">
      <div class="kpi-row"><span>No de compte</span><strong>${DEMO.customer.accountMasked}</strong></div>
      <div class="kpi-row"><span>Adresse</span><strong>${DEMO.customer.address}</strong></div>
      <div class="kpi-row"><span>Née le</span><strong>${DEMO.customer.birth}</strong></div>
      <div class="kpi-row"><span>À</span><strong>${DEMO.customer.birthplace}</strong></div>
    </div>
    <div style="font-size:12px; color:var(--muted); margin-top:10px;">
       Données masquées / fictives pour maquette.
    </div>
  `));
}

function renderMessages(view){
  view.appendChild(card(12, "Messagerie sécurisée", `
    <div class="kpis">
      <div class="kpi-row"><span>27/02/2026</span><strong>Bienvenue</strong></div>
      <div style="color:var(--muted); font-size:13px; margin-top:6px;">
        Ceci est une . Les messages seraient fournis par le support en production.
      </div>
    </div>
    <div style="display:grid; gap:10px; margin-top:14px;">
      <input placeholder="Écrire un message…" />
      <button class="btn primary" onclick="showModal('Message', 'Message envoyé.')">Envoyer</button>
    </div>
  `));
}

function renderSettings(view){
  view.appendChild(card(12, "Sécurité", `
    <div class="badge">🔒 Recommandations</div>
    <ul>
      <li>Ne partagez jamais votre mot de passe.</li>
      <li>Activez la double authentification (OTP).</li>
      <li>Vérifiez les appareils connectés.</li>
    </ul>
    <div class="kpis">
      <div class="kpi-row"><span>Dernière connexion</span><strong>${DEMO.customer.lastLogin}</strong></div>
      <div class="kpi-row"><span>Support</span><strong>${DEMO.bank.phone}</strong></div>
    </div>
  `));
}

function render(route){
  const view = $("#view");
  view.innerHTML = "";
  if(route === "dashboard") return renderDashboard(view);
  if(route === "history") return renderHistory(view);
  if(route === "transfers") return renderTransfers(view);
  if(route === "cards") return renderCards(view);
  if(route === "profile") return renderProfile(view);
  if(route === "messages") return renderMessages(view);
  if(route === "settings") return renderSettings(view);
  view.appendChild(card(12, "Page", `<p>Route inconnue : ${route}</p>`));
}

function showModal(title, html){
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = html;
  $("#modal").classList.remove("hidden");
}
function closeModal(){ $("#modal").classList.add("hidden"); }

function boot(){
  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#screen-login").classList.add("hidden");
    $("#screen-app").classList.remove("hidden");
    $("#customer-name").textContent = DEMO.customer.name;
    $("#customer-meta").textContent = `No de compte: ${DEMO.customer.accountMasked} • Carte: ${DEMO.customer.cardMasked}`;
    setRoute("dashboard");
  });

  $$(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => setRoute(btn.dataset.route));
  });

  $("#search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const active = $(".nav-item.active")?.dataset.route;
    if(active !== "history") return;
    const filtered = DEMO.ops.filter(o => o.label.toLowerCase().includes(q));
    const view = $("#view");
    view.innerHTML = "";
    view.appendChild(card(12, "Historique (filtré)", `
      <table class="table">
        <thead><tr><th>Date</th><th>Libellé</th><th>Montant</th></tr></thead>
        <tbody>
          ${filtered.map(o => `
            <tr>
              <td>${o.date}</td>
              <td>${o.label}</td>
              <td class="${o.amount >= 0 ? "pos" : "neg"}">${o.amount >= 0 ? "+" : ""}${money(Math.abs(o.amount))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `));
  });

  $("#securityBtn").addEventListener("click", () => {
    showModal("Conseils sécurité", `
      <div class="badge">🔒 Protection</div>
      <ul>
        <li>Ne communiquez jamais un code OTP.</li>
        <li>Contactez la caisse au <strong>${DEMO.bank.phone}</strong> en cas de doute.</li>
        <li>Utilisez un mot de passe unique.</li>
      </ul>
    `);
  });

  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-ok").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if(e.target.id === "modal") closeModal(); });

  $("#logout").addEventListener("click", () => location.reload());
}

boot();
