var swiper1 = new Swiper(".myswiper-1", { 
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-button-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
 var swiper2 = new Swiper(".myswiper-2", { 
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints : {
        0: {
            slidesPerView: 1
        },
        520: {
            slidesPerView: 2
        },
        950: {
            slidesPerView: 3
        }
    }
});

const carrito = document.getElementById('carrito');
const elemento1 = document.getElementById('lista-1');
const elemento2 = document.getElementById('lista-2');
const elemento3 = document.getElementById('lista-3');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');



function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoItems', JSON.stringify(carritoItems));
  }
  
  

  function cargarCarritoDesdeLocalStorage() {
    if (localStorage.getItem('carritoItems')) {
      carritoItems = JSON.parse(localStorage.getItem('carritoItems'));
      actualizarCarrito();
    }
  }


let carritoItems = {};

cargarEventListeners();

function cargarEventListeners() {
  elemento1.addEventListener('click', comprarElemento);
  elemento2.addEventListener('click', comprarElemento);
  elemento3.addEventListener('click', comprarElemento);

  carrito.addEventListener('click', eliminarElemento);

  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}



function comprarElemento(e) {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    const elemento = e.target.parentElement.parentElement;
    leerDatosElemento(elemento);
    Toastify({
        text: "Agregado al carrito",
        duration: 2000, 
        gravity: "center", 
        position: "left", 
        style: {
          fontSize: "25px",
          fontFamily: "Verdana",
          color: "pink",
          background: "gray"
        }
      }).showToast();
  }
}

function leerDatosElemento(elemento) {
  const infoElemento = {
    imagen: elemento.querySelector('img').src,
    titulo: elemento.querySelector('h3').textContent,
    precio: elemento.querySelector('.precio').textContent,
    id: elemento.querySelector('a').getAttribute('data-id'),
  };
  guardarCarritoEnLocalStorage();
  actualizarCarrito();
  insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
  if (carritoItems[elemento.id]) {
    carritoItems[elemento.id].cantidad++;
  } else {
    carritoItems[elemento.id] = {
      ...elemento,
      cantidad: 1,
    };
  }

  guardarCarritoEnLocalStorage();
  actualizarCarrito();
}

function eliminarElemento(e) {
  e.preventDefault();
  if (e.target.classList.contains('borrar')) {
    const elementoId = e.target.getAttribute('data-id');

    if (carritoItems[elementoId].cantidad > 1) {
      carritoItems[elementoId].cantidad--;
    } else {
      delete carritoItems[elementoId];
    }

    guardarCarritoEnLocalStorage();
    actualizarCarrito();
  }
}

function vaciarCarrito() {
  Object.keys(carritoItems).forEach((itemId) => {
    delete carritoItems[itemId];
  });

  guardarCarritoEnLocalStorage();
  actualizarCarrito();
}

function actualizarCarrito() {
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
   }
  for (const itemId in carritoItems) {
    const item = carritoItems[itemId];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${item.imagen}" width=100>
      </td>
      <td>
        ${item.titulo}
      </td>
      <td>
        ${item.precio}
      </td>
      <td>
        <a href="#" class="borrar" data-id="${item.id}">x</a>
      </td>
      <td>
        ${item.cantidad}
      </td>
    `;
    lista.appendChild(row);
  }
}
function mostrar_posicion(posicion) {
    let lat = posicion.coords.latitude;
    let long = posicion.coords.longitude;
    let key = "24412d2a9df697abeb846d7b81fa3f0e";
  
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric&lang=es`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Actualiza los elementos HTML con la información del clima
        document.getElementById('ciudad').textContent = `Ciudad: ${data.name}`;
        document.getElementById('temperatura').textContent = `Temp: ${data.main.temp}°C`;
        document.getElementById('descripcion').textContent = `Clima: ${data.weather[0].description}`;
      });
  }
  
  navigator.geolocation.getCurrentPosition(mostrar_posicion);