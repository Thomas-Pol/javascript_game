class enemy {
    constructor(positionX, positionY, speed, healtPoint, type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        this.healtPoint = healtPoint;
        this.type = type;
    }
}

class normalEnemy extends enemy {
    constructor(positionX, positionY, speed, healtPoint, type) {
        super(positionX, positionY, speed, healtPoint, type);
    }
}

class tankEnemy extends enemy {
    constructor(positionX, positionY, speed, healtPoint, type) {
        super(positionX, positionY, speed, healtPoint, type);
    }
}

class speedyEnemy extends enemy {
    constructor(positionX, positionY, speed, healtPoint, type) {
        super(positionX, positionY, speed, healtPoint, type);
    }
}