function Text(x,y,text,font,color,incrementFunction){
	this.x = x;
	this.y = y;
	this.font = font;
	this.color = color;
	this.opacity =1;
	this.text = text;
	this.alive=1;
	this.draw = function(){
		if(this.alive>0){
			ctx.globalAlpha = this.opacity;
                        renderText((this.x + gdx), (this.y + gdy),36,this.color,this.text);
			ctx.globalAlpha =1;
			incrementFunction(this);
			return true;
		}
		else {
			return false;
		}
	};
}

function fadeUpAndOut(text){
	text.opacity -=  Math.pow(Math.pow((1-text.opacity), 1/3)+1,3)/100;
	text.alive = text.opacity;
	text.y-=3;
}
