const students = [];
const table = document.getElementById("studentsTable");
const tableBody = table.querySelector("tbody");
const form = document.getElementById("studentForm");
const averageDiv = document.getElementById("average");
//obteniendo ref. a los elem <span> que estan en Index.html
const nameError = document.getElementById("name-error");
const lastNameError = document.getElementById("lastName-error");
const gradeError = document.getElementById("grade-error");

document.getElementById("studentForm").addEventListener("submit", function(e) {
  e.preventDefault(); 

  e.preventDefault();

const firstName = document.getElementById("name").value.trim();
const lastName = document.getElementById("lastName").value.trim();
const grade = document.getElementById("grade").value.trim(); // Obtener como cadena

let isValid = true; // Variable para controlar la validez

// Validación del Nombre
if (!firstName) {
    nameError.textContent = "Por favor, complete el campo Nombre.";
    isValid = false;
} else if (/\d/.test(firstName)) {
    nameError.textContent = "El nombre no puede contener números.";
    isValid = false;
} else {
    nameError.textContent = ""; // Limpiar el mensaje
}

// Validación del Apellido
if (!lastName) {
    lastNameError.textContent = "Por favor, complete el campo Apellido.";
    isValid = false;
} else if (/\d/.test(lastName)) {
    lastNameError.textContent = "El apellido no puede contener números.";
    isValid = false;
} else {
    lastNameError.textContent = ""; // Limpiar el mensaje
}

// Validación de la Calificación
if (!grade) {
    gradeError.textContent = "Por favor, ingrese una calificación.";
    isValid = false;
} else if (isNaN(parseFloat(grade)) || parseFloat(grade) < 1 || parseFloat(grade) > 7) {
    gradeError.textContent = "Por favor, ingrese una calificación entre 1.0 y 7.0.";
    isValid = false;
} else {
    gradeError.textContent = ""; // Limpiar el mensaje
}

// Si hay errores, detener el envío
if (!isValid) {
    return;
}

// Si la validación es exitosa, continuar
const student = {
    firstName: firstName,
    lastName: lastName,
    grade: parseFloat(grade) 
};

students.push(student);
addStudentToTable(student, students.length - 1);
calcularPromedio();
this.reset();
  
});

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("eliminar-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));

    students.splice(index, 1);
    
    actualizarTabla();
    calcularPromedio();
  }
});

function addStudentToTable(student, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student.firstName}</td>
    <td>${student.lastName}</td>
    <td>${student.grade}</td>
    </td>
  `;
  tableBody.appendChild(row);
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