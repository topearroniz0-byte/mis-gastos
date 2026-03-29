let gastos = JSON.parse(localStorage.getItem('tope_gastos')) || [];

window.onload = () => actualizarInterfaz();

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
        
        // Limpiar campos
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precio').value = '';
    } else {
        alert("Introduce datos válidos");
    }
}

function borrarGasto(index) {
    gastos.splice(index, 1);
    localStorage.setItem('tope_gastos', JSON.stringify(gastos));
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const lista = document.getElementById('listaGastos');
    const totalMes = document.getElementById('totalMes');
    const containerBarras = document.getElementById('containerBarras');
    
    lista.innerHTML = '';
    containerBarras.innerHTML = '';
    let sumaTotal = 0;

    gastos.forEach((g, i) => {
        sumaTotal += g.total;
        
        // Añadir a la lista
        lista.innerHTML += `
            <div class="gasto-item">
                <div>
                    <strong>${g.nombre}</strong><br>
                    <small>${g.cantidad} x ${g.precio}€</small>
                </div>
                <div>
                    <span>${g.total.toFixed(2)}€</span>
                    <button class="btn-delete" onclick="borrarGasto(${i})">🗑️</button>
                </div>
            </div>`;
    });

    totalMes.textContent = sumaTotal.toFixed(2);

    // Barras de progreso
    gastos.forEach(g => {
        const porc = ((g.total / sumaTotal) * 100).toFixed(1);
        containerBarras.innerHTML += `
            <div class="barra-item">
                <small>${g.nombre} (${porc}%)</small>
                <div class="barra-bg"><div class="barra-fill" style="width:${porc}%"></div></div>
            </div>`;
    });
}