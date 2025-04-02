function newQuestion() {
    //Dos numeros aleatorios
    const num1 = Math.floor(Math.random() * 50);
    const num2 = Math.floor(Math.random() *50);
    const correctResult = num1 + num2;

    let answers = [correctResult];
    while (answers.length < 4) {
        let option = correctResult + Math.floor(Math.random() * 10) - 5;
        if (!answers.includes(option)) answers.push(option);
    }

    answers.sort(() => Math.random() - 0.5);

    if (typeof showQuestion === "function") {
        showOptions(answers, correctResult);

    }

}

function checkAnswers(answer, correctResult) {
    if (answer === correctResult) {
        if (typeof showResult === "function") {
            showResult("Right!");

        }
    }   else {
        if (typeof showResult === "function") {
            showResult("Try again");

        }
    }
    setTimeout(newQuestion, 1000);
}

newQuestion();