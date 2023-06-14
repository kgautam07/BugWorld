class GUI {
    constructor(map,activatingLogOutput,iteration) {
      this.activatingLogOutput = activatingLogOutput;
      this.iterations = iteration;
      this.map=map
    }

    SetUseMapFile(world) {
        this.world = world;
    }

    SetAssemblerFiles(redProgram,blackprogram) {
        this.redProgram = redProgram;
        this.blackprogram=blackprogram
    }
 
    setIterationsNumber(num) {
      this.iterations = num;
    }
  
    setOptions(options) {
      this.activatingLogOutput = options.activatingLogOutput;
      this.iterations = options.iterations;
    }
  
    getIterationsNum() {
      return this.iterations;
    }    
    
    updateMap0() {
      // implementation here
    }

  }

  export const gui = new GUI()
  