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

        console.log({ email, password });  //datos correctos
        fetch("https://restaurante-back2-two.vercel.app/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  //server no va check
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
                console.log(data); //l
    
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
        event.preventDefault(); //emvio por defecto !! cambiar

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
                    window.location.href = "index.html"; //redirigir index
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
            url: "https://restaurante-back2-two.vercel.app/api/reservas", //
            method: "GET", 
            success: function (data) {
                if (data.success) {
                    const contenedor = $(".contenedorsolicitudes");
                    contenedor.empty(); //limpia antesw de agregar , sino carga las anterior

                    data.reservas.forEach(function (reserva) {
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

                        contenedor.append(tarjeta); 
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
        const tarjeta = $(this).closest(".card"); //tarjeta
        const reservaId = tarjeta.attr("data-id"); //de cada el id
    
        if (!reservaId) {
            alert("No se pudo obtener el ID de la reserva.");
            return;
        }
    
        //confirmacion
        if (!confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
            return;
        }
    
        //
        $.ajax({
            url: `https://restaurante-back2-two.vercel.app/api/reservas/${reservaId}`,
            method: "DELETE",
            success: function (response) {
                if (response.success) {
                    tarjeta.remove(); //saca DOM
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
    
    obtenerReservas();
});
$(document).ready(function () {
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
                    obtenerCesta(); 
                } else {
                    alert("⚠️ " + data.message);
                }
            },
            error: function (error) {
                console.error("Error al agregar el producto:", error);
                alert("Hubo un problema al agregar el producto.");
            }
        });
    });

    function obtenerCesta() {
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/cesta",
            method: "GET",
            success: function (data) {
                console.log("📦 Datos de la cesta recibidos:", data); //consola datos
                
                const listaCesta = $("#pedidoContenido");
                listaCesta.empty(); 
                let total = 0;

                if (!data.success || data.cesta.length === 0) {
                    $("#pedidoContenido").html("<p>🛒 La cesta está vacía.</p>");
                    $("#totalPedido").text("0.00");
                    $("#resumenPedido").show(); //saca si esta vacia da igual
                    return;
                }

                
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
                $("#resumenPedido").fadeIn(); //animacion
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener la cesta:", error);
                $("#pedidoContenido").html("<p>No se pudo cargar la cesta.</p>");
                $("#totalPedido").text("0.00");
                $("#resumenPedido").show(); //
            }
        });
    }

    $("#botonCesta img").click(function () {
        obtenerCesta();
    });

    $("#cerrarPedido").click(function () {
        $("#resumenPedido").fadeOut();
    });

    $("#pedidoContenido").on("click", ".remove-item", function () {
        const id = $(this).attr("data-id");

        $.ajax({
            url: `https://restaurante-back2-two.vercel.app/api/cesta/${id}`,  
            method: "DELETE",
            success: function (response) {
                if (response.success) {
                    alert("Producto eliminado de la cesta.");
                    obtenerCesta(); 
                } else {
                    alert("⚠️ " + response.message);
                }
            },
            error: function (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Hubo un problema al eliminar el producto.");
            }
        });
    });
});

$(document).ready(function () {
    let productosCesta = [];

    //SACA PRODUCTOS DE MONGO ----------------
    function obtenerCesta() {
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/cesta", 
            method: "GET",
            success: function (data) {
                console.log("Productos recibidos:", data); 
                
                const listaProductos = $("#order-items-container");
                listaProductos.empty();  //vacia contenedor
                let total = 0;
                if (!data.success || data.cesta.length === 0) {
                    $("#order-items-container").html("<p>🛒 Tu cesta está vacía.</p>");
                    $("#totalPedido").text("0.00€");
                    return;
                }

                productosCesta = data.cesta;

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
                    listaProductos.append(productoHTML);  
                    total += item.precio * item.cantidad; 
                });

                $("#totalPedido").text(total.toFixed(2) + "€");  
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener los productos:", error);
                $("#order-items-container").html("<p> No se pudo cargar los productos de la cesta.</p>");
                $("#totalPedido").text("0.00€");
            }
        });
    }

    obtenerCesta();

    $("#payment-form").submit(function (e) {
        e.preventDefault();  

        //formulario
        const nombre = $("#nombre").val();
        const apellidos = $("#apellidos").val();
        const correo = $("#correo").val();
        const telefono = $("#telefono").val();
        const titular = $("#titular").val();
        const numeroTarjeta = $("#numero-tarjeta").val();
        const caducidad = $("#caducidad").val();
        const cvv = $("#cvv").val();

    
        if (productosCesta.length === 0) {
            alert("No tienes productos en la cesta.");
            return;
        }

        const total = parseFloat($("#totalPedido").text().replace('€', '').trim());

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
            productos: productosCesta,  //ya almacenados                        --JOEL CAMBIA ESTE MOVIDON !!
            total: total
        };

        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/pedidos",  
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(pedido),
            success: function (response) {
                if (response.success) {
                    alert("Z Pedido realizado con éxito.");
                } else {
                    alert("Z" + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error(" Error al realizar el pedido:", error);
                alert(" Hubo un problema al realizar el pedido.");
            }
        });
    });
});

$(document).ready(function () {

    function obtenerPedidos() {
        $.ajax({
            url: "https://restaurante-back2-two.vercel.app/api/pedidos", 
            method: "GET", 
            success: function (data) {
                console.log(data); 
                if (data.success) {
                    const contenedor = $(".contenedorPedidos");
                    contenedor.empty(); 

                    data.pedidos.forEach(function (pedido) {
                        let listaProductos = '';
                        pedido.productos.forEach(function (producto) {
                            listaProductos += `
                                <p><strong>${producto.nombre}</strong> - Cantidad: ${producto.cantidad}</p>
                            `;
                        });

                        const tarjeta = `
                        <div class="card mb-3" style="width: 18rem;" data-id="${pedido._id}">
                            <div class="card-body" id="divsolicitud">
                                <h5 class="card-title">${pedido.cliente.nombre}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${pedido.cliente.telefono}</h6>
                                <div class="productos">
                                    ${listaProductos}  <!-- Aquí agregamos los productos con sus cantidades -->
                                </div>
                                  <p class="card-text">Total: €${pedido.total}</p>
                                <div class="opciones">
                                    <button type="submit" class="btn btn-danger btn-cancelar">CANCELAR</button>
                                    <button type="submit" class="btn btn-success">ACEPTAR</button>
                                </div>
                            </div>
                        </div>
                        `;

                        contenedor.append(tarjeta); 
                    });
                } else {
                    alert("Z " + data.message);
                }
            },
            error: function (xhr, status, error) {
                console.error(" Error al obtener los pedidos:", error);
                alert(" Hubo un problema al obtener los pedidos.");
            }
        });
    }

    

$(".contenedorPedidos").on("click", ".btn-cancelar", function () {
    const tarjeta = $(this).closest(".card"); //TARJETA 
    const pedidoId = tarjeta.attr("data-id"); //id como antes

    if (!pedidoId) {
        alert("No se pudo obtener el ID del pedido.");
        return;
    }

    if (!confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
        return;
    }

    $.ajax({
        url: `https://restaurante-back2-two.vercel.app/api/pedidos/${pedidoId}`,
        method: "DELETE", //delete
        success: function (response) {
            if (response.success) {
                tarjeta.remove(); //cha
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


$(".contenedorPedidos").on("click", ".btn-success", function () {
    const tarjeta = $(this).closest(".card"); 
    const pedidoId = tarjeta.attr("data-id"); //igual

    if (!pedidoId) {
        alert("No se pudo obtener el ID del pedido.");
        return;
    }

    if (!confirm("¿Estás seguro de que quieres aceptar este pedido?")) {
        return;
    }

    $.ajax({
        url: `https://restaurante-back2-two.vercel.app/api/pedidos/aceptar/${pedidoId}`, 
        method: "PATCH",
        success: function (response) {
            if (response.success) {
                alert("Pedido aceptado correctamente.");
                obtenerPedidos(); 
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

    obtenerPedidos();

});




























































































































































































//angel