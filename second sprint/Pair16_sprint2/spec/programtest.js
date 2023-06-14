
import { assemblertest } from "../assets/js/assembler/assemblertest.js";
import { ProgramParseError } from "../assets/js/error/error.js";

describe("assemblertest on a valid program", function() {
    let programText;
  
    beforeAll(function(done) {
      fetch("./assets/text.txt")
        .then(response => response.text())
        .then(text => {
          programText = text;
          done();
        })
        .catch(error => {
          console.error("Error loading program", error);
          done.fail();
        });
    });
  
    it("should parse the map without errors", function() {
      const program = assemblertest(programText);
      expect(program instanceof Error).toBe(false);
    });
  });

describe("assemblertest on an invalid program", function() {
    let programText;
  
    beforeAll(function(done) {
      fetch("./assets/text_broken.txt")
        .then(response => response.text())
        .then(text => {
          programText = text;
          done();
        })
        .catch(error => {
          console.error("Error loading program", error);
          done.fail();
        });
    });
  
    it("should return a ProgramParseError", function() {
      const program = assemblertest(programText);
      expect(program instanceof ProgramParseError).toBe(true);
    });
  });