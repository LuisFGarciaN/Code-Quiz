const QUIZ_SECTIONS = document.querySelectorAll(".quiz-section");
const START_SECTION = document.getElementById("start");
const START_BTN = document.getElementById("start-button");
const QUIZ_SECTION = document.getElementById("quiz-questions");
const TIME_REMAINING = document.getElementById("time-remaining");
const QUESTION = document.getElementById("question");
const CHOICES = document.getElementById("choices");
const CHOICE_STATUSES = document.querySelectorAll(".choice-status");
const CORRECT = document.getElementById("correct");
const WRONG = document.getElementById("wrong");
const END_SECTION = document.getElementById("end");
const END_TITLE = document.getElementById("end-title");
const SCORE = document.getElementById("score");
const INITIALS_INPUT = document.getElementById("initials");
const SUBMIT_SCORE = document.getElementById("submit-score");
const ERROR_MESSAGE = document.getElementById("error-message");


class Question {
  constructor(question, choices, indexOfCorrectChoice) {
    this.question = question;
    this.choices = choices;
    this.indexOfCorrectChoice = indexOfCorrectChoice;
  }
}
const QUESTION_1 = new Question("What is the difference between 'undefined' and 'null' in JavaScript?", 
  ["Unassigned", "Empty", "Undefined", "Null"], 2);
const QUESTION_2 = new Question("What is an event in JavaScript, and how can you handle it?", 
  ["Action", "Reaction", "Listener", "Selector"], 3);
const QUESTION_3 = new Question("How can you convert a string to a number in JavaScript?", 
  ["ParseInt", "ToNumber", "ParseFloat", "Number"], 4);
const QUESTION_4 = new Question("What are the differences between 'let', 'const', and 'var' in JavaScript?", 
  ["Scope", "Declaration", "Value", "Assignment"], 1);
const QUESTION_5 = new Question("How does JavaScript differ from other programming languages, and what are its unique features?", 
  ["Compiled", "Functional", "Typed", "Multi-threaded"], 2);
const QUESTION_LIST = [QUESTION_1, QUESTION_2, QUESTION_3, QUESTION_4, QUESTION_5];

let currentQuestion = 0;

let totalTime = 90;
let totalTimeInterval;
let choiceStatusTimeout; 


START_BTN.addEventListener('click', startGame);
CHOICES.addEventListener('click', processChoice);
SUBMIT_SCORE.addEventListener('submit', processInput);


function startGame() {
  showElement(QUIZ_SECTIONS, QUIZ_SECTION);
   
  displayTime();  
  displayQuestion();

  startTimer();
  
}


function showElement(siblingList, showElement) {
  for (element of siblingList) {
    hideElement(element);
  }
  showElement.classList.remove("hidden");
} 

function hideElement(element) {
  if (!element.classList.contains("hidden")) {
    element.classList.add("hidden");
  }
}


function displayTime() {
  TIME_REMAINING.textContent = totalTime;
}

function startTimer() {
  totalTimeInterval = setInterval(function() {
    totalTime--;
    displayTime();
    checkTime();

  }, 1000);
}

function checkTime() {
  if (totalTime <= 0) {
    totalTime = 0;
    endGame();
  }
}


function displayQuestion() {
  QUESTION.textContent = QUESTION_LIST[currentQuestion].question;

  displayChoiceList();
}

function displayChoiceList() {
  CHOICES.innerHTML = "";

  QUESTION_LIST[currentQuestion].choices.forEach(function(answer, index) {
    const li = document.createElement("li");
    li.dataset.index = index;
    const button = document.createElement("button");
    button.textContent = (index + 1) + ". " + answer;
    li.appendChild(button);
    CHOICES.appendChild(li);
  });
}


function processChoice(event) {
  const userChoice = parseInt(event.target.parentElement.dataset.index);

  resetChoiceStatusEffects();
  checkChoice(userChoice);
  getNextQuestion();
}


function resetChoiceStatusEffects() {
  clearTimeout(choiceStatusTimeout);
  styleTimeRemainingDefault();
}

function styleTimeRemainingDefault() {
  TIME_REMAINING.style.color = "#ffffff";
}

function styleTimeRemainingWrong() {
  TIME_REMAINING.style.color = "#cb3234";
}

function checkChoice(userChoice) {
  if (isChoiceCorrect(userChoice)) {
    displayCorrectChoiceEffects();
  } else {
    displayWrongChoiceEffects();
  }
}

function isChoiceCorrect(choice) {
  return choice === QUESTION_LIST[currentQuestion].indexOfCorrectChoice;
}

function displayWrongChoiceEffects() {
  deductTimeBy(10);

  styleTimeRemainingWrong();
  showElement(CHOICE_STATUSES, WRONG);

  choiceStatusTimeout = setTimeout(function() {
    hideElement(WRONG);
    styleTimeRemainingDefault();
  }, 1000);
}

function deductTimeBy(seconds) {
  totalTime -= seconds;
  checkTime();
  displayTime();
}

function displayCorrectChoiceEffects() {
  showElement(CHOICE_STATUSES, CORRECT);

  choiceStatusTimeout = setTimeout(function() {
    hideElement(CORRECT);
  }, 1000);
}


function getNextQuestion() {
  currentQuestion++;
  if (currentQuestion >= QUESTION_LIST.length) {
    endGame();
  } else {
    displayQuestion();
  }
}


function endGame() {
  clearInterval(totalTimeInterval);
  
  showElement(QUIZ_SECTIONS, END_SECTION);
  displayScore();
  setEndHeading();
}

function displayScore() {
  SCORE.textContent = totalTime;
}

function setEndHeading() {
  if (totalTime === 0) {
    END_TITLE.textContent = "Oops...Time Out!";
  } else {
    END_TITLE.textContent = "Well Done! You Finished!";
  }
}


function processInput(event) {
  event.preventDefault();

  const initials = INITIALS_INPUT.value.toUpperCase();

  if (isInputValid(initials)) {
    const score = totalTime;
    const scoreEntry = getNewscoreEntry(initials, score);
    savescoreEntry(scoreEntry);
    window.location.href= "/Code-Quiz/scores.html";
  }
}

function getNewscoreEntry(initials, score) {
  const entry = {
    initials: initials,
    score: score,
  }
  return entry;
}

function isInputValid(initials) {
  let errorMessage = "";
  if (initials === "") {
    errorMessage = "Please, provide your initilas.";
    displayFormError(errorMessage);
    return false;
  } else if (initials.match(/[^a-z]/ig)) {
    errorMessage = "Initials may only include letters.";
    displayFormError(errorMessage);
    return false;
  } else {
    return true;
  }
}

function displayFormError(errorMessage) {
  ERROR_MESSAGE.textContent = errorMessage;
  if (!INITIALS_INPUT.classList.contains("error")) {
    INITIALS_INPUT.classList.add("error");
  }
}

function savescoreEntry(highscoreEntry) {
  const currentScores = getScoreList();
  placeEntryInscoreList(highscoreEntry, currentScores);
  localStorage.setItem('scoreList', JSON.stringify(currentScores));
}

function getScoreList() {
  const currentScores = localStorage.getItem('scoreList');
  if (currentScores) {
    return JSON.parse(currentScores);
  } else {
    return [];
  }
}

function placeEntryInscoreList(newEntry, scoreList) {
  const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
  scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList) {
  if (scoreList.length > 0) {
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i].score <= newEntry.score) {
        return i;
      }
    } 
  }
  return scoreList.length;
}
