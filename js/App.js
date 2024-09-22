// Arrays para almacenar ingresos y egresos
const ingresos = [];
const egresos = [];

// Función principal para cargar la aplicación
let cargarApp = () => {
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
};


// Calcular el total de ingresos
let totalIngresos = () => {
    let totalIngreso = 0;
    for (let ingreso of ingresos) {
        totalIngreso += ingreso.valor;
    }
    return totalIngreso;
};

// Calcular el total de egresos
let totalEgresos = () => {
    let totalEgreso = 0;
    for (let egreso of egresos) {
        totalEgreso += egreso.valor;
    }
    return totalEgreso;
};


// Calcular el porcentaje de egresos sobre el total de ingresos y egresos
let porcentajeEgresos = () => {
    let ingresosTotales = totalIngresos();
    let egresosTotales = totalEgresos();
    // Calcula el porcentaje de egresos respecto a los ingresos, evitando división por cero
    return ingresosTotales > 0 ? (egresosTotales / ingresosTotales) * 100 : 0;
};

// Calcular el porcentaje de ingresos sobre el total de ingresos y egresos
let porcentajeIngresos = () => {
    let total = totalIngresos() - totalEgresos();
    // Evitar división por cero y calcular el porcentaje de ingresos sobre el total
    return total > 0 ? ((total) * 100)/ totalIngresos() : 0;
};

// Cargar cabecero con los valores de ingresos, egresos y sus porcentajes
let cargarCabecero = () => {
    let presupuesto = totalIngresos() - totalEgresos();
    let porcentajeIngreso = porcentajeIngresos();
    let porcentajeEgreso = porcentajeEgresos();
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('ingresos').innerHTML = `${formatoMoneda(totalIngresos())} (${porcentajeIngreso.toFixed(2)}%)`;
    document.getElementById('egresos').innerHTML = `${formatoMoneda(totalEgresos())} (${porcentajeEgreso.toFixed(2)}%)`;
};

// Calcular el porcentaje individual de un ingreso
const porcentajeIndividualIngreso = (valor) => {
    let totalIngreso = totalIngresos();
    return totalIngreso > 0 ? (valor / totalIngreso) * 100 : 0;
};

// Calcular el porcentaje individual de un egreso
const porcentajeIndividualEgreso = (valor) => {
    let totalEgreso = totalEgresos();
    return totalEgreso > 0 ? (valor / totalEgreso) * 100 : 0;
};


// Formatear valores en formato de moneda
const formatoMoneda = (valor) => {
    return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
};

// Cargar lista de ingresos
const cargarIngresos = () => {
    let ingresosHTML = '';
    for (let ingreso of ingresos) {
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
};

// HTML para cada ingreso con checkbox
const crearIngresoHTML = (ingreso) => {
    let ingresoHTML = `
    <div class="elemento limpiarEstilos">
        <input type="checkbox" class="seleccionable">
        <div class="elemento_descripcion">${ingreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
            <button type="button" class="elemento_eliminar--btn" onclick='eliminarIngreso(${ingreso.id})'>
                Borrar
            </button>
        </div>
    </div>`;
    return ingresoHTML;
};


// Eliminar un ingreso por su ID
const eliminarIngreso = (id) => {
    let indiceEliminar = ingresos.findIndex(ingreso => ingreso.id === id);
    ingresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarIngresos();
};

// Cargar lista de egresos
const cargarEgresos = () => {
    let egresosHTML = '';
    for (let egreso of egresos) {
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
};

// HTML para cada egreso con checkbox
const crearEgresoHTML = (egreso) => {
    let egresoHTML = `
    <div class="elemento limpiarEstilos">
        <input type="checkbox" class="seleccionable">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
            <div class="elemento_eliminar">
                <button type="button" class="elemento_eliminar--btn" onclick='eliminarEgreso(${egreso.id})'>
                    Borrar
                </button>
            </div>
        </div>
    </div>`;
    return egresoHTML;
};

// Eliminar un egreso por su ID
const eliminarEgreso = (id) => {
    let indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
};

// Función para agregar ingresos o egresos desde el formulario
let agregarDato = () => {
    let forma = document.forms['forma'];
    let tipo = forma['tipo'];
    let descripcion = forma['descripcion'];
    let valor = forma['valor'];
    if (descripcion.value !== '' && valor.value !== '') {
        if (tipo.value === 'ingreso') {
            ingresos.push(new Ingreso(descripcion.value, +valor.value));
            cargarCabecero();
            cargarIngresos();
        } else if (tipo.value === 'egreso') {
            egresos.push(new Egreso(descripcion.value, +valor.value));
            cargarCabecero();
            cargarEgresos();
        }
    }
};

// Función para eliminar elementos seleccionados (checkbox)
function eliminarSeleccionados() {
    // Eliminar ingresos seleccionados
    document.querySelectorAll('#lista-ingresos .seleccionable:checked').forEach((checkbox) => {
        let ingresoElement = checkbox.closest('.elemento');
        let descripcion = ingresoElement.querySelector('.elemento_descripcion').innerText;
        let indiceEliminar = ingresos.findIndex(ingreso => ingreso.descripcion === descripcion);
        ingresos.splice(indiceEliminar, 1);
    });

    // Eliminar egresos seleccionados
    document.querySelectorAll('#lista-egresos .seleccionable:checked').forEach((checkbox) => {
        let egresoElement = checkbox.closest('.elemento');
        let descripcion = egresoElement.querySelector('.elemento_descripcion').innerText;
        let indiceEliminar = egresos.findIndex(egreso => egreso.descripcion === descripcion);
        egresos.splice(indiceEliminar, 1);
    });

    // Recargar los datos
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}

// Función para exportar a Excel (CSV) con columnas separadas para ingresos y egresos
function exportarExcel() {
    // Encabezados de las columnas
    let data = [['Descripcion', 'Egreso', 'Ingreso']];

    // Itera sobre los ingresos y agrega los valores a la columna de ingreso dejando la de egreso vacía
    ingresos.forEach((ingreso) => {
        data.push([ingreso.descripcion, '', ingreso.valor]); // Ingresa el valor en la columna de ingreso
    });

    // Itera sobre los egresos y agrega los valores a la columna de egreso dejando la de ingreso vacía
    egresos.forEach((egreso) => {
        data.push([egreso.descripcion, egreso.valor, '']); // Ingresa el valor en la columna de egreso
    });

    // Convierte los datos a un archivo CSV
    let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "presupuesto.csv");
    document.body.appendChild(link);
    link.click();
}

// Función para eliminar todos los ingresos y egresos
function eliminarTodo() {
    // Vacía los arrays de ingresos y egresos
    ingresos.length = 0;
    egresos.length = 0;

    // Actualiza el cabecero y las listas de ingresos y egresos
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}
