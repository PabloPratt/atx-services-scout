const STORAGE_KEY = "serviceScoutProviders";
const baseProviders = window.SERVICE_SCOUT_PROVIDERS || [];

const state = {
  providers: mergeLocalUpdates(baseProviders),
  filters: {
    search: "",
    category: "all",
    type: "all",
    priceStatus: "all",
    maxPrice: 900,
    minRating: 0
  }
};

const els = {
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  priceStatusFilter: document.querySelector("#priceStatusFilter"),
  maxPriceFilter: document.querySelector("#maxPriceFilter"),
  maxPriceOutput: document.querySelector("#maxPriceOutput"),
  minRatingFilter: document.querySelector("#minRatingFilter"),
  minRatingOutput: document.querySelector("#minRatingOutput"),
  resultCount: document.querySelector("#resultCount"),
  knownPriceCount: document.querySelector("#knownPriceCount"),
  quoteCount: document.querySelector("#quoteCount"),
  providerGrid: document.querySelector("#providerGrid"),
  providerSelect: document.querySelector("#providerSelect"),
  priceForm: document.querySelector("#priceForm"),
  priceInput: document.querySelector("#priceInput"),
  sourceInput: document.querySelector("#sourceInput"),
  outreachList: document.querySelector("#outreachList"),
  exportBtn: document.querySelector("#exportBtn"),
  copyOutreachBtn: document.querySelector("#copyOutreachBtn")
};

function mergeLocalUpdates(providers) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return providers.map((provider) => ({ ...provider, ...(saved[provider.id] || {}) }));
}

function saveProviderUpdate(id, patch) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  saved[id] = { ...(saved[id] || {}), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved, null, 2));
}

function formatPrice(provider) {
  if (provider.startingPrice === null || provider.startingPrice === undefined) {
    return "Quote needed";
  }
  return `$${Number(provider.startingPrice).toLocaleString()}+`;
}

function formatRating(provider) {
  if (!provider.rating) return "Review data pending";
  const count = provider.reviewCount ? ` from ${provider.reviewCount.toLocaleString()} reviews` : "";
  return `${provider.rating.toFixed(1)} stars${count}`;
}

function categories() {
  return ["all", ...new Set(state.providers.map((provider) => provider.category))];
}

function populateControls() {
  els.categoryFilter.innerHTML = categories()
    .map((category) => `<option value="${category}">${category === "all" ? "All categories" : category}</option>`)
    .join("");

  els.providerSelect.innerHTML = state.providers
    .map((provider) => `<option value="${provider.id}">${provider.name} - ${provider.category}</option>`)
    .join("");
}

function matchesFilters(provider) {
  const searchHaystack = [
    provider.name,
    provider.category,
    provider.market,
    provider.service,
    provider.sourceNote
  ].join(" ").toLowerCase();
  const hasPrice = provider.startingPrice !== null && provider.startingPrice !== undefined;
  const hasRating = provider.rating !== null && provider.rating !== undefined;

  if (state.filters.search && !searchHaystack.includes(state.filters.search.toLowerCase())) return false;
  if (state.filters.category !== "all" && provider.category !== state.filters.category) return false;
  if (state.filters.type !== "all" && provider.type !== state.filters.type) return false;
  if (state.filters.priceStatus === "known" && !hasPrice) return false;
  if (state.filters.priceStatus === "missing" && hasPrice) return false;
  if (hasPrice && provider.startingPrice > state.filters.maxPrice) return false;
  if (state.filters.minRating > 0 && (!hasRating || provider.rating < state.filters.minRating)) return false;
  return true;
}

function providerCard(provider) {
  const typeClass = provider.type === "local" ? "pill pill--local" : "pill";
  const priceClass = provider.startingPrice ? "pill" : "pill pill--quote";
  const contactHref = provider.contactUrl || provider.sourceUrl || "#outreach";
  const mailto = buildMailto(provider);

  return `
    <article class="provider-card">
      <header>
        <div>
          <h3>${provider.name}</h3>
          <div class="meta">${provider.category} • ${provider.market}</div>
        </div>
        <span class="${typeClass}">${provider.type}</span>
      </header>
      <div class="meta">${provider.service}</div>
      <div class="price">
        ${formatPrice(provider)}
        <small>${provider.sourceNote}</small>
      </div>
      <div class="meta">${formatRating(provider)}</div>
      <span class="${priceClass}">${provider.startingPrice ? "price captured" : provider.priceStatus}</span>
      <div class="card-actions">
        <a class="button button--secondary" href="${contactHref}" target="_blank" rel="noreferrer">Source</a>
        <a class="button" href="${mailto}">Email</a>
      </div>
    </article>
  `;
}

function buildMailto(provider) {
  const subject = encodeURIComponent(`Price request for ${provider.service}`);
  const body = encodeURIComponent(
    `Hello ${provider.name},\n\nI'm comparing local service providers for ATX Services Scout. Can you share your starting price or typical price range for ${provider.service} in my area?\n\nHelpful details:\n- Service category: ${provider.category}\n- City/ZIP:\n- Standard appointment, not emergency unless noted\n\nThank you.`
  );
  return `mailto:${provider.email || ""}?subject=${subject}&body=${body}`;
}

function render() {
  const visible = state.providers.filter(matchesFilters);
  const missing = visible.filter((provider) => provider.startingPrice === null || provider.startingPrice === undefined);
  const known = visible.length - missing.length;

  els.maxPriceOutput.textContent = state.filters.maxPrice >= 900 ? "$900+" : `$${state.filters.maxPrice}`;
  els.minRatingOutput.textContent = state.filters.minRating === 0 ? "Any" : `${state.filters.minRating.toFixed(1)}+`;
  els.resultCount.textContent = visible.length;
  els.knownPriceCount.textContent = known;
  els.quoteCount.textContent = missing.length;
  els.providerGrid.innerHTML = visible.map(providerCard).join("") || `<p class="meta">No providers match these filters.</p>`;
  renderOutreach(missing);
}

function renderOutreach(providers) {
  els.outreachList.innerHTML = providers
    .map((provider) => `
      <article class="outreach-item">
        <div>
          <strong>${provider.name}</strong>
          <span class="meta">${provider.category} • ${provider.service} • ${provider.market}</span>
        </div>
        <a class="button" href="${buildMailto(provider)}">Draft email</a>
      </article>
    `)
    .join("") || `<p class="meta">Every visible provider has a captured starting price.</p>`;
}

function exportData() {
  const payload = JSON.stringify(state.providers, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `atx-services-scout-data-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function copyOutreachBatch() {
  const missing = state.providers.filter((provider) => provider.startingPrice === null || provider.startingPrice === undefined);
  const body = missing.map((provider) => `${provider.name} | ${provider.category} | ${provider.contactUrl || provider.sourceUrl || "Needs contact research"}`).join("\n");
  navigator.clipboard.writeText(body);
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    render();
  });
  els.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    render();
  });
  els.typeFilter.addEventListener("change", (event) => {
    state.filters.type = event.target.value;
    render();
  });
  els.priceStatusFilter.addEventListener("change", (event) => {
    state.filters.priceStatus = event.target.value;
    render();
  });
  els.maxPriceFilter.addEventListener("input", (event) => {
    state.filters.maxPrice = Number(event.target.value);
    render();
  });
  els.minRatingFilter.addEventListener("input", (event) => {
    state.filters.minRating = Number(event.target.value);
    render();
  });
  els.priceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = els.providerSelect.value;
    const patch = {
      startingPrice: Number(els.priceInput.value),
      priceStatus: "captured",
      sourceNote: els.sourceInput.value
    };
    saveProviderUpdate(id, patch);
    state.providers = state.providers.map((provider) => provider.id === id ? { ...provider, ...patch } : provider);
    els.priceForm.reset();
    render();
  });
  els.exportBtn.addEventListener("click", exportData);
  els.copyOutreachBtn.addEventListener("click", copyOutreachBatch);
}

populateControls();
bindEvents();
render();
