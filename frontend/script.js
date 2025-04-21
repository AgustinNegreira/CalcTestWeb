// Obtener referencias a los elementos HTML
const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer-button");
const historyList = document.getElementById("results-list");
const nextButton = document.getElementById("next-btn");

let correctAnswer = 0; // Guardará la respuesta correcta

const API_URL = "http://localhost:3000/results"; // url de la "api"

// Función para generar una nueva pregunta
function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)]; // Selecciona un operador al azar

    // Calculamos la respuesta correcta
    switch (operator) {
        case "+":
            correctAnswer = num1 + num2;
            break;
        case "-":
            correctAnswer = num1 - num2;
            break;
        case "*":
            correctAnswer = num1 * num2;
            break;
    }

    // Actualizar el texto de la pregunta
    questionText.textContent = `${num1} ${operator} ${num2} = ?`;

    // Generar respuestas incorrectas
    let answers = new Set();
    answers.add(correctAnswer);
    while (answers.size < 4) {
        let wrongAnswer = correctAnswer + (Math.floor(Math.random() * 5) - 2); // Número cercano a la respuesta
        if (wrongAnswer !== correctAnswer) {
            answers.add(wrongAnswer);
        }
    }

    // Mezclar las respuestas y asignarlas a los botones
    let answersArray = Array.from(answers).sort(() => Math.random() - 0.5);
    answerButtons.forEach((button, index) => {
        button.textContent = answersArray[index];
        button.onclick = () => checkAnswer(answersArray[index]);
    });
}

// Función para comprobar si la respuesta seleccionada es correcta
function checkAnswer(selectedAnswer) {
    const resultText = selectedAnswer === correctAnswer ? "✅ Correcto" : "❌ Incorrecto";
    const booleanResult = selectedAnswer === correctAnswer; 

    // Agregar el resultado al historial
    const listItem = document.createElement("li");
    listItem.textContent = `${questionText.textContent} Respuesta: ${selectedAnswer} → ${resultText}`;
    historyList.prepend(listItem); // Agregarlo al inicio del historial

    const resultEntry = {
        question: questionText.textContent,
        selectedAnswer,
        result: booleanResult
    };

    saveResult(resultEntry); // guardar respuesta en json server

    // Generar una nueva pregunta después de un breve retraso
    setTimeout(generateQuestion, 500);
}

// funcion para guardar ls respuesta en json server
function saveResult(resultEntry) {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultEntry)
    }).then(loadHistory);
}

// Cargar historial de respuestas desde el servidor
function loadHistory() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            historyList.innerHTML = "";
            data.reverse().forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.question} Respuesta: ${item.selectedAnswer} → ${item.result ? "✅ Correcto" : "❌ Incorrecto"}`;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "🗑️";
                deleteBtn.style.marginLeft = "10px";
                deleteBtn.onclick = () => deleteResult(item.id);

                li.appendChild(deleteBtn);
                historyList.appendChild(li);
            });
        });
}

function deleteResult(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(loadHistory);
}

// Evento para cambiar de pregunta cuando se presiona el botón "Next Question"
nextButton.addEventListener("click", generateQuestion);

// Genera una pregunta inicial cuando se carga la página y cargar historial del server
window.onload = () => {
    generateQuestion();
    loadHistory();
};