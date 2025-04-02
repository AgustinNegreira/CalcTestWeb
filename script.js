// Obtener referencias a los elementos HTML
const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer-button");
const historyList = document.getElementById("results-list");
const nextButton = document.getElementById("next-btn");
const resultOutcome = document.getElementById("result-text");

let correctAnswer = 0; // Guardará la respuesta correcta

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
    
    // Agregar el resultado al historial
    const listItem = document.createElement("li");
    listItem.textContent = `${questionText.textContent} Respuesta: ${selectedAnswer} → ${resultText}`;
    historyList.prepend(listItem); // Agregarlo al inicio del historial

    resultOutcome.textContent = resultText;
    // Generar una nueva pregunta después de un breve retraso
    setTimeout(generateQuestion, 500);
}

// Evento para cambiar de pregunta cuando se presiona el botón "Next Question"
nextButton.addEventListener("click", generateQuestion);

// Genera una pregunta inicial cuando se carga la página
window.onload = generateQuestion;