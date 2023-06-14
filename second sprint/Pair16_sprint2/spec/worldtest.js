import { worldtest } from "../assets/js/assembler/worldtest.js";
import { WorldParseError } from "../assets/js/error/error.js";
describe("worldtest on a valid map", function() {
    let worldMap;
  
    beforeAll(function(done) {
      fetch("assets/map.txt")
        .then(response => response.text())
        .then(text => {
          worldMap = text;
          done();
        })
        .catch(error => {
          console.error("Error loading map.txt", error);
          done.fail();
        });
    });
  
    it("should parse the map without errors", function() {
      const world = worldtest(worldMap);
      expect(world instanceof Error).toBe(false);
    });
  });

describe("worldtest on a broken border", function() {
    let worldMap;
  
    beforeAll(function(done) {
      fetch("assets/map_broken_border.txt")
        .then(response => response.text())
        .then(text => {
          worldMap = text;
          done();
        })
        .catch(error => {
          console.error("Error loading map", error);
          done.fail();
        });
    });
  
    it("should return a WorldParseError", function() {
      const world = worldtest(worldMap);
      expect(world instanceof WorldParseError).toBe(true);
    });
  });