// Recuperar datos guardados o iniciar vacíos
let gastos = JSON.parse(localStorage.getItem('tope_gastos')) || [];
let sueldo = parseFloat(localStorage.getItem('tope_sueldo')) || 0;

// Al cargar la página, rellenar el sueldo si existe y mostrar la lista
window.onload = () => {
    const sueldoInput = document.getElementById('sueldo');
    if (sueldoInput && sueldo > 0) {
        sueldoInput.value = sueldo;
    }
    actualizarInterfaz();
};

function guardarSueldo() {
    const sueldoInput = document.getElementById('sueldo');
    if (!sueldoInput) return;
    const nuevoSueldo = parseFloat(sueldoInput.value);
    sueldo = isNaN(nuevoSueldo) ? 0 : nuevoSueldo;
    localStorage.setItem('tope_sueldo', sueldo);
    actualizarInterfaz();
}

function agregarGasto() {
    const prodInput = document.getElementById('producto');
    const cantInput = document.getElementById('cantidad');
    const precInput = document.getElementById('precio');

    if (!prodInput || !cantInput || !precInput) return;

    const prod = prodInput.value;
    const cant = parseFloat(cantInput.value);
    const prec = parseFloat(precInput.value);

    // Validación básica
    if (prod && cant > 0 && prec > 0) {
        gastos.push({ 
            nombre: prod, 
            cantidad: cant, 
            precio: prec, 
            total: cant * prec 
        });
        localStorage.setItem('tope_gastos', JSON.stringify(gastos));
        actualizarInterfaz();
        
        // Limpiar campos del formulario
        prodInput.value = '';
        cantInput.value = '';
        precInput.value = '';
    } else {
        alert("Por favor, introduce un nombre, cantidad y precio válidos.");
    }
}

function borrarGasto(index) {
    if (confirm("¿Seguro que quieres borrar este gasto?")) {
        gastos.splice(index, 1);
        localStorage.setItem('tope_gastos', JSON.stringify(gastos));
        actualizarInterfaz();
    }
}

function limpiarTodo() {
    if (confirm("¿Reiniciar todos los datos del mes? Se borrará el sueldo y los gastos.")) {
        gastos = [];
        sueldo = 0;
        localStorage.clear();
        const sueldoInput = document.getElementById('sueldo');
        if (sueldoInput) sueldoInput.value = '';
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const lista = document.getElementById('listaGastos');
    const totalMesLabel = document.getElementById('totalMes');
    const restanteLabel = document.getElementById('restante');
    const containerBarras = document.getElementById('containerBarras');
    
    // Verificar que los elementos existen antes de usarlos
    if (!lista || !totalMesLabel || !restanteLabel || !containerBarras) return;

    lista.innerHTML = '';
    containerBarras.innerHTML = '';
    let sumaTotal = 0;

    // Dibujar la lista de gastos
    gastos.forEach((g, i) => {
        sumaTotal += g.total;
        lista.innerHTML += `
            <div class="gasto-item">
                <div>
                    <strong>${g.nombre}</strong><br>
                    <small>${g.cantidad} x ${g.precio.toFixed(2)}€</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px">
                    <span style="font-weight:bold">${g.total.toFixed(2)}€</span>
                    <button onclick="borrarGasto(${i})" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🗑️</button>
                </div>
            </div>`;
    });

    // Actualizar los totales
    totalMesLabel.textContent = sumaTotal.toFixed(2);
    const restante = sueldo - sumaTotal;
    restanteLabel.textContent = restante.toFixed(2) + "€";
    
    // Cambiar color si el presupuesto es negativo
    restanteLabel.style.color = restante < 0 ? "#ef4444" : "#3b82f6";

    // Dibujar las barras de distribución
    gastos.forEach(g => {
        const porc = sumaTotal > 0 ? ((g.total / sumaTotal) * 100).toFixed(1) : 0;
        containerBarras.innerHTML += `
            <div class="barra-item">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:5px">
                    <span>${g.nombre}</span>
                    <span>${porc}%</span>
                </div>
                <div class="barra-bg"><div class="barra-fill" style="width:${porc}%"></div></div>
            </div>`;
    });
}