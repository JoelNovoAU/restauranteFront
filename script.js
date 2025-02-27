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
$(document).ready(function () {
    // Al hacer clic en los botones de agregar productos a la cesta
    $(".add-button").click(function () {
        const comida = $(this).closest(".card12"); 
        const id = comida.attr("data-id");
        const nombre = comida.find(".card12-title").text();
        const precio = parseFloat(comida.find(".card12-price").text().replace(/[^\d.]/g, "")); 
        const imagen = comida.find("img").attr("src");

        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/cesta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                productoId: id,
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1  
            }),
            success: function (data) {
                console.log("✅ Producto agregado a la cesta:", data);
                if (data.success) {
                    alert("✅ Producto agregado a la cesta.");
                    obtenerCesta(); // Actualiza la cesta
                } else {
                    alert("⚠️ " + data.message);
                }
            },
            error: function (error) {
                console.error("❌ Error al agregar el producto:", error);
                alert("Hubo un problema al agregar el producto.");
            }
        });
    });

    // Función para obtener los productos de la cesta
    function obtenerCesta() {
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/cesta",
            method: "GET",
            success: function (data) {
                console.log("📦 Datos de la cesta recibidos:", data); // Verificar en consola los datos recibidos
                
                const listaCesta = $("#pedidoContenido");
                listaCesta.empty(); 
                let total = 0;

                if (!data.success || data.cesta.length === 0) {
                    $("#pedidoContenido").html("<p>🛒 La cesta está vacía.</p>");
                    $("#totalPedido").text("0.00");
                    $("#resumenPedido").show(); // Se muestra aunque esté vacía
                    return;
                }

                // Iterar sobre los productos de la cesta
                data.cesta.forEach(function (item) {
                    const li = $(`
                        <div class="cesta-item">
                            <img src="${item.imagen}" alt="${item.nombre}" class="cesta-img">
                            <div class="cesta-info">
                                <p>${item.nombre} x${item.cantidad}</p>
                                <p>€${(item.precio * item.cantidad).toFixed(2)}</p>
                            </div>
                            <button class="remove-item" data-id="${item.productoId}">Eliminar</button>
                        </div>
                    `);

                    listaCesta.append(li);
                    total += item.precio * item.cantidad;
                });     

                $("#totalPedido").text(total.toFixed(2));
                $("#resumenPedido").fadeIn(); // Mostrar la cesta con animación
            },
            error: function (xhr, status, error) {
                console.error("❌ Error al obtener la cesta:", error);
                $("#pedidoContenido").html("<p>❌ No se pudo cargar la cesta.</p>");
                $("#totalPedido").text("0.00");
                $("#resumenPedido").show(); // Se muestra aunque haya error
            }
        });
    }

    // 📌 Mostrar la cesta al hacer clic en el icono de la bolsa
    $("#botonCesta img").click(function () {
        obtenerCesta();
    });

    // 📌 Botón para cerrar la cesta
    $("#cerrarPedido").click(function () {
        $("#resumenPedido").fadeOut(); // Ocultar con animación
    });

    // 📌 Eliminar un producto de la cesta
    $("#pedidoContenido").on("click", ".remove-item", function () {
        const id = $(this).attr("data-id");

        $.ajax({
            url: `https://restaurante-back2-two.vercel.app/api/cesta/${id}`,  
            method: "DELETE",
            success: function (response) {
                if (response.success) {
                    alert("✅ Producto eliminado de la cesta.");
                    obtenerCesta(); // Refrescar la lista
                } else {
                    alert("⚠️ " + response.message);
                }
            },
            error: function (error) {
                console.error("❌ Error al eliminar el producto:", error);
                alert("Hubo un problema al eliminar el producto.");
            }
        });
    });
});

$(document).ready(function () {
    // Variable global para almacenar los productos de la cesta
    let productosCesta = [];

    // Obtener los productos de la cesta desde la base de datos
    function obtenerCesta() {
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/cesta", // Cambia esta URL si es necesario
            method: "GET",
            success: function (data) {
                console.log("📦 Productos recibidos:", data); // Verificar en consola los datos recibidos
                
                const listaProductos = $("#order-items-container");
                listaProductos.empty();  // Vaciar el contenedor antes de agregar los productos

                let total = 0;
                if (!data.success || data.cesta.length === 0) {
                    $("#order-items-container").html("<p>🛒 Tu cesta está vacía.</p>");
                    $("#totalPedido").text("0.00€");
                    return;
                }

                // Guardar los productos de la cesta en la variable global
                productosCesta = data.cesta;

                // Iterar sobre los productos de la cesta y agregar al contenedor
                productosCesta.forEach(function (item) {
                    const productoHTML = `
                        <div class="order-item">
                            <img src="${item.imagen}" alt="${item.nombre}">
                            <div>
                                <strong>${item.nombre}</strong>
                                <p>${item.descripcion || "Descripción no disponible"}</p> <!-- Puedes agregar más información si tienes -->
                            </div>
                            <p class="price">€${(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                    `;
                    listaProductos.append(productoHTML);  // Agregar el producto al contenedor
                    total += item.precio * item.cantidad; // Sumar al total
                });

                $("#totalPedido").text(total.toFixed(2) + "€");  // Actualizar el total
            },
            error: function (xhr, status, error) {
                console.error("❌ Error al obtener los productos:", error);
                $("#order-items-container").html("<p>❌ No se pudo cargar los productos de la cesta.</p>");
                $("#totalPedido").text("0.00€");
            }
        });
    }

    // Llamar a la función para obtener la cesta cuando la página se carga
    obtenerCesta();

    // Al hacer clic en el botón "Pagar ahora", enviar el pedido al servidor
    $("#payment-form").submit(function (e) {
        e.preventDefault();  // Evitar que el formulario se envíe de manera tradicional

        // Obtener los datos del formulario
        const nombre = $("#nombre").val();
        const apellidos = $("#apellidos").val();
        const correo = $("#correo").val();
        const telefono = $("#telefono").val();
        const titular = $("#titular").val();
        const numeroTarjeta = $("#numero-tarjeta").val();
        const caducidad = $("#caducidad").val();
        const cvv = $("#cvv").val();

        // Verificar que haya productos en la cesta
        if (productosCesta.length === 0) {
            alert("⚠️ No tienes productos en la cesta.");
            return;
        }

        const total = parseFloat($("#totalPedido").text().replace('€', '').trim());

        // Preparar los datos del pedido
        const pedido = {
            cliente: {
                nombre: nombre,
                apellidos: apellidos,
                correo: correo,
                telefono: telefono
            },
            pago: {
                titular: titular,
                numeroTarjeta: numeroTarjeta,
                caducidad: caducidad,
                cvv: cvv
            },
            productos: productosCesta,  // Usamos los productos que ya están almacenados
            total: total
        };

        // Enviar el pedido al servidor
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/pedidos",  // URL para enviar el pedido
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(pedido),
            success: function (response) {
                if (response.success) {
                    alert("✅ Pedido realizado con éxito.");
                    // Puedes redirigir a otra página, limpiar el formulario, etc.
                } else {
                    alert("⚠️ " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("❌ Error al realizar el pedido:", error);
                alert("❌ Hubo un problema al realizar el pedido.");
            }
        });
    });
});

$(document).ready(function () {

    // Función para obtener los pedidos desde el servidor
    // Función para obtener los pedidos desde el servidor
function obtenerPedidos() {
    $.ajax({
        url: "https://restaurante-back2-two.vercel.app/api/pedidos", // URL del backend
        method: "GET", // Usamos GET para obtener los pedidos
        success: function (data) {
            console.log(data); // Verifica lo que devuelve el servidor
            if (data.success) {
                const contenedor = $(".contenedorPedidos");
                contenedor.empty(); // Limpiar el contenedor antes de agregar los pedidos

                // Iteramos sobre cada pedido
                data.pedidos.forEach(function (pedido) {
                    // Crear la tarjeta para cada pedido
                    const tarjeta = `
                    <div class="card mb-3" style="width: 18rem;" data-id="${pedido._id}">
                        <div class="card-body">
                            <h5 class="card-title">${pedido.cliente.nombre}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${pedido.cliente.telefono}</h6>
                            <p class="card-text">Total: €${pedido.total}</p>
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
                alert(data.message); // Mensaje de error si no se obtiene éxito
            }
        },
        error: function (error) {
            console.error("Error al obtener los pedidos:", error); // Registra el error
            alert("Hubo un problema al obtener los pedidos."); // Muestra un mensaje de error
        }
    });
}

    

// Función para cancelar un pedido
$(".contenedorPedidos").on("click", ".btn-cancelar", function () {
    const tarjeta = $(this).closest(".card"); // Obtener la tarjeta padre
    const pedidoId = tarjeta.attr("data-id"); // Obtener el ID del pedido

    if (!pedidoId) {
        alert("No se pudo obtener el ID del pedido.");
        return;
    }

    // Confirmación antes de eliminar
    if (!confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
        return;
    }

    // Hacer petición PATCH al backend
    $.ajax({
        url: `https://restaurante-back2-two.vercel.app/api/pedidos/cancelar/${pedidoId}`, // URL para cancelar el pedido
        method: "PATCH", // Cambiar a PATCH
        success: function (response) {
            if (response.success) {
                tarjeta.remove(); // Eliminar la tarjeta del DOM
                alert("Pedido cancelado correctamente.");
            } else {
                alert(response.message);
            }
        },
        error: function (error) {
            console.error("Error al cancelar el pedido:", error);
            alert("Hubo un problema al cancelar el pedido.");
        }
    });
});

    // Función para aceptar un pedido
   // Función para aceptar un pedido
$(".contenedorPedidos").on("click", ".btn-success", function () {
    const tarjeta = $(this).closest(".card"); // Obtener la tarjeta padre
    const pedidoId = tarjeta.attr("data-id"); // Obtener el ID del pedido

    if (!pedidoId) {
        alert("No se pudo obtener el ID del pedido.");
        return;
    }

    // Confirmación antes de aceptar
    if (!confirm("¿Estás seguro de que quieres aceptar este pedido?")) {
        return;
    }

    // Hacer petición PATCH al backend para aceptar el pedido
    $.ajax({
        url: `https://restaurante-back2-two.vercel.app/api/pedidos/aceptar/${pedidoId}`, // URL para aceptar el pedido
        method: "PATCH",
        success: function (response) {
            if (response.success) {
                alert("Pedido aceptado correctamente.");
                obtenerPedidos(); // Actualizar la lista de pedidos
            } else {
                alert(response.message);
            }
        },
        error: function (error) {
            console.error("Error al aceptar el pedido:", error);
            alert("Hubo un problema al aceptar el pedido.");
        }
    });
});

    // Llamar a la función para cargar los pedidos cuando se cargue la página
    obtenerPedidos();

});




























































































































































































//angel