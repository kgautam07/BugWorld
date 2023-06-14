/** 
 * Draws the hexagonal tilemap using a canvas.
 * 
 * Uses trigonometry to pen-draw a hexagonal grid on canvas.
 * The canvas dimensions will be inherited from the parent div.
 * The math is straightforward on paper,
 * simply form equations for radius and solve for proper spacing to fill the available area.
 */
function boardLayoutHexes (Simulation) {
    //grab html objects
    let container = document.getElementById('bugDisplayBoard');
    let textboxes = document.getElementById('bugDisplayTextBoard');
    let canvas = document.getElementById('bugDisplayHexBoard');
    let ctx = canvas.getContext('2d');

    //(grab) board params
    let xlen = Simulation.world.xSize;
    let ylen = Simulation.world.ySize;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    //hexagon shape definition
    /* Math to get radius... 
    Board Space: ylen xlen (# of tiles)
    Drawing space: Width Height (# of pixels in the html div)

    For hexagons to fit into the Drawing Space:
    Width = (xlen)(2*r*cos(13/6 pi))
    Height = 2*r*sin(1/2 pi) + (ylen-1)(r*sin(1/2 pi) + r*sin(13/6 pi)) //harder because hexagons are indented

    Using those equalities as a basis, simplify to get:
    xradius = Width / (xlen*2*cos(13/6 pi))
    yradius = Height * 2 / (3 ylen + 1)
    /*/
    let xRadius = ylen >= 2 ? //add space for stagger if using 2+ rows
        (canvas.width)/((xlen+0.5)*(2 * Math.cos(13/6*Math.PI))):
        (canvas.width)/((xlen    )*(2 * Math.cos(13/6*Math.PI)));
    let yRadius = (canvas.height*2)/(3*ylen+1);
    let xHexSpacing = xRadius*Math.cos(13/6*Math.PI) + xRadius*Math.cos(13/6*Math.PI); //horizontal distance between hexes
    let yHexSpacing = yRadius*Math.sin( 1/2*Math.PI) + yRadius*Math.sin(13/6*Math.PI); //vertical distance between hexes

    //adjust bugDisplayTextBoard dimensions to align with hexagon coverage within board
    textboxes.style.width = String(container.clientWidth)+"px";
    textboxes.style.height = String(container.clientHeight - yRadius*(1-Math.sin(13/6*Math.PI)))+"px";
    textboxes.style.top = String(yRadius*(1-Math.sin(13/6*Math.PI))/2)+"px";

    drawGrid();

    //hexagon grid xy tile positioning
    function drawGrid() {
        for (let i = 0; i < xlen; i++) {
            for (let j = 0; j < ylen; j++) {
                if (j%2===0) { //add space for stagger if using 2+ rows
                    drawHexagon(i*xHexSpacing + xHexSpacing/2, j*yHexSpacing + yRadius);
                } else {
                    drawHexagon(i*xHexSpacing + xHexSpacing, j*yHexSpacing + yRadius);
                }
            }
        }
        return false;
    }

    //draws hexagons
    function drawHexagon(x, y) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(x + xRadius*Math.cos(Math.PI/2 + i*(2*Math.PI)/6), y + yRadius*Math.sin(Math.PI/2 + i*(2*Math.PI)/6));
        }
        ctx.closePath();
        // ctx.stroke();
        return false;
    }

    return false;
}