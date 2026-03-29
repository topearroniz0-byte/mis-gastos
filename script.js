let gastos = JSON.parse(localStorage.getItem('tope_gastos')) || [];
let sueldo = parseFloat(localStorage.getItem('tope_sueldo')) || 0;

window.onload = () => {
    if(sueldo > 0) document.getElementById('sueldo').value = sueldo;
    actualizarInterfaz();
};

function guardarSueldo() {
    const nuevoSueldo = parseFloat(document.getElementById('sueldo').value);
    sueldo = isNaN(nuevoSueldo) ? 0 : nuevoSueldo;
    localStorage.setItem('tope_sueldo', sueldo);
    actualizarInterfaz();
}

function agregarGasto() {
    const prod = document.getElementById('producto').value;
    const cant = parseFloat(document.getElementById('cantidad').value);
    const prec = parseFloat(document.getElementById('precio').value);

    if (prod && cant > 0 && prec > 0) {
        gastos.push({ 
            nombre: prod, 
            cantidad: cant, 
            precio: prec, 
            total: cant * prec 
        });
        localStorage.setItem('tope_gastos', JSON.stringify(gastos));
        actualizarInterfaz();
        
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precio').value = '';
    }
}

function borrarGasto(index) {
    gastos.splice(index, 1);
    localStorage.setItem('tope_gastos', JSON.stringify(gastos));
    actualizarInterfaz();
}

function limpiarTodo() {
    if(confirm("¿Reiniciar todos los datos del mes?")) {
        gastos = [];
        sueldo = 0;
        localStorage.clear();
        document.getElementById('sueldo').value = '';
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const lista = document.getElementById('listaGastos');
    const totalMesLabel = document.getElementById('totalMes');
    const restanteLabel = document.getElementById('restante');
    const containerBarras = document.getElementById('containerBarras');
    
    lista.innerHTML = '';
    containerBarras.innerHTML = '';
    let sumaTotal = 0;

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
                    <button onclick="borrarGasto(${i})" style="background:none; border:none; cursor:pointer">🗑️</button>
                </div>
            </div>`;
    });

    totalMesLabel.textContent = sumaTotal.toFixed(2);
    const restante = sueldo - sumaTotal;
    restanteLabel.textContent = restante.toFixed(2) + "€";
    restanteLabel.style.color = restante < 0 ? "#ef4444" : "#3b82f6";

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