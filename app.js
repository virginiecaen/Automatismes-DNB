// 🔐 Supabase
const supabaseClient = supabase.createClient(
  "https://qzetwcnumydxgyjtumdz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZXR3Y251bXlkeGd5anR1bWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTYyOTksImV4cCI6MjA4NDY3MjI5OX0.QnZ7a9Mo80m0NbVCkDa9zBQ-ZcwDFQyRXMzIWo2l38I"
);

// --------------------
// AUTH ENSEIGNANT
// --------------------
async function loginTeacher(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("❌ Identifiants incorrects ou compte non autorisé");
    return;
  }

  alert("Connectée en mode enseignant 🎉");
  showTeacherMode(); // ← déclenche le mode enseignant
}


// --------------------
// CHARGER LES FICHES
// --------------------
let cards = [];

async function loadCards() {
  const { data, error } = await supabaseClient
    .from("cards")
    .select("*");

  if (error) {
    console.error(error);
    alert("Erreur chargement fiches");
    return;
  }

  cards = data;
  console.log("Fiches chargées :", cards);
}

// --------------------
// CRÉER UNE FICHE
// --------------------
async function createCard(theme, question, answer) {
  const { error } = await supabaseClient
    .from("cards")
    .insert({
      theme,
      question,
      answer
    });

  if (error) {
    console.error(error);
    alert("Erreur création fiche");
  } else {
    alert("Fiche enregistrée 🎉");
    loadCards();
  }
}

// 🚀 Démarrage
loadCards();
// --------------------
// BOUTON "VÉRIFIER"
// --------------------
document
  .getElementById("check-answer-btn")
  .addEventListener("click", () => {
    if (!currentCard) return;

    const userAnswer = document
      .getElementById("student-answer")
      .value
      .trim();

    // Affiche la correction
    document.getElementById("flashcard-answer").innerHTML =
      currentCard.answer;

    document.getElementById("correction").classList.remove("hidden");

    if (window.MathJax) {
      MathJax.typeset();
    }
  });
// --------------------
// --------------------
// SWITCH MODE ENSEIGNANT
// --------------------
function showTeacherMode() {
  document.getElementById("student-mode").classList.add("hidden");
  document.getElementById("teacher-mode").classList.remove("hidden");
  document.getElementById("logout-btn").classList.remove("hidden");
  document.getElementById("mode-label").textContent = "Mode Enseignant";
}

function logoutTeacher() {
  document.getElementById("teacher-mode").classList.add("hidden");
  document.getElementById("student-mode").classList.remove("hidden");
  document.getElementById("logout-btn").classList.add("hidden");
  document.getElementById("mode-label").textContent = "Mode Élève";
  currentCard = null;
  pickRandomCard();
}

document.getElementById("logout-btn").addEventListener("click", logoutTeacher);
// --------------------
// FORMULAIRE CRÉATION DE FICHE
// --------------------
document.getElementById("teacher-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche le rechargement de la page

  const theme = document.getElementById("theme-input").value.trim();
  const question = document.getElementById("question-input").value.trim();
  const answer = document.getElementById("answer-input").value.trim();

  if (!theme || !question || !answer) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // Insert dans Supabase
  const { data, error } = await supabaseClient
    .from("cards")
    .insert([{ theme, question, answer }]);

  if (error) {
    alert("❌ Erreur lors de l'enregistrement : " + error.message);
    return;
  }

  alert("Fiche enregistrée 🎉");

  // Réinitialise le formulaire
  document.getElementById("teacher-form").reset();

  // Recharge les fiches pour que le mode élève les voie
  loadCards();
});
