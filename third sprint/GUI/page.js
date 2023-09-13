import renderMap from './render.js';
import { checkWorld } from '../logic/checks.js';
import BugBrain from '../logic/BugBrain.js';
import World from '../logic/World.js';
import Engine from '../logic/Engine.js';
import { parseProgram } from '../logic/instructions.js';
import { CellCondition } from '../logic/CellCondition.js';

/* global chai */
const { expect, assert } = chai;

/**
 * Switches currently visible div to the new div
 * @param {string} currentDiv - id of the current div to be hidden
 * @param {string} newDiv - id of the new div to be shown
 */
function showDiv(currentDiv, newDiv) {
  // Hide the current div
  const current = document.getElementById(currentDiv);
  current.classList.remove('box');
  current.classList.add('hidden');

  // Show the new div
  const newD = document.getElementById(newDiv);
  newD.classList.remove('hidden');
  newD.classList.add('box');
}

/**
 * Creates a Promise that reads file `fileName` and applies `checker` to it.
 * If successful, the promise is resolved with the file content, otherwise it is rejected.
 * @param {string} file
 * @param {function} checker
 * @returns {Promise}
 */
function readAndCheck(file, checker) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const checkResult = checker(fileContent);
      if (checkResult.success) {
        resolve(fileContent);
      } else {
        alert(checkResult.message);
        reject();
      }
    };
    try {
      reader.readAsText(file);
    } catch (error) {
      alert('Can\'t read file, check that it was uploaded correctly.');
      resolve('');
    }
  });
}

/**
 * Applies Engine to update current World by one step.
 */
function simulateOneStep() {
  const world = World.deserialize(sessionStorage.getItem('world'));
  const steps = Number.parseInt(sessionStorage.getItem('steps'), 10);
  const engine = new Engine(world, steps);
  engine.update();
  sessionStorage.setItem('world', world.serialize());
  sessionStorage.setItem('steps', steps.toString());
}

/**
 * Reads the contents of the map file and checks its formatting
 * @param {File} mapFile - map file to be read
 * @param {File} redFile - red bug file
 * @param {File} blackFile - black bug file
 */
function assemble(mapFile, redFile, blackFile) {
  const checkBug = (code) => ({ success: true }); // TODO proper syntax checker for bug programs

  const mapPromise = readAndCheck(mapFile, checkWorld);
  const redPromise = readAndCheck(redFile, checkBug);
  const blackPromise = readAndCheck(blackFile, checkBug);

  Promise.all([mapPromise, redPromise, blackPromise])
    .then(([map, redCode, blackCode]) => {
      const redBrain = new BugBrain(parseProgram(redCode));
      const blackBrain = new BugBrain(parseProgram(blackCode));

      const world = World.fromString(map, redBrain, blackBrain);
      sessionStorage.setItem('world', world.serialize());
      sessionStorage.setItem('steps', '0');

      showDiv('upload-div', 'main-div');
      // Set up regular updates to GUI
      const framesPerSecond = 24;
      setInterval(renderMap, 1000 / framesPerSecond);
      // Set up regular updates to world state
      const stepsPerSecond = 1;
      setInterval(simulateOneStep, 1000 / stepsPerSecond);
      // Trigger render right now, to initialize the GUI
      renderMap();
    })
    .catch((reason) => console.log(reason));
}

/**
 * Submits the form and checks if map file is uploaded
 * @param {Event} event - event object
 */
function submitForm(event) {
  event.preventDefault(); // prevent the form from submitting

  const mfile = document.getElementById('mapfile').files;
  const mapfile = mfile[0];
  const rbfile = document.getElementById('rbfile').files[0];
  const bbfile = document.getElementById('bbfile').files[0];
  const ifLog = document.getElementById('log');

  const logsDiv = document.getElementById('logs-div'); // show logs if checkbox is marked
  if (ifLog.checked) {
    logsDiv.classList.remove('hidden');
  } else {
    logsDiv.classList.add('hidden');
  }
  // Check if map file is uploaded
  if (mfile.length === 0) {
    alert('No map file uploaded');
  } else {
    assemble(mapfile, rbfile, bbfile);
  }
}

function updateFileName(fileID, fileName) {
  const file = document.getElementById(fileID);
  const fileNameElement = document.getElementById(fileName);
  fileNameElement.innerText = file.files[0].name;
}

/**
 * Shows the ending div after confirming with the user
 */
function showEnding() {
  const result = confirm('You are quitting this game');
  if (result === true) {
    showDiv('main-div', 'ending-div');
  } else {
    // do nothing
  }
}

/**
 * Updates the simulation settings
 * @param {int} iterations - number of iterations
 * @param {int} tickPerSec - simulation frequency
 */
function update(iterations, tickPerSec) {
  // update simulation settings
}

/**
 * Resumes the game with updated simulation settings
 */
function resume() {
  const iterations = document.getElementById('iterations');
  const tickTimeS = document.getElementById('tickTimeS');
  update(iterations, tickTimeS);

  showDiv('options-div', 'main-div');
}

// Set up all event listeners
document.getElementById('startButton').onclick = () => showDiv('starting-div', 'upload-div');
document.getElementById('mapfile').onchange = () => updateFileName('mapfile', 'mapfileName');
document.getElementById('rbfile').onchange = () => updateFileName('rbfile', 'rbfileName');
document.getElementById('bbfile').onchange = () => updateFileName('bbfile', 'bbfileName');
document.getElementById('optionsButton').onclick = () => showDiv('main-div', 'options-div');
document.getElementById('quitButton').onclick = () => showEnding();
document.getElementById('uploadButton').onclick = (event) => submitForm(event);
document.getElementById('continueButton').onclick = () => resume();
document.getElementById('restartButton').onclick = () => showDiv('ending-div', 'starting-div');
