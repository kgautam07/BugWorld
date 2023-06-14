/**
 * 'Switches pages' by showing one div and the other.
 * 
 * @param {*} divShow div to show.
 * @param {*} divHide div to hide.
 */
function pageSwitch(divShow,divHide) {
	var frameOne = document.getElementById(divHide);
	var frameTwo = document.getElementById(divShow);

	frameOne.style.display = (frameOne.style.display == "none" ? "block" : "none");
	frameTwo.style.display = (frameTwo.style.display == "none" ? "block" : "none");
}

function logSession(d) {
	if (d.checked == true) {
		document.getElementById("log").style.display == "block";
	}
	else {
		document.getElementById("log").style.display == "none";
	}
}