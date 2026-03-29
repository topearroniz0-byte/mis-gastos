let gastos = []; // Array para guardar todos los gastos
let totalGeneral = 0;

function agregarGasto() {
    const producto = document.getElementById('producto').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('precio').value);
    
    if (producto && cantidad && precio) {
        const subtotal = cantidad * precio;
        const gasto = {
            producto: producto,
            cantidad: cantidad,
            precio: precio,
            subtotal: subtotal
        };
        
        gastos.push(gasto);
        totalGeneral += subtotal;
        
        actualizarTabla();
        actualizarBarras();
        
        // Limpiar
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precio').value = '';
    }
}

function actualizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '';
    
    gastos.forEach((gasto, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${gasto.producto}</td>
            <td>${gasto.cantidad}</td>
            <td><input type="number" class="editable" value="${gasto.precio.toFixed(2)}" onchange="editarGasto(${index}, 'precio', this.value)" step="0.01"></td>
            <td>${gasto.subtotal.toFixed(2)}€</td>
            <td><button onclick="borrarGasto(${index})">🗑️</button></td>
        `;
    });
    
    document.getElementById('totalMes').textContent = totalGeneral.toFixed(2);
}

function editarGasto(index, campo, nuevoValor) {
    const gasto = gastos[index];
    const valorAnterior = gasto[campo];
    
    gasto[campo] = parseFloat(nuevoValor);
    gasto.subtotal = gasto.cantidad * gasto.precio;
    
    totalGeneral += (gasto.subtotal - (valorAnterior * gasto.cantidad));
    
    actualizarTabla();
    actualizarBarras();
}

function borrarGasto(index) {
    totalGeneral -= gastos[index].subtotal;
    gastos.splice(index, 1);
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
            <div class="barra-etiqueta">${gasto.producto}: ${gasto.subtotal.toFixed(2)}€ (${porcentaje}%)</div>
            <div class="barra">
                <div class="barra-fill" style="width: ${porcentaje}%" data-porcentaje="${porcentaje}"></div>
            </div>
        `;
        container.appendChild(barraDiv);
    });
}

// Permitir Enter para agregar gasto
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') agregarGasto();
});
