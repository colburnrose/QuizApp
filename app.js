/********** TEMPLATE GENERATION FUNCTIONS **********/

// These functions return HTML templates
function showStart() {
  return `<section id="start-screen">
        <h1>Photography Quiz</h1>
        <button id="start">Start Quiz</button>
    </section>`;
}

function generateHeaderTemplate() {
  return `<header>
        <h2>Photography Quiz 2020</h2>
        <p class="score">Score: </p>
        <p class="progress">0/0</p>
</header>`;
}

function generateFeedback() {
  return `<section id="feedback">
        <h2></h2>
        <p class="score">Score: </p>
        <p class="user-answer"></p>
        <p class="correct-answer"></p>
        <button id="next">Next question</button>
    </section>`;
}

function generateSummaryReport() {
  return `<section id="summary">
        <h1>Summary</h1>
        <p></p>
        <button class="btn-primary" id="restart">Restart Quiz</button>
</section>`;
}

/********** RENDER FUNCTION(S) **********/

// This function conditionally replaces the contents of the <main> tag based on the state of the store
function render() {
  $("header").hide();
  $("#summary").hide();

  if (!STORE.quizStarted) {
    // show start page
    $("main").html(showStart());
  } else if (STORE.hasFeedback) {
    renderFeeback();
  } else if (STORE.currentQuestion < STORE.questions.length) {
    $("main").html(renderQuestion());
  } else {
    renderSummary();
  }
}

// FUNC: render Question
function renderQuestion() {
  const question = STORE.questions[STORE.currentQuestion];
  return `<form>
    <h2>Question: ${STORE.currentQuestion + 1}/5</h2>
    <h2>${question.title}</h2>
        <ul>
            ${question.answers
              .map(
                (answer, i) => `<li><input type="radio" 
            name="answer" value="${i}" id='${i}'/><label for='${i}'>
            ${answer}</label> </li>`
              )
              .join("")}
            <button id="submit-answer" >Submit</button>
        </ul>
    </form>
    `;
}

function renderFeeback() {
  $("main").html(generateFeedback());
  $("#feedback h2").text(STORE.hasFeedback);
  $(".user-answer").text("");
  const question = STORE.questions[STORE.currentQuestion];
  if (STORE.hasFeedback === "Incorrect") {
    $(".user-answer").text(`You answered ${STORE.guess}`);
  }
  // update to render score to the user.
  $(".score").text(
    `You scored ${STORE.score} out of ${STORE.questions.length}`
  );
  $(".correct-answer").text(
    `The correct answer was ${question.answers[question.correctAnswer]} for, "${
      question.title
    }"`
  );
}

function renderSummary() {
  $("main").html(generateSummaryReport());

  $("#summary").show();
  $("#summary p").text(
    `You scored ${STORE.score} out of ${STORE.questions.length}`
  );
}

/********** EVENT HANDLER FUNCTIONS **********/
// FUNC: handle start quiz
function startQuiz() {
  $("main").on("click", "#start", (e) => {
    STORE.quizStarted = true;
    render();
  });
}
// FUNC: handle form submission
function submitAnswer() {
  $("main").on("click", "#submit-answer", (e) => {
    e.preventDefault();
    const answer = $('input[type="radio"]:checked').val();
    const question = STORE.questions[STORE.currentQuestion];
    // check to prevent skipping a unanswered question.
    if (answer) {
      if (Number(answer) === question.correctAnswer) {
        STORE.score++;
        STORE.hasFeedback = "Correct";
        $("main").html(generateHeaderTemplate());
      } else {
        STORE.guess = STORE.questions[STORE.currentQuestion].answers[answer];
        STORE.hasFeedback = "Incorrect";
      }
      render();
    } else {
      alert("Please select an answer");
    }
  });
}

// FUNC: handle next question
function nextQuestion() {
  $("main").on("click", "#next", (e) => {
    e.stopPropagation();

    STORE.hasFeedback = false;
    STORE.currentQuestion = STORE.currentQuestion + 1;
    render();
  });
}

// FUNC: handle restart quiz
// SETs back to default values.
function restartQuiz() {
  $("main").on("click", "#restart", (e) => {
    STORE.quizStarted = false;
    STORE.currentQuestion = 0;
    STORE.score = 0;
    render();
  });
}

// stuff that needs to be ready when the page loads
function main() {
  render();
  startQuiz();
  submitAnswer();
  nextQuestion();
  restartQuiz();
}

$(main);
