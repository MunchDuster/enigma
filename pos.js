class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(other) {
		return new Vector2(this.x + other.x, this.y + other.y);
	}
	subtract(other) {
		return new Vector2(this.x - other.x, this.y - other.y);
	}
	divide(other) {
		return new Vector2(this.x / other.x, this.y / other.y);
	}
	divideBy(scalar) {
		return new Vector2(this.x / scalar, this.y / scalar);
	}
	multiplyBy(scalar) {
		return new Vector2(this.x * scalar, this.y * scalar);
	}
	towards(other, magnitude) {
		var direction = other.subtract(this).normalized;
		return this.add(direction.multiplyBy(magnitude));
	}
	lerp(other, percent) {
		var direction = other.subtract(this);
		return this.add(direction.multiplyBy(percent));
	}

	get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized() { return this.divideBy(this.magnitude) }

	static WorldToScreen(screenVector) {
		var worldX = (screenVector.x - canvas.width / 2) * zoomMultiplier + offset.x;
		var worldY = (screenVector.y - canvas.height / 2) * zoomMultiplier + offset.y;
		return new Vector2(worldX, worldY);
	}
	static ScreenToWorld(worldVector) {
		var screenX = (worldVector.x - offset.x) / zoomMultiplier + canvas.width / 2;
		var screenY = (worldVector.y - offset.y) / zoomMultiplier + canvas.height / 2;
		return new Vector2(screenX, screenY);
	}

	toString() {
		return "beans";
	}

	static Zero = new Vector2(0, 0);
	static get screenSize() { return new Vector2(canvas.width, canvas.height); }
}