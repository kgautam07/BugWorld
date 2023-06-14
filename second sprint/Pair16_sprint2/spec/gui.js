import { gui } from "../assets/js/GUI/gui.js";

describe('GUI', () => {

  it('should set the iterations number correctly', () => {
    gui.setIterationsNumber(20);
    expect(gui.iterations).toEqual(20);
  });

  it('should set the options correctly', () => {
    const options = {
      activatingLogOutput: true,
      iterations: 30,
    };
    gui.setOptions(options);
    expect(gui.activatingLogOutput).toEqual(true);
    expect(gui.iterations).toEqual(30);
  });

  it('should return the correct iterations number', () => {
    gui.setIterationsNumber(10);
    const iterations = gui.getIterationsNum();
    expect(iterations).toEqual(10);
  });
});
