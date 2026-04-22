// pricing-engine.js

document.addEventListener("DOMContentLoaded", () => {
  // Trigger the live fetch simulation
  updatePrices();
});

async function updatePrices() {
  try {
    // Simulate a network delay to demonstrate skeleton loading state
    const prices = await mockFetchPrices();

    const grid = document.getElementById("pricing-grid");
    if (!grid) return;

    // Clear skeletons
    grid.innerHTML = "";

    let bestDeal = null;
    let lowestScore = Infinity;

    // Process and calculate "Best Value" score
    prices.forEach(item => {
      const normalizedPrice = item.price / 1000;
      const score = (normalizedPrice * 0.7) + (item.deliveryDays * 0.3);
      item.score = score;

      if (score < lowestScore) {
        lowestScore = score;
        bestDeal = item;
      }
    });

    // Render cards
    prices.forEach(item => {
      const isBest = bestDeal.platform === item.platform;
      
      const card = document.createElement("div");
      card.className = "pricing-card";

      const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(item.price);

      let badgeHtml = "";
      if (isBest) {
        badgeHtml = `<div class="card-badge">✨ Best Value</div>`;
      }

      card.innerHTML = `
        ${badgeHtml}
        <div class="platform-logo">${item.platform}</div>
        <div class="platform-info">Delivers in ${item.deliveryDays} day(s)</div>
        <div class="platform-price">${formattedPrice}</div>
        <a href="${item.link}" class="view-deal-btn" target="_blank" rel="noopener noreferrer">View Deal</a>
      `;

      grid.appendChild(card);
    });

    renderAISuggestion(bestDeal);

  } catch (error) {
    console.error("Failed to fetch prices:", error);
  }
}

function renderAISuggestion(bestDeal) {
  const smartPickSection = document.getElementById("smart-pick-section");
  const container = document.getElementById("ai-best-deal-container");
  
  if (!smartPickSection || !container || !bestDeal) return;

  smartPickSection.style.display = "flex";

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(bestDeal.price);

  container.innerHTML = `
    <div class="pricing-card" style="border-color: #5e5ce6; box-shadow: 0 4px 16px rgba(94, 92, 230, 0.15);">
      <div class="platform-logo">${bestDeal.platform}</div>
      <div class="platform-info" style="color: #5e5ce6; font-weight: 500;">Fastest & Most Affordable in our analysis.</div>
      <div class="platform-price">${formattedPrice}</div>
      <a href="${bestDeal.link}" class="view-deal-btn" style="background-color: #5e5ce6;" target="_blank" rel="noopener noreferrer">Secure Deal Now</a>
    </div>
  `;
}

function mockFetchPrices() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { platform: "Amazon", price: 109900, deliveryDays: 2, link: "#" },
        { platform: "Flipkart", price: 110500, deliveryDays: 1, link: "#" },
        { platform: "Croma", price: 109900, deliveryDays: 3, link: "#" },
      ]);
    }, 1500);
  });
}
