//script principal para la gestión de estudiantes y cálculo de promedios
const students = [];
const table = document.getElementById("studentsTable");
const tableBody = table.querySelector("tbody");
const form = document.getElementById("studentForm");
const averageDiv = document.getElementById("average");

let editIndex = -1;

document.getElementById("studentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const firstName = document.getElementById("name").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const grade = document.getElementById("grade").value;
//Referencias a los mensajes de error
  const nameError = document.getElementById("name-error");
  const lastNameError = document.getElementById("lastName-error");
  const gradeError = document.getElementById("grade-error");

  let isValid = true;

  // Validación del Nombre
  if (!firstName) {
    nameError.textContent = "Por favor, complete el campo Nombre.";
    isValid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(firstName)) {
    nameError.textContent = "El nombre solo puede contener letras y espacios.";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  // Validación del Apellido
  if (!lastName) {
    lastNameError.textContent = "Por favor, complete el campo Apellido.";
    isValid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(lastName)) {
    lastNameError.textContent = "El apellido solo puede contener letras y espacios.";
    isValid = false;
  } else {
    lastNameError.textContent = "";
  }

  // Validación de la Calificación
  if (!grade) {
    gradeError.textContent = "Por favor, ingrese una calificación.";
    isValid = false;
  } else if (isNaN(parseFloat(grade)) || parseFloat(grade) < 1 || parseFloat(grade) > 7) {
    gradeError.textContent = "Por favor, ingrese una calificación entre 1.0 y 7.0.";
    isValid = false;
  } else {
    gradeError.textContent = "";
  }
//si no es valido detener el proceso
  if (!isValid) return;
//crea un objeto estudiante c
  const student = {
    firstName: firstName,
    lastName: lastName,
    grade: parseFloat(grade)
  };
//agregar o actualizar estudiante
  if(editIndex === -1) {
    students.push(student);
  }
  else {
    students[editIndex] = student;
    editIndex = -1;
  }
//actualizar tabla y promedio
  actualizarTabla();
  calcularPromedio();
// reiniciar el formulario
  this.reset();
//limpiar mensajes de error
  nameError.textContent = "";
  lastNameError.textContent = "";
  gradeError.textContent = "";
});

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("eliminar-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    students.splice(index, 1);
    actualizarTabla();
    calcularPromedio();
  }
  else if (e.target.classList.contains("editar-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    editarEstudiante(index);
  }
  else if (e.target.classList.contains("actualizar-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    activarEdicionEnFila(index);
  }
});

function activarEdicionEnFila(index) {
  const row = tableBody.children[index];
  const student = students[index];
  if (!row) return;

  //Cambia fila a campos de edición
  row.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" value="${student.firstName}" id="editName${index}"></td>
    <td><input type="text" class="form-control form-control-sm" value="${student.lastName}" id="editLastName${index}"></td>
    <td><input type="number" class="form-control form-control-sm" value="${student.grade}" min="1" max="7" step="0.1" id="editGrade${index}"></td>
    <td class="d-flex gap-1 justify-content-center align-items-center">
      <button class="btn btn-success btn-sm guardar-btn" data-index="${index}">Guardar</button>
      <button class="btn btn-secondary btn-sm cancelar-btn" data-index="${index}">Cancelar</button>
    </td>
  `;
}

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("guardar-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    const nombre = document.getElementById(`editName${index}`).value.trim();
    const apellido = document.getElementById(`editLastName${index}`).value.trim();
    const nota = parseFloat(document.getElementById(`editGrade${index}`).value);

    // Validaciones detalladas para edición en la tabla
    if (!nombre) {
      alert("Por favor, complete el campo Nombre.");
      return;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(nombre)) {
      alert("El nombre solo puede contener letras y espacios.");
      return;
    }
    if (!apellido) {
      alert("Por favor, complete el campo Apellido.");
      return;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(apellido)) {
      alert("El apellido solo puede contener letras y espacios.");
      return;
    }
    if (isNaN(nota) || nota < 1 || nota > 7) {
      alert("Por favor, ingrese una calificación entre 1.0 y 7.0.");
      return;
    }
    students[index] = { firstName: nombre, lastName: apellido, grade: nota };
    actualizarTabla();
    calcularPromedio();
  } else if (e.target.classList.contains("cancelar-btn")) {
    actualizarTabla();
  }
});

function addStudentToTable(student, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student.firstName}</td>
    <td>${student.lastName}</td>
    <td>${student.grade}</td>
    <td class="d-flex gap-1 justify-content-center align-items-center">
      <button class="btn btn-success btn-sm actualizar-btn align-middle" data-index="${index}">Actualizar</button>
      <button class="btn btn-primary btn-sm editar-btn align-middle" data-index="${index}">Editar</button>
      <button class="btn btn-danger btn-sm eliminar-btn align-middle" data-index="${index}">Eliminar</button>
    </td>
  `;
  tableBody.appendChild(row);
}

function editarEstudiante(index) {
    const student=students[index];
    
    document.getElementById("name").value = student.firstName;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("grade").value = student.grade;

    editIndex = index;
}

function calcularPromedio() {
  if (students.length === 0) {
    averageDiv.textContent = "0.00";
    return;
  }

  const suma = students.reduce((acc, student) => acc + student.grade, 0);
  const promedio = suma / students.length;

  averageDiv.textContent = `${promedio.toFixed(2)}`;
}

function actualizarTabla() {
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    addStudentToTable(student, index);
  });
}
// ...código existente...

// Elementos para las estadísticas
const totalEstudiantesDiv = document.getElementById("total-estudiantes");
const cantidadAprobadosDiv = document.getElementById("cantidad-aprobados");
const cantidadReprobadosDiv = document.getElementById("cantidad-reprobados");

// Función para actualizar las estadísticas
function actualizarEstadisticas() {
    const totalEstudiantes = students.length;
    const cantidadAprobados = students.filter(student => student.grade >= 4.0).length;
    const cantidadReprobados = students.filter(student => student.grade < 4.0).length;

    // Actualizar el DOM
    totalEstudiantesDiv.textContent = totalEstudiantes;
    cantidadAprobadosDiv.textContent = cantidadAprobados;
    cantidadReprobadosDiv.textContent = cantidadReprobados;
}

// Modificar las funciones existentes para incluir la actualización de estadísticas
function calcularPromedio() {
    if (students.length === 0) {
        averageDiv.textContent = "0.00";
        return;
    }

    const suma = students.reduce((acc, student) => acc + student.grade, 0);
    const promedio = suma / students.length;

    averageDiv.textContent = `${promedio.toFixed(2)}`;
    actualizarEstadisticas(); // Llamar a la función de estadísticas
}

function actualizarTabla() {
    tableBody.innerHTML = "";

    students.forEach((student, index) => {
        addStudentToTable(student, index);
    });

    actualizarEstadisticas(); // Llamar a la función de estadísticas
}