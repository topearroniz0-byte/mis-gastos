// Recuperar datos guardados o iniciar vacíos
let gastos = JSON.parse(localStorage.getItem('tope_gastos')) || [];
let sueldo = parseFloat(localStorage.getItem('tope_sueldo')) || 0;

// --- LÓGICA DE MONEDA ---
let monedaActual = localStorage.getItem('tope_moneda') || '€';

window.onload = () => {
    const sueldoInput = document.getElementById('sueldo');
    if (sueldoInput && sueldo > 0) {
        sueldoInput.value = sueldo;
    }
    
    // Sincronizar texto del botón al cargar
    actualizarBotonMoneda();
    actualizarInterfaz();
};

function alternarMoneda() {
    monedaActual = (monedaActual === '€') ? '$' : '€';
    localStorage.setItem('tope_moneda', monedaActual);
    
    actualizarBotonMoneda();
    actualizarInterfaz();
}

function actualizarBotonMoneda() {
    const btn = document.getElementById('toggleMoneda');
    if (btn) {
        btn.textContent = monedaActual === '€' ? 'Cambiar a Dólares (USD)' : 'Cambiar a Euros (EUR)';
    }
}

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

    if (prod && cant > 0 && prec > 0) {
        gastos.push({ 
            nombre: prod, 
            cantidad: cant, 
            precio: prec, 
            total: cant * prec 
        });
        localStorage.setItem('tope_gastos', JSON.stringify(gastos));
        actualizarInterfaz();
        
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
        // Tras borrar todo, reiniciamos moneda a defecto si lo deseas, 
        // o mantenemos la actual:
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const lista = document.getElementById('listaGastos');
    const totalMesLabel = document.getElementById('totalMes');
    const restanteLabel = document.getElementById('restante');
    const containerBarras = document.getElementById('containerBarras');
    
    // Elementos del HTML que añadimos en el paso anterior para que el símbolo cambie
    const labelMonedaSueldo = document.getElementById('labelMonedaSueldo');
    const simboloTotal = document.getElementById('simboloTotal');
    
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
                    <small>${g.cantidad} x ${g.precio.toFixed(2)}${monedaActual}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px">
                    <span style="font-weight:bold">${g.total.toFixed(2)}${monedaActual}</span>
                    <button onclick="borrarGasto(${i})" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🗑️</button>
                </div>
            </div>`;
    });

    // Actualizar Totales numéricos
    totalMesLabel.textContent = sumaTotal.toFixed(2);
    const restante = sueldo - sumaTotal;
    restanteLabel.textContent = restante.toFixed(2) + monedaActual;
    restanteLabel.style.color = restante < 0 ? "#ef4444" : "#3b82f6";

    // ACTUALIZACIÓN DE SÍMBOLOS ESTÁTICOS
    if (labelMonedaSueldo) labelMonedaSueldo.textContent = monedaActual;
    if (simboloTotal) simboloTotal.textContent = monedaActual;

    // Dibujar las barras
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
// --- LÓGICA DEL CONVERSOR ---

// Tasas de cambio de referencia (Base 1 EUR)
const tasasCambio = {
    "EUR": 1,
    "USD": 1.08,
    "MXN": 18.50,
    "GBP": 0.85
};

function abrirConversor() {
    document.getElementById('modalConversor').style.display = 'flex';
}

function cerrarConversor() {
    document.getElementById('modalConversor').style.display = 'none';
}

function calcularConversion() {
    const monto = parseFloat(document.getElementById('convMonto').value) || 0;
    const de = document.getElementById('monedaDe').value;
    const a = document.getElementById('monedaA').value;

    // Convertir la entrada a la base (EUR) y luego a la moneda destino
    const montoEnEur = monto / tasasCambio[de];
    const resultado = montoEnEur * tasasCambio[a];

    document.getElementById('convResultado').textContent = resultado.toFixed(2);
}

function usarResultado() {
    const resultado = document.getElementById('convResultado').textContent;
    const inputPrecio = document.getElementById('precio');
    
    if (inputPrecio && resultado !== "0.00") {
        inputPrecio.value = resultado;
        cerrarConversor();
        // Feedback visual para el usuario
        inputPrecio.focus();
    }
}