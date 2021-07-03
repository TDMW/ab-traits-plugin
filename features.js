// P5 functions //

/**
@method p5map
	* @param  {Number} value  the incoming value to be converted
	* @param  {Number} start1 lower bound of the value's current range
	* @param  {Number} stop1  upper bound of the value's current range
	* @param  {Number} start2 lower bound of the value's target range
	* @param  {Number} stop2  upper bound of the value's target range
	* @param  {Boolean} [withinBounds] constrain the value to the newly mapped range
	* @return {Number}        remapped number
	* @example
*/

p5map = function(n, start1, stop1, start2, stop2, withinBounds) {
	const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (!withinBounds) {
		return newval;
	}
	if (start2 < stop2) {
		return this.constrain(newval, start2, stop2);
	} else {
		return this.constrain(newval, stop2, start2);
	}
};
// End of P5 functions //
const hashPairs = [];
const colorArr = [
	[[0,0,12],[0,0,78],[32,75,100],[135, 57, 48], [358, 63, 92], [196, 65, 67]],
	[[146, 60, 43],[146, 49, 58],[60, 11, 100], [14, 27, 100], [29, 68, 84]],
	[[41, 38, 81],[240, 6, 100],[200, 38, 69], [200, 38, 69], [338, 34, 87], [355, 74, 67], [96, 31, 54]],
	[[190, 18, 13],[190, 24, 43],[333, 99, 54], [342, 58, 92], [358, 15, 100]],
	[[218, 37, 25], [214, 52, 50], [202, 30, 85], [182, 11, 99], [12, 68, 93]],
	[[40, 71, 99], [40,47,99], [181, 100, 55], [187, 88, 51], [201, 64, 44]],
	[[95, 13, 88], [129, 18, 76], [172, 34, 66], [195, 54, 55], [194, 49, 24]],
	[[355, 75, 90], [105, 5, 98], [182, 24, 86], [203, 56, 62], [215, 67, 34]],
	[[14, 29, 88],[50, 2, 96],[38, 6, 74],[21, 10, 54], [25, 17, 27]],
	[[24, 100, 100],[0, 0, 92], [0, 0, 75], [211, 65, 65], [209, 100, 60]],
	[[74, 18, 84], [67, 15, 93], [52, 12, 100], [29, 26, 96], [6, 58, 97]],
	[[21, 30, 100],[12, 36, 100],[358, 34, 90],[348, 28, 71], [263, 11, 46]],
	[[195, 91, 30],[195, 90, 70],[164, 97, 84], [42, 60, 100], [346, 70, 94]],
	[[289, 65, 32],[328, 63, 58], [341, 63, 87], [30, 61, 92], [228, 58, 79], [224, 49, 93]],
	[[59, 56, 65], [39, 18, 89],  [345, 44, 95], [71, 41, 73], [4, 69, 64], [176, 10, 63]],
	[[211, 69, 16], [219, 60, 33], [212, 45, 47], [75, 2, 88], [214, 30, 66]]];

const sceneNames = ["Grid Equal", "Grid Unequal", "Grid", "Arcs", "Compound", "Bullseye", "Rectangles", "Revolver", "Asterisk", "Stripes", "10PRINT", "Window Grid", "Circle Arch", "Overload", "Damaged", "Bars"]
const colorNames = ["Retro", "Lente", "Schuurpapier", "Sterrenwacht", "Dageraad", "Spoorwegen", "Zachtgroen", "Zuurstokroze", "Marmer", "Oranjegevoel", "Zonnedauw", "Pastelroze", "Pandemonium", "Futuristisch", "Mm.. Food", "Donderwolk"];

let colors = [];

let sceneSet = false;
let modifierSet = false;

let modifiers = [];
let chosenScenes = [];

for (let j = 0; j < 32; j++) {
  hashPairs.push(tokenData.hash.slice(2 + (j * 2), 4 + (j * 2)));
}

const decPairs = hashPairs.map(x => {
  return parseInt(x, 16);
});

let l, r, up, res, len, amount, maxAngle, pd, bg, sc, stepAmount, shapeBool, inverse, scene, splitScene, growth, w, h;

function populate() {
	shapeFunctions = [gridObj, gridObj, gridObj, arcs, blobs, circles, rects, rounds, sun, stripes, randShapes, gridWindow, overload, circArc, blackFlag, bars];
	w = 1000;
	h = 1000;
	quadBool = decPairs[0] > 252;
	splitBool = (decPairs[0] < 252 && decPairs[0] > 245);

	// Set view
	if(quadBool) {
		features.push(`View: Quad Scene`);
	} else if (splitBool) {
		features.push(`View: Split Scene`);
	} else {
		features.push(`View: Single Scene`);
	}

	scene = !splitScene ? mpr(1, 0, shapeFunctions.length - 1) : "Double Scene";

	// Set scene
	features.push(`Scene placeholder`);
	features.push(`Modifier placeholder`);

	// Set colors (done from setColorscheme)
	inverse = decPairs[2] > 30 ? false :  true;
	colors = setColorscheme(decPairs[3]);

	// Set shapes of streams
	shapeBool = decPairs[4] > 70 ? false : true;

	if(shapeBool) {
		features.push(`Stream Shapes: Circles`)
	} else {
		features.push(`Stream Shapes: Rectangles`)
	}

	const lenMax = shapeBool ? 0.022 : 0.035;

	// Set padding
	pd = mp(6,w * .06, w * .15);
	if(pd < w * 0.08) {
		features.push(`Padding: Small`);
	} else if(pd < w * 0.12) {
		features.push(`Padding: Medium`);
	} else {
		features.push(`Padding: Large`);
	}

	// Set density
	amount = mpr(7,80, 150);
	if(amount < 100) {
		features.push(`Streamcount: Small`);
	} else if(amount < 125) {
		features.push(`Streamcount: Medium`);
	} else {
		features.push(`Streamcount: High`);
	}

	// Set stepsize
	len =  mp(8,w * .010, w * lenMax);
	const lenDiff = (lenMax - 0.010) / 3;

	if(len < w*(0.010 + lenDiff)) {
		features.push(`Stepsize: Small`);
	} else if(len < w*(0.010 + (lenDiff * 2))) {
		features.push(`Stepsize: Medium`);
	} else {
		features.push(`Stepsize: Large`);
	}

	// Set wildness
	minAngle = mp(9, 0, Math.PI * 6);
	maxAngle = mp(10,minAngle, Math.PI * 22);

	const angleDiff = maxAngle - minAngle;

	if(angleDiff < 10) {
		features.push(`Wildness: Tame`);
	} else if (angleDiff < 30) {
		features.push(`Wildness: Mild`);
	} else if (angleDiff < 45) {
		features.push(`Wildness: Wild`);
	} else {
		features.push(`Wildness: Wildest`);
	}

	growth = mp(11,.04, .07);

	stepAmount = Math.round(30 - p5map(amount, 60, 160, 10, 20));
	if(stepAmount < 13) {
		features.push(`Max length: Short`);
	} else if (angleDiff < 16) {
		features.push(`Max length: Medium`);
	} else {
		features.push(`Max length: Long`);
	}


	if(splitBool) {
		shapeFunctions.splice(12, 4);
		doubleScene();
	} else if(quadBool) {
		shapeFunctions.splice(12, 4);
		quadScene();
	} else {
		shapeFunctions[scene]();
		}

	getProps();
}

populate();

function getProps() {
	console.log(features);
}

function setColorscheme(val) {
	const i = Math.round(p5map(val, 0, 255, 0, colorArr.length - 1));

	let c = colorArr[i];

	if(inverse && i == 0 || i == 2 || i == 14) {
		inverse = false;
		c.reverse();
	}

	const inv = inverse.toString();
	const invCap = inv.charAt(0).toUpperCase() + inv.slice(1);

	features.push(`Palette: ${colorNames[i]}`);
	features.push(`Inversed: ${invCap}`);

	bg = c[0];
	sc = c[1];
	c.splice(0,2);

	return c;
}

function doubleScene() {
	features[1] = "Scene: x2"
	features[2] = "Modifiers: multiple"
}

function quadScene() {
	features[1] = "Scene: x4"
	features[2] = "Modifiers: multiple"
}

function rounds() {
	setScene('Revolver');
	let am = mpr(20,4,6);

	setModifier(`${am} rounds`);
}

function overload() {
	setScene('Overload');
	let reps = mp(17, 5, 8);
	setModifier(`${Math.round(reps)} repeats`);
}

function randShapes() {
	setScene('10PRINT');
	let tileCount = mpr(18,2,5);
	setModifier(`${tileCount} tiles`);
}


function sun() {
	setScene('Asterisk');
	const steps = mpr(21,5,10);
	setModifier(`${steps} steps`);
}

function blackFlag() {
	setScene('Damaged');
	const fi = decPairs[22] < 220;
	setModifier(`filled: ${fi}`);
}

function rects() {
	setScene('Rects');
	const am = mpr(23,2,4);
	setModifier(`${am} rectangles`);
}

function circles() {
	setScene('Bullseye');
	const steps = mpr(24,2,4);
	setModifier(`${steps + 1} circles`);
}

function gridObj() {
	const shape = decPairs[25] > 120 ? true : false;
	const off = decPairs[27] > 120 ? true : false;
	const reps = mpr(27,4,6);
	setModifier(`${reps} by ${reps}`);

	let tempStr;
	if(off) {
		tempStr = 'Grid Unequal'
	} else {
		tempStr = 'Grid Equal'
	}

	if(shape) {
		tempStr = `${tempStr} Rectangles`;
	} else {
		tempStr = `${tempStr} Circles`;
	}

	setScene(tempStr);

	if(decPairs[26] > 120) {
		setModifier(`filled: true`);
	} else {
		setModifier(`filled: false`);
	}
}

function arcs() {
	setScene('Arcs');
	const am = mpr(27,2,6);
	setModifier(`${am} arcs`);
}


function circArc() {
	setScene('Circle Arch');
	let f = decPairs[30] < 200;
	if(f){
		setModifier(`filled: true`);
	} else {
		setModifier(`filled: false`);
	}
}

function gridWindow() {
	setScene('Window Grid');
	const interval = mpr(31,2,4);
	setModifier(`${interval} by ${interval}`);
}

function stripes() {
	setScene('Stripes');

	const am = mp(28, 1, 20);

	if(am < 6) {
		setModifier(`fill: solid`);
	} else if(am < 12){
		setModifier(`fill: low`);
		} else {
		setModifier(`fill: dense`);
		}

}

function bars() {
	setScene('Bars');
	let am = mpr(29,3,6);
	setModifier(`${am} bars`);
	let b = decPairs[29] < 230;

	if(b) {
		setModifier(`fill: true`);
	} else {
		setModifier(`fill: false`);
	}
}

function blobs() {
	setScene('Compound');
	const bool = decPairs[19] < 125;

	if(bool) {
		setModifier(`Orientation: default`);
	} else {
		setModifier(`Orientation: flipped`);
	}
}

function setScene(scn) {
	if(!sceneSet) {
		features[1] = `Scene: ${scn}`
		sceneSet = true;
		chosenScenes.push(scn);
	} else {
		chosenScenes.push(scn);
		let tempStr = `Scene:`;
		for(let i = 0; i < chosenScenes.length; i++) {
			if(i == chosenScenes.length - 1) {
				tempStr = `${tempStr} ${chosenScenes[i]}`;
			} else {
				tempStr = `${tempStr} ${chosenScenes[i]},`;
			}
		}
		features[1] = tempStr;
	}
}

function setModifier(mod) {
	if(!modifierSet) {
		features[2] = `Modifiers: ${mod}`
		modifierSet = true;
		modifiers.push(mod);
	} else {
		modifiers.push(mod);
		let tempStr = `Modifiers:`;
		for(let i = 0; i < modifiers.length; i++) {
			if(i == modifiers.length - 1) {
				tempStr = `${tempStr} ${modifiers[i]}`;
			} else {
				tempStr = `${tempStr} ${modifiers[i]},`;
			}
		}
		features[2] = tempStr;
	}
}

function mpr(v,s,e) {
	return Math.round(p5map(decPairs[v], 0, 255, s, e));
}

function mp(v,s,e) {
	return p5map(decPairs[v], 0, 255, s, e);
}

function saveSeed() {
	save(`${tokenData.hash}.png`)
}
