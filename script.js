// Contraseñas por grupo (ahora con múltiples contraseñas por grupo)
const CONTRASEÑAS = {
  "Grupo1": ["20231245017", "20231245010"],
  "Grupo2": ["20231245022", "20231245013"],
  "Grupo3": ["20231245042", "20231245023"],
  "Grupo4": ["20231245031", "20231245032"],
  "Grupo5": ["20231245054", "2023124502"],
  "Grupo6": ["20231245008", "20231245012"],
  "Grupo7": ["20231245046", "20231245030"],
  "Grupo8": ["20231245024", "20211245023"],
  "Grupo9": ["9914506"],
  "Grupo10": ["20222245040", "20222245010"]
};

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const grupo = document.getElementById('grupo').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');
  
  // Validar credenciales
  if (!grupo || !password) {
    showMessage('Por favor completa todos los campos', 'error');
    return;
  }
  
  // Verificar si la contraseña es válida para el grupo
  if (!CONTRASEÑAS[grupo].includes(password)) {
    showMessage('Contraseña incorrecta para este grupo', 'error');
    return;
  }
  
  // Cargar la rúbrica del grupo desde localStorage
  const rubricaGuardada = localStorage.getItem(`rubrica-${grupo}`);
  
  if (!rubricaGuardada) {
    showMessage('Aún no hay una rúbrica disponible para este grupo', 'error');
    return;
  }
  
  // Mostrar la rúbrica
  mostrarRubrica(grupo, JSON.parse(rubricaGuardada));
});

function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }, 3000);
}

function mostrarRubrica(grupo, datos) {
  // Crear HTML de la rúbrica
  const rubricaHTML = `
    <div class="rubrica-container">
      <h2 class="rubrica-title">Rúbrica de Evaluación - ${grupo.replace("Grupo", "Grupo ")}</h2>
      <div class="rubrica-info">
        <p><strong>Integrantes:</strong> ${getIntegrantes(grupo)}</p>
        <p><strong>Fecha de evaluación:</strong> ${new Date(datos.fechaEvaluacion || Date.now()).toLocaleDateString()}</p>
      </div>
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
              <td class="criterio">${criterio.nombre}</td>
              <td>${criterio.puntos}</td>
              <td class="${criterio.nivel.toLowerCase()}">${criterio.nivel}</td>
              <td>${criterio.descripcion}</td>
              <td>${criterio.observaciones || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="resultado-final">
        <p><strong>Puntuación total:</strong> ${datos.puntuacionTotal.toFixed(1)} / 100</p>
        <p><strong>Resultado:</strong> ${datos.concepto}</p>
      </div>
      <button onclick="window.location.href='index.html'" style="margin-top: 20px;">
        Volver al inicio
      </button>
    </div>
  `;
  
  // Reemplazar el contenido de la página
  document.body.innerHTML = rubricaHTML;
}

function getIntegrantes(grupo) {
  const grupos = {
    "Grupo1": "Paula y Julieth",
    "Grupo2": "Estefania y Thalia",
    "Grupo3": "María José y Santiago",
    "Grupo4": "Jhon Jairo y William",
    "Grupo5": "Jeidy y Stip",
    "Grupo6": "Daniel y Nataly",
    "Grupo7": "Laura y Iris",
    "Grupo8": "Ana y Andrés",
    "Grupo9": "Carlos",
    "Grupo10": "Nicole y Jean Paul"
  };
  return grupos[grupo] || "Integrantes del grupo";
}