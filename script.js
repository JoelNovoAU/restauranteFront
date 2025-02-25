document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerBtn").addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const repeatPassword = document.getElementById("repeatPassword").value;

        if (!email || !password || !repeatPassword) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (password !== repeatPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        fetch("https://restaurante-back-1kfb.vercel.app/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error en el registro:", error);
            alert("Hubo un problema con el registro.");
        });
    });
});































































































































































































//angel