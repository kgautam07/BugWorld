/** 
 * Initializes grid under hexmap to display chars.
 * 
 * Creates square-objects that naturally fall into place using css float and div widths/heights.
 * Some rectangles are used to stagger the grid. Dimension alignments are calculated in 'board-layout-hexes.js'.
 */
function boardLayoutDivisions(Simulation) {
    //(grab) board params
    let xlen = Simulation.world.xSize;
    let ylen = Simulation.world.ySize

    //fill board division with tile divisions
    let gameboard = document.getElementById("bugDisplayTextBoard")

    if (ylen >= 2) {
        for (let i=0; i<ylen; i++)
        {
            //stagger the start of even-rows
            if (i%2 === 1)
            {
                let squarestagger = document.createElement("div");
                squarestagger.classList.add("square");
                squarestagger.style.height = String(100/ylen)+"%";
                squarestagger.style.width = String(100/(xlen + .5)/2)+"%"; //half-width
                gameboard.appendChild(squarestagger);
            }
        
            for (let j=0; j<xlen; j++)
            {
                let square = document.createElement("div");
                square.classList.add("square");
                square.setAttribute('id', "squareNum"+String(i)+String(j) );
                square.style.height = String(100/ylen)+"%";
                square.style.width = String(100/(xlen + .5))+"%";
                gameboard.appendChild(square);
            }
            
            //stagger the end of odd-rows
            if (i%2 === 0)
            {
                let squarestagger = document.createElement("div");
                squarestagger.classList.add("square");
                squarestagger.style.height = String(100/ylen)+"%";
                squarestagger.style.width = String(100/(xlen + .5)/2)+"%";  //half-width
                gameboard.appendChild(squarestagger);
            }
        }
    } else {
        //no stagger space needed to fill just one row
        for (let j=0; j<xlen; j++)
        {
            let square = document.createElement("div")
            square.classList.add("WorldCell")
            square.setAttribute('id', "squareNum"+String(i)+String(j) )
            square.style.height = "100%"
            square.style.width = String(100/xlen)+"%"
            gameboard.appendChild(square)
        }
    }
    for(let i=0;i<Simulation.world.ySize;i++){
        for(let j=0;j<Simulation.world.xSize;j++){

            if(Simulation.world.map[i][j].obstructed){
                setTileText(getTileID(i,j,Simulation), '#','black');
            }
            else if(Simulation.world.map[i][j].food){
                setTileText(getTileID(i,j,Simulation), Simulation.world.map[i][j].food);
            }
            else if(Simulation.world.map[i][j].base=='Red'){
                setTileText(getTileID(i,j,Simulation), 'R','pink');
            }
            else if(Simulation.world.map[i][j].base=='Black'){
                setTileText(getTileID(i,j,Simulation), 'B','green');
            }
            else{
                setTileText(getTileID(i,j,Simulation), '-');
            }
        }

    }
    /*for debugging purposes: places numbers in tiles*
    setTileText(getTileID({x:0,y:0}), '2');
    setTileText(getTileID({x:1,y:1}), '2');
    setTileText(getTileID({x:5,y:8}), '5');
    //*/
    // for(){

    // }
    // setTileText("squareNum0", "A");
    // setTileText("squareNum1", "B");
    // setTileText("squareNum2", "C");
    
    // return false;
}

/** 
 * Delivers the element ID of a specified cell.
 * 
 * @param {vector} p A set of coordinates.
 * @return {string} element ID of tile.
 */ 
function getTileID(i,j,Simulation)
{
    //(grab) board params
    //  let xlen = Simulation.world.xSize;
    
    //square id = squareNum#, with # = y*xlen+x
    return "squareNum" + String(i)+String(j);
}

/** 
 * Sets the char shown within a tile
 * 
 * @param {string} tileID A set of coordinates.
 * @param {char} letter A character to display.
 */ 
function setTileText(tileID, letter, color ="")
{
    //uses svg to make tiny text fit.    
    let myElement = document.getElementById(tileID);
    myElement.innerHTML = '<svg viewBox="0 0 12 17" class="squareText"> <text x="0" y="17">' + String(letter) + '</text> </svg>';
    myElement.style.backgroundColor = color;
}
