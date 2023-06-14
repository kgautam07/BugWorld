# pair16_sprint2
Sprint2 Version Link\
http://clabsql.clamv.jacobs-university.de/~rgetahun/sprint2/

# Description
This project is focused on improving the implementation of a game engine. The sprint2 version involves several enhancements and bug fixes to the existing implementation.

# Overview
### A big part of the validation is performed when the files are uploaded. A success message is shown if no errors are found.
![settings](assets%20for%20readme/success.png)

### The map is displayed after validating and parsing the files. The food quantity is represented by a numerical value, while red bugs are denoted by the letter "R" and black bugs are represented by "B". Obstacles are displayed as black boxes, whereas free spaces are represented by hyphens ("-"). All bugs are initialized within their respective nests.
![settings](assets%20for%20readme/map.png)

      `in txt`                                            `after parsing`



# Tasks Completed:
  - Read uploaded files
  - Validate uploaded files
  - Fixed world class worldMap property
      - added charToWorldCell mapping red and Black nest positioning 
      - redNestPositions  
      - isEnemyMarkerAt
  - added different methods that creates and returns a new instance of the WorldCell class for 
      -  createObstacle()
      -  createFree()
      -  createWithFood(food)
      -  createWithRedBase()
      -  createWithBlackBase()  
  - Added Simulation class
  - Added SimulationSettings
  - Updated board-layout-text to display the map from simulator
  - Added GUI class
      - added iteration value, map and programs to its instance 
  - Defined extended error classes and Exception handling
  - Defined engine class
      - initalized it from simulation class 
  - Added instruction class
      - initalized an array of instruction for the instrutions parsed from the uploaded files
  - Added Tournament class
       - initalized it from simulation class 
  - defined getNextInstruction for bug brain class
  - Added the Composition relation between Bug and Bugbrain
  - Implemented the display from simulation class which has a property of the map
  - Implemented testing using Jasmine
# How to Use 
  - clone the repo
  - start the server
  - Open the project in the browser
# Running Unit Tests
  - The tests are located in the `spec` folder.
  - Open the specrunner.html file in a web browser to run the Jasmine tests
  - Jasmine will output the test results in the browser
  `SpecRunner.html` loads the tests and should be launched to execute the tests. For more information, refer to Jasmine's documentation.
Example of the test results:
![settings](assets%20for%20readme/unittest.png)

# Overview of the source code
  - **definitions.js** - utility definitions
  - **instruction.js** - defines the internal representation of all possible instructions.
  - **assemblertest.js** - contains everything needed to parse a program file into internal representation. Currently does validate multiple requirements, such as that the labels are valid and point to other existing labels. The main function return a program or an instance of ProgramParseError.
  - **worldtest.js** - contains everything needed to parse a world map and validate it. Return either a World or an instance of WorldParseError.
  - **world.js** - defines a "World" class that contains a two-dimensional map of cells and provides methods to access and modify cells in the map, where each cell may have an obstacle, food, a base, or a bug. The map is initialized by a given 2D array of characters representing the features of each cell.
  - **worldcell.js** defines a class named WorldCell with properties and methods such as constructor, isObstructed, isfood, isbase, setBug, removeBug, setFood, isFriendlyBase, isEnemyBase, setMarkerAt, clearMarkerAt, isFriendlyMarkerAt, and isEnemyMarkerAt, used in a project related to a bug-swarm simulation game.
  - **errors.js** - contains the error classes used in the application. Should be expanded to allow for precise testing and debugging\
  - **simulation.js** - currently accepts a world and 2 programs. In the future should be responsible for cloning the map and passing it to multiple touraments.
  app.js - loads the map+program files, parses them using functions described earlier, loads the result into simulationSettings object, then uses it to inialize a Simulation.
  - **Engine.js** defines a class called "Engine" with a constructor that takes in four parameters: "world", "redBugs", "blackBugs", and "cycles". It also has a method called "run" which takes in the same parameters as the constructor, as well as a "logger" parameter, but the implementation of the method is not provided in this code snippet.
  
- **GUI.js** This is a class called "GUI" with a constructor that takes in three parameters: "map", "activatingLogOutput", and "iteration". It has several methods such as "SetUseMapFile", "SetAssemblerFiles", "setIterationsNumber", "setOptions", "getIterationsNum", and "updateMap0". The code also exports a constant "gui" instance of the "GUI" class.
