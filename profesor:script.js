// Datos de los grupos
const grupos = [
  ["Grupo1", "Paula y Julieth"],
  ["Grupo2", "Estefania y Thalia"],
  ["Grupo3", "María José y Santiago"],
  ["Grupo4", "Jhon Jairo y William"],
  ["Grupo5", "Jeidy y Stip"],
  ["Grupo6", "Daniel y Nataly"],
  ["Grupo7", "Laura y Iris"],
  ["Grupo8", "Ana y Andrés"],
  ["Grupo9", "Carlos"],
  ["Grupo10", "Nicole y Jean Paul"]
];

// Criterios de evaluación
const CRITERIOS = [
  { nombre: "Objetivos", puntos: 15 },
  { nombre: "Justificación", puntos: 10 },
  { nombre: "Marco teórico", puntos: 15 },
  { nombre: "Descripción y recursos", puntos: 20 },
  { nombre: "Funciones semióticas", puntos: 10 },
  { nombre: "Metodología (Resolución de Problemas)", puntos: 15 },
  { nombre: "Evaluación de la clase", puntos: 15 }
];

const NIVELES = ["Excelente", "Satisfactorio", "Insuficiente"];
const DESCRIPCIONES = {
  "Objetivos": {
    "Excelente": "Claros, medibles y alineados con resolución de problemas.",
    "Satisfactorio": "Parcialmente coherentes pero sin claridad.",
    "Insuficiente": "No hay correspondencia con el contenido, son vagos o irrelevantes."
  },
  // Agrega descripciones para los demás criterios...
};

document.addEventListener("DOMContentLoaded", () => {
  // Crear pestañas para cada grupo
  grupos.forEach(([grupo, integrantes], idx) => {
    const tabBtn = document.createElement("button");
    tabBtn.innerText = grupo.replace("Grupo", "Grupo ");
    tabBtn.className = "tab-btn";
    tabBtn.onclick = () => cargarRubrica(grupo, integrantes);
    document.getElementById("tabs").appendChild(tabBtn);

    // Mostrar el primer grupo por defecto
    if (idx === 0) {
      cargarRubrica(grupo, integrantes);
    }
  });
});

function cargarRubrica(grupo, integrantes) {
  // Obtener datos guardados o crear nuevos
  const datosGuardados = localStorage.getItem(`rubrica-${grupo}`);
  const datos = datosGuardados ? JSON.parse(datosGuardados) : {
    criterios: CRITERIOS.map(c => ({
      ...c,
      nivel: "",
      descripcion: "",
      observaciones: ""
    })),
    puntuacionTotal: 0,
    concepto: ""
  };

  // Crear formulario de edición
  const html = `
    <div class="edicion-rubrica">
      <h3>${grupo.replace("Grupo", "Grupo ")} - ${integrantes}</h3>
      
      <table>
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Puntos</th>
            <th>Nivel</th>
            <th>Descripción</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          ${datos.criterios.map((criterio, i) => `
            <tr>
              <td>${criterio.nombre}</td>
              <td>${criterio.puntos}</td>
              <td>
                <select id="${grupo}-nivel-${i}" onchange="actualizarDescripcion('${grupo}', ${i})">
                  <option value="">Seleccionar</option>
                  ${NIVELES.map(n => `
                    <option value="${n}" ${criterio.nivel === n ? 'selected' : ''}>${n}</option>
                  `).join('')}
                </select>
              </td>
              <td id="${grupo}-desc-${i}">${criterio.descripcion}</td>
              <td>
                <textarea id="${grupo}-obs-${i}">${criterio.observaciones || ''}</textarea>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="resultado-final">
        <p><strong>Puntuación total:</strong> ${datos.puntuacionTotal.toFixed(1)} / 100</p>
        <p><strong>Resultado:</strong> ${datos.concepto}</p>
      </div>
      
      <button class="guardar-btn" onclick="guardarRubrica('${grupo}')">
        💾 Guardar Rúbrica
      </button>
    </div>
  `;

  document.getElementById("contenedor").innerHTML = html;
}

function actualizarDescripcion(grupo, index) {
  const select = document.getElementById(`${grupo}-nivel-${index}`);
  const nivel = select.value;
  const criterio = CRITERIOS[index].nombre;
  
  if (nivel && DESCRIPCIONES[criterio] && DESCRIPCIONES[criterio][nivel]) {
    document.getElementById(`${grupo}-desc-${index}`).textContent = DESCRIPCIONES[criterio][nivel];
  }
}

function guardarRubrica(grupo) {
  const datos = {
    criterios: [],
    puntuacionTotal: 0,
    concepto: ""
  };
  
  // Calcular puntuación
  let total = 0;
  const ponderaciones = { "Excelente": 0.9, "Satisfactorio": 0.7, "Insuficiente": 0.4 };
  
  CRITERIOS.forEach((criterio, i) => {
    const nivel = document.getElementById(`${grupo}-nivel-${i}`).value;
    const observaciones = document.getElementById(`${grupo}-obs-${i}`).value;
    const descripcion = document.getElementById(`${grupo}-desc-${i}`).textContent;
    
    datos.criterios.push({
      nombre: criterio.nombre,
      puntos: criterio.puntos,
      nivel: nivel,
      descripcion: descripcion,
      observaciones: observaciones
    });
    
    if (nivel && ponderaciones[nivel]) {
      total += ponderaciones[nivel] * criterio.puntos;
    }
  });
  
  datos.puntuacionTotal = total;
  datos.concepto = total < 60 ? "❌ No Aprobado" : 
                   total < 80 ? "⚠️ Aprobado con Recomendaciones" : 
                   "✅ Aprobado";
  
  // Guardar en localStorage
  localStorage.setItem(`rubrica-${grupo}`, JSON.stringify(datos));
  
  // Mostrar mensaje de éxito
  alert(`Rúbrica para ${grupo} guardada exitosamente!`);
  
  // Recargar la vista
  const integrantes = grupos.find(g => g[0] === grupo)[1];
  cargarRubrica(grupo, integrantes);
}