var colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
var hexColorsToTintedColors = {
    "#e74c3c":"rgb(241,163,155)",
    "#f1c40f":"rgb(246,223,133)",
    "#3498db":"rgb(151,201,235)",
    "#2ecc71":"rgb(150,227,183)"
};

//legacy support
var rgbToHex = {
    "rgb(231,76,60)":"#e74c3c",
    "rgb(241,196,15)":"#f1c40f",
    "rgb(52,152,219)":"#3498db",
    "rgb(46,204,113)":"#2ecc71"
};

//legacy support
var rgbColorsToTintedColors = {
    "rgb(231,76,60)":"rgb(241,163,155)",
    "rgb(241,196,15)":"rgb(246,223,133)",
    "rgb(52,152,219)":"rgb(151,201,235)",
    "rgb(46,204,113)":"rgb(150,227,183)"
};

var hexagonBackgroundColor = 'rgb(236, 240, 241)';
var hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
var centerBlue = 'rgb(44,62,80)'; //tumblr?
var angularVelocityConst = 4;

// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
}

var colorSounds =  {"#e74c3c": new Audio("../sounds/lowest.ogg"),
"#f1c40f":new Audio("../sounds/highest.ogg"),
"#3498db":new Audio("../sounds/middle.ogg"),
	"#2ecc71":new Audio("../sounds/highest.ogg") //fix this later
};

function renderText(x, y, fontSize, color, text, font) {
    if (!font) {
        font = 'px/0 Roboto';
    }

    fontSize *= settings.scale;
    ctx.font = fontSize + font;
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
}

scoreOpacity = 0;
function drawScoreboard() {
    if (scoreOpacity < 1) {
        scoreOpacity += 0.01;
    }

    ctx.globalAlpha = scoreOpacity;
    if (gameState === 0) {
        renderText(trueCanvas.width/2+ gdx + 6 * settings.scale, trueCanvas.height/2+ gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
        renderText(trueCanvas.width/2+ gdx + 6 * settings.scale, trueCanvas.height/2+ gdy - 170 * settings.scale, 150, "#2c3e50", "Hextris");
        renderText(trueCanvas.width/2+ gdx + 5 * settings.scale, trueCanvas.height/2+ gdy + 100 * settings.scale, 20, "rgb(44,62,80)", 'Play!');
    }
    else {
        renderText(trueCanvas.width/2+ gdx, trueCanvas.height/2+ gdy, 50, "rgb(236, 240, 241)", score);
    }

    ctx.globalAlpha = 1;
}

function clearGameBoard() {
    drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor, 0, 'rgba(0,0,0,0)');
}

function drawPolygon(x, y, sides, radius, theta, fillColor, lineWidth, lineColor) {
    ctx.fillStyle = fillColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    
    ctx.beginPath();
    var coords = rotatePoint(0, radius, theta);
    ctx.moveTo(coords.x + x, coords.y + y);
    var oldX = coords.x;
    var oldY = coords.y;
    for (var i = 0; i < sides; i++) {
        coords = rotatePoint(oldX, oldY, 360 / sides);
        ctx.lineTo(coords.x + x, coords.y + y);
        oldX = coords.x;
        oldY = coords.y;
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function showHighScores() {
    $('#highscores').html(function() {
        var str = '<li> High Scores: </li>';
        for (var i = 0; i < highscores.length; i++) {
            str += '<li>' + highscores[i]+ '</li>';
        }
        return str;
    });
    toggleClass('#highscores', 'not-visible');
}

function toggleClass(element, active) {
    if ($(element).hasClass(active)) {
        $(element).removeClass(active);
    }
    else {
        $(element).addClass(active);
    }
}
