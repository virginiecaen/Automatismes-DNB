// 🔐 Connexion à Supabase
const supabaseClient = supabase.createClient(
  "https://qzetwcnumydxgyjtumdz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZXR3Y251bXlkeGd5anR1bWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTYyOTksImV4cCI6MjA4NDY3MjI5OX0.QnZ7a9Mo80m0NbVCkDa9zBQ-ZcwDFQyRXMzIWo2l38I"
);

let cards = [];
let currentCard = null;

// 📥 Charger les fiches
async function loadCards() {
  const { data, error } = await supabaseClient
    .from("cards")
    .select("*");

  if (error) {
    console.error(error);
    alert("Erreur Supabase : " + error.message);
    return;
  }

  cards = data;

  if (cards.length === 0) {
    alert("Aucune fiche trouvée");
    return;
  }

  pickRandomCard();
}

// 🎲 Choisir une fiche au hasard
function pickRandomCard() {
  currentCard = cards[Math.floor(Math.random() * cards.length)];

  document.getElementById("flashcard-question").innerHTML =
    currentCard.question;

  document.getElementById("student-answer").value = "";
}

// 👀 Afficher la correction
function showCorrection() {
  document.getElementById("correction").style.display = "block";
}

// 🚀 Lancement
loadCards();
