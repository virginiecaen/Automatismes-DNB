// 🔐 Connexion à Supabase
const supabaseClient = supabase.createClient(
  "https://qzetwcnumydxgyjtumdz.supabase.co",
  "sb_publishable_BVXGIlfdPAiFZ_h-1pVNDQ_VcCTPlBF"
);

let cards = [];
let currentCard = null;

// 📥 Charger les fiches depuis Supabase
async function loadCards() {
  const { data, error } = await supabaseClient
    .from("cards")
    .select("*");

  if (error) {
    alert("Erreur de chargement des fiches");
    return;
  }

  cards = data;
  pickRandomCard();
}

// 🎲 Choisir une fiche au hasard
function pickRandomCard() {
  currentCard = cards[Math.floor(Math.random() * cards.length)];

  document.getElementById("question").innerHTML = currentCard.question;
  document.getElementById("answer").innerHTML = currentCard.answer;
  document.getElementById("correction").style.display = "none";

  document.getElementById("student-answer").setValue("");

  MathJax.typeset();
}

// 👀 Afficher la correction
function showCorrection() {
  document.getElementById("correction").style.display = "block";
  MathJax.typeset();
}

// 🚀 Lancement
loadCards();
