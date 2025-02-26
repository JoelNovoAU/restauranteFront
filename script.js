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

        console.log({ email, password });  // Verifica que los datos sean correctos

        fetch("https://restaurante-back2-two.vercel.app/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Verifica la respuesta del servidor
            if (data.success) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error en el registro:", error);
            alert("Hubo un problema con el registro.",error);
        });
    });
});
$(document).ready(function () {
    $("#iniciarsesion").click(function () {
        const email = $("#login").val();
        const password = $("#contra").val();
    
        if (!email || !password) {
            alert("Por favor, ingresa tu correo y contraseña.");
            return;
        }
    
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, password }),
            success: function (data) {
                console.log(data); // Ver la respuesta en la consola
    
                if (data.success) {
                    alert("Inicio de sesión exitoso. Redirigiendo...");
                    //usuario admin !!!!
                    if (email === "admin@admin.admin" && password === "admin") {
                        window.location.href = "administrador.html";
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    alert(data.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en el inicio de sesión:", error);
                alert("Hubo un problema con el inicio de sesión.");
            }
        });
    });
    
    $("#crearsolicitud").on("click", function (event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        const nombre = $("#nombre").val();
        const telefono = $("#telefono").val();
        const comensales = $("#comensales").val();
        const fecha = $("#fecha").val();
        const hora = $("#hora").val();

        if (!nombre || !telefono || !comensales || !fecha || !hora) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/reservas",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ nombre, telefono, comensales, fecha, hora }),
            success: function (data) {
                if (data.success) {
                    alert("Reserva creada con éxito.");
                    window.location.href = "index.html"; // Redirigir si es exitoso
                } else {
                    alert(data.message);
                }
            },
            error: function (error) {
                console.error("Error al enviar la reserva:", error);
                alert("Hubo un problema al procesar la reserva.");
            }
        });
    });
    function obtenerReservas() {
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/reservas", // URL del backend
            method: "GET", // Usamos GET para obtener las reservas
            success: function (data) {
                if (data.success) {
                    const contenedor = $(".contenedorsolicitudes");
                    contenedor.empty(); // Limpiar el contenedor antes de agregar las reservas

                    // Iteramos sobre cada reserva
                    data.reservas.forEach(function (reserva) {
                        // Crear la tarjeta para cada reserva
                        const tarjeta = `
    <div class="card mb-3" style="width: 18rem;" data-id="${reserva._id}">
        <div class="card-body" id="divsolicitud">
            <h5 class="card-title">${reserva.nombre}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${reserva.telefono}</h6>
            <h6 class="card-subtitle mb-2 text-muted">PENDIENTE</h6>
            <p class="card-text">${new Date(reserva.fecha).toLocaleDateString()}</p>
            <p class="card-text">${reserva.hora}</p>
            <div class="opciones">
                <button type="submit" class="btn btn-danger btn-cancelar">CANCELAR</button>
                <button type="submit" class="btn btn-success">ACEPTAR</button>
            </div>
        </div>
    </div>
`;

                        contenedor.append(tarjeta); // Añadir la tarjeta al contenedor
                    });
                } else {
                    alert(data.message);
                }
            },
            error: function (error) {
                console.error("Error al obtener las reservas:", error);
                alert("Hubo un problema al obtener las reservas.");
            }
        });
    }
    $(".contenedorsolicitudes").on("click", ".btn-cancelar", function () {
        const tarjeta = $(this).closest(".card"); // Obtener la tarjeta padre
        const reservaId = tarjeta.attr("data-id"); // Obtener el ID de la reserva
    
        if (!reservaId) {
            alert("No se pudo obtener el ID de la reserva.");
            return;
        }
    
        // Confirmación antes de eliminar
        if (!confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
            return;
        }
    
        // Hacer petición DELETE al backend
        $.ajax({
            url: `https://restaurante-back2-two.vercel.app/api/reservas/${reservaId}`,
            method: "DELETE",
            success: function (response) {
                if (response.success) {
                    tarjeta.remove(); // Eliminar la tarjeta del DOM
                    alert("Reserva cancelada correctamente.");
                } else {
                    alert(response.message);
                }
            },
            error: function (error) {
                console.error("Error al cancelar la reserva:", error);
                alert("Hubo un problema al cancelar la reserva.");
            }
        });
    });
    
    // Llamar a la función para cargar las reservas cuando se cargue la página
    obtenerReservas();
});






























































































































































































//angel