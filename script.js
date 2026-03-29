let gastos = JSON.parse(localStorage.getItem('mis_gastos')) || []; 
let totalGeneral = 0;

// Cargar datos al iniciar
window.onload = () => {
    actualizarTabla();
    actualizarBarras();
};

function guardarEnLocal() {
    localStorage.setItem('mis_gastos', JSON.stringify(gastos));
}

function agregarGasto() {
    const producto = document.getElementById('producto').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('precio').value);
    
    if (producto && cantidad && precio) {
        const subtotal = cantidad * precio;
        gastos.push({ producto, cantidad, precio, subtotal });
        
        guardarEnLocal();
        actualizarTabla();
        actualizarBarras();
        
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precio').value = '';
    }
}

function actualizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '';
    totalGeneral = 0;
    
    gastos.forEach((gasto, index) => {
        totalGeneral += gasto.subtotal;
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${gasto.producto}</td>
            <td>${gasto.cantidad}</td>
            <td>${gasto.precio.toFixed(2)}€</td>
            <td>${gasto.subtotal.toFixed(2)}€</td>
            <td><button onclick="borrarGasto(${index})">🗑️</button></td>
        `;
    });
    
    document.getElementById('totalMes').textContent = totalGeneral.toFixed(2);
}

function borrarGasto(index) {
    gastos.splice(index, 1);
    guardarEnLocal();
    actualizarTabla();
    actualizarBarras();
}

function actualizarBarras() {
    const container = document.getElementById('containerBarras');
    container.innerHTML = '';
    if (totalGeneral === 0) return;
    
    gastos.forEach(gasto => {
        const porcentaje = ((gasto.subtotal / totalGeneral) * 100).toFixed(1);
        const barraDiv = document.createElement('div');
        barraDiv.className = 'barra-item';
        barraDiv.innerHTML = `
            <div style="margin-bottom:5px"><b>${gasto.producto}</b> (${porcentaje}%)</div>
            <div style="background:#444; border-radius:10px; height:20px; width:100%">
                <div style="background:var(--accent); width:${porcentaje}%; height:100%; border-radius:10px"></div>
            </div>
        `;
        container.appendChild(barraDiv);
    });
}