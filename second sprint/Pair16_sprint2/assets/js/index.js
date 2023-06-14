import { assemblertest } from './assembler/assemblertest.js';
import {simulationSettings,Simulation} from './simulator/simulation.js'
import { worldtest } from './assembler/worldtest.js'
import {gui} from './GUI/gui.js'

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

document.getElementById('submitButton').addEventListener('click', () => {

  const iterationInput = document.getElementById("iteration");
  const iterationValue = parseInt(iterationInput.value);
  const programs=[]

  const worldFile = document.getElementById('mapUpload').files[0];
  const team1CodeFile = document.getElementById('sourceUpload1').files[0];
  const team2CodeFile = document.getElementById('sourceUpload1').files[0];
  

  Promise.all([
    readTextFile(worldFile).then(rawWorldMap => {
      if (worldFile.size === 0) {
        throw new Error('World file is empty. Please select a non-empty file and try again.');
      }
      const world = worldtest(rawWorldMap);
      if (world instanceof Error) {
        throw new Error("Error parsing world map: " + world.message);
      }
      simulationSettings.setWorld(world);
      gui.SetUseMapFile(world)
    }),
    readTextFile(team1CodeFile).then(team1Code => {
      if (team1CodeFile.size === 0) {
        throw new Error('Team 1 file is empty. Please select a non-empty file and try again.');
      }
      const team1Program = assemblertest(team1Code);
      if (team1Program instanceof Error) {
        throw new Error("Error parsing team 1 code: " + team1Program.message);
      }
      simulationSettings.setRedProgram(team1Program);
      programs[0]=team1Program
    }),
    readTextFile(team2CodeFile).then(team2Code => {
      if (team2CodeFile.size === 0) {
        throw new Error('Team 2 file is empty. Please select a non-empty file and try again.');
      }
      const team2Program = assemblertest(team2Code);
      if (team2Program instanceof Error) {
        throw new Error("Error parsing team 2 code: " + team2Program.message);
      }
      simulationSettings.setBlackProgram(team2Program);
      programs[0]=team2Program
    }),
    
  ]).then(() => {
    // loader.style.display = "none";
    // body.style.opacity = 1;
    const simulation = new Simulation(simulationSettings);
    alert("Map and programs uploaded and verified. click 'ok' to run the simulation");
    pageSwitch('selectPage','mainPage')
    simulation.resetAntsAtNests()
    gui.setIterationsNumber(iterationValue)
    console.log(iterationValue)
    gui.SetAssemblerFiles(programs[0],programs[1])
    boardLayoutHexes(simulation)
    boardLayoutDivisions(simulation)
    
  }).catch((err) => {
    // loader.style.display = "none";
    // body.style.opacity = 1;
    if(err.message==="Failed to execute 'readAsText' on 'FileReader': parameter 1 is not of type 'Blob'."){
        alert('Error: Empty file')
    }
    else{
        alert(err.message);
    }
  });
});
