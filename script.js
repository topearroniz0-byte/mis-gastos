let gastos = JSON.parse(localStorage.getItem('topebyte_gastos')) || [];
let totalGeneral = 0;

window.onload = () => {
    actualizarInterfaz();
};

function guardarEnLocal() {
    localStorage.setItem('topebyte_gastos', JSON.stringify(gastos));
}

function agregarGasto() {
    const productoInput = document.getElementById('producto');
    const cantidadInput = document.getElementById('cantidad');
    const precioInput = document.getElementById('precio');

    const producto = productoInput.value.trim();
    const cantidad = parseFloat(cantidadInput.value);
    const precio = parseFloat(precioInput.value);
    
    if (producto && !isNaN(cantidad) && cantidad > 0 && !isNaN(precio) && precio > 0) {
        const subtotal = cantidad * precio;
        gastos.push({ producto, cantidad, precio, subtotal });
        
        guardarEnLocal();
        actualizarInterfaz();
        
        // Limpiar campos y quitar foco para ocultar teclado en móvil
        productoInput.value = '';
        cantidadInput.value = '';
        precioInput.value = '';
        productoInput.blur(); 
    } else {
        alert("Por favor, rellena todos los campos con valores válidos.");
    }
}

function actualizarInterfaz() {
    actualizarListaGastos();
    actualizarBarras();
}

function actualizarListaGastos() {
    const lista = document.getElementById('listaGastos');
    lista.innerHTML = ''; // Limpiar lista
    totalGeneral = 0;
    
    if (gastos.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color: #a0a0a0; margin-top: 20px;">No hay gastos registrados este mes.</p>';
        document.getElementById('totalMes').textContent = '0.00';
        return;
    }

    gastos.forEach((gasto, index) => {
        totalGeneral += gasto.subtotal;
        
        // Crear Card (Diseño Móvil)
        const card = document.createElement('div');
        card.className = 'gasto-card';
        card.innerHTML = `
            <div class="gasto-info">
                <span class="gasto-name">${gasto.producto}</span>
                <span class="gasto-details">${gasto.cantidad} x ${gasto.precio.toFixed(2)}€</span>
            </div>
            <div style="display:flex; align-items:center;">
                <span class="gasto-total">${gasto.subtotal.toFixed(2)}€</span>
                <button onclick="borrarGasto(${index})" class="btn-delete" title="Borrar gasto">🗑️</button>
            </div>
        `;
        lista.appendChild(card);
    });
    
    document.getElementById('totalMes').textContent = totalGeneral.toFixed(2);
}

function borrarGasto(index) {
    if(confirm(`¿Seguro que quieres borrar "${gastos[index].producto}"?`)) {
        gastos.splice(index, 1);
        guardarEnLocal();
        actualizarInterfaz();
    }
}

function limpiarTodo() {
    if (gastos.length > 0 && confirm("¿Estás seguro? Se borrarán TODOS los gastos del mes.")) {
        gastos = [];
        guardarEnLocal();
        actualizarInterfaz();
    }
}

function actualizarBarras() {
    const container = document.getElementById('containerBarras');
    container.innerHTML = '';
    if (totalGeneral === 0) return;
    
    // Agrupar gastos por producto para el gráfico
    const gastosAgrupados = gastos.reduce((acc, gasto) => {
        if (!acc[gasto.producto]) {
            acc[gasto.producto] = 0;
        }
        acc[gasto.producto] += gasto.subtotal;
        return acc;
    }, {});

    // Ordenar de mayor a menor
    const productosOrdenados = Object.entries(gastosAgrupados)
        .sort((a, b) => b[1] - a[1]);

    productosOrdenados.forEach(([producto, subtotal]) => {
        const porcentaje = ((subtotal / totalGeneral) * 100).toFixed(1);
        const barraDiv = document.createElement('div');
        barraDiv.className = 'barra-item';
        barraDiv.innerHTML = `
            <div class="barra-label">
                <span class="barra-name"><b>${producto}</b></span>
                <span class="barra-percentage">${subtotal.toFixed(2)}€ (${porcentaje}%)</span>
            </div>
            <div class="barra-bg">
                <div class="barra-fill" style="width:${porcentaje}%"></div>
            </div>
        `;
        container.appendChild(barraDiv);
    });
}