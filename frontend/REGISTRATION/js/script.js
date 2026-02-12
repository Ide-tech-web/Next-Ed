const registerForm = document.querySelector("#registerForm");
const inputs = registerForm.querySelectorAll("input");

function shakeForm() {
    registerForm.classList.add("shake");
    setTimeout(() => registerForm.classList.remove("shake"), 500);
}

function validateForm() {
    let valid = true;

    inputs.forEach(input => {
        if(input.value.trim() === "") {
            input.style.borderBottom = "2px solid red";
            valid = false;
        } else {
            input.style.borderBottom = "1px solid #FFD700";
        }
    });

    // Vérifier mot de passe
    const password = inputs[3].value.trim();
    const confirmPassword = inputs[4].value.trim();
    if(password !== confirmPassword) {
        inputs[3].style.borderBottom = "2px solid red";
        inputs[4].style.borderBottom = "2px solid red";
        alert("Les mots de passe ne correspondent pas !");
        valid = false;
    }

    return valid;
}

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if(validateForm()) {
        alert("Inscription réussie !");
        registerForm.reset();
        inputs.forEach(input => input.style.borderBottom = "1px solid #FFD700");
    } else {
        shakeForm();
    }
});
