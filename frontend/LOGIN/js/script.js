
// Sélection du formulaire et des inputs
const loginForm = document.querySelector("form");
const inputs = loginForm.querySelectorAll("input");

// Ajout d'une classe shake via CSS
function shakeForm() {
    loginForm.classList.add("shake");
    setTimeout(() => {
        loginForm.classList.remove("shake");
    }, 500);
}

// Validation des champs
function validateForm() {
    let valid = true;

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            input.style.borderBottom = "2px solid red"; // bordure rouge
            valid = false;
        } else {
            input.style.borderBottom = "1px solid #FFD700"; // bordure normale
        }
    });

    return valid;
}

// Événement de soumission
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
        alert("Connexion réussie !");
        loginForm.reset();
        inputs.forEach(input => input.style.borderBottom = "1px solid #FFD700");
    } else {
        shakeForm(); // Formulaire secoué
        alert("Veuillez remplir tous les champs !");
    }
});

