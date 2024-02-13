export class Enemy {

    // Construction and Initialization of the enemy entity
    constructor(initialPos, enemyUUID, materialRefValue, maxHP, speed, height, collisionDistance, playerCollisionDistance) {
        this.detect = true;
        this.position = initialPos;
        this.initialPos = initialPos;
        this.enemyUUID = enemyUUID;
        this.materialRefValue = materialRefValue;
        this.maxHP = maxHP;
        this.speed = speed;
        this.height = height;
        this.enemyEntity = null;
        this.HP = maxHP;
        this.direction = 0;
        this.directionVector = [0, 0, 1];
        this.collisionDistance = collisionDistance;
        this.playerCollisionDistance = playerCollisionDistance;
    }

    // Deletes enemy
    destroy() {
        delete this;
    }

    // Initializes an enemy
    async initializeEnemy() {
        const enemyTemplate = new SDK3DVerse.EntityTemplate();

        enemyTemplate.attachComponent('mesh_ref', { value: this.enemyUUID });
        enemyTemplate.attachComponent('material_ref', { value: this.materialRefValue });
        enemyTemplate.attachComponent('physics_material');

        const parentEntity = null;
        const deleteOnClientDisconnection = true;

        this.enemyEntity = await enemyTemplate.instantiateTransientEntity(
            "enemy",
            parentEntity,
            deleteOnClientDisconnection
        );

        let enemyTransform = await this.enemyEntity.getGlobalTransform();
        enemyTransform.position = this.initialPos;
        enemyTransform.scale = [0.7, 0.7, 0.7];
        this.enemyEntity.setGlobalTransform(enemyTransform);
    }

    // Sets the enemy position
    setEnemyPos(x, y, z) {
        this.position = [x, y, z];
        this.enemyEntity.setGlobalTransform({ position : this.position })
    }

    // Deals damage to enemy and deletes him if his hp gets below or equal to 0
    takeDamage(amount) {
        this.HP -= amount
        if (this.HP <= 0) {
            this.destroy();
        }
    }

    // Sets the enemy orientation
    orientEnemy() {

        let angle = Math.atan2(this.directionVector[0], this.directionVector[2]);
        let quaternion = [0, Math.sin(angle / 2), 0, Math.cos(angle/2)]

        this.enemyEntity.setGlobalTransform({ orientation : quaternion })
    }

    // Adjusts the height of the enemy
    async adjustHeight() {
        let origin = this.position;
        let directionVector = [0, -1, 0];
        let rayLength = 15;
        let filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.dynamic_block | SDK3DVerse.PhysicsQueryFilterFlag.record_touches;

        let { block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags)
        if (touches.length > 0)
        {
            let hitPoint = touches[0].position[1];
            return hitPoint + this.height;
        }
        return -1;
    }


    /*
    WANDER METHODS
    */

    // Sets Direction Vector based on Direction for the wandering phase
    getWanderDirection() {

        const directionTable = {
            0 : [0, 0, 1],
            1 : [1, 0, 0],
            2 : [0, 0, -1],
            3 : [-1, 0, 0]
        }

        this.directionVector = directionTable[this.direction];
    }

    // Checks collision with raycast in the Direction Vector direction
    async checkWanderCollision() {

        const rayLength = this.collisionDistance;
        const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.dynamic_block | SDK3DVerse.PhysicsQueryFilterFlag.record_touches;

        const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(this.position, this.directionVector, rayLength, filterFlags);
        if (touches.length > 0)
        {
            return true;
        }
        return false;
    }

    // Manages Colision for wandering phase
    wanderCollisionManagment() {

        const randomDirection = Math.floor(Math.random() * 3) + 1;

        this.direction = (this.direction + randomDirection) % 4;
        this.getWanderDirection()
        this.orientEnemy();
        this.detect = true;
    }

    // Wandering Phase movement managment
    async wanderLogic() {

        this.getWanderDirection()

        const height = await this.adjustHeight();

        this.setEnemyPos(
            this.position[0] + this.directionVector[0] * this.speed, // X
            height,													 // Y
            this.position[2] + this.directionVector[2] * this.speed  // Z
        )

        const isCollision = await this.checkWanderCollision();
        if (isCollision && this.detect) {
            this.detect = false;
            this.wanderCollisionManagment();
        }
    }

    /*
    FOLLOW METHODS
    */

    // Calclates the normalized directionVector for the Follow Phase
    async getFollowDirection(camera) {

        let cameraTransform = camera.getTransform();
        let playerPos = cameraTransform.position;
        let enemyPos = this.position;

        let directionVector = [
            playerPos[0] - enemyPos[0], // X
            playerPos[1] - enemyPos[1], // Y
            playerPos[2] - enemyPos[2] // Z
        ];

        let magnitude = Math.sqrt(directionVector[0] * directionVector[0] + directionVector[1] * directionVector[1] + directionVector[2] * directionVector[2])

        directionVector = [
            directionVector[0] / magnitude, // X
            directionVector[1] / magnitude, // Y
            directionVector[2] / magnitude  // Z
        ]

        this.directionVector = directionVector;
        const rayLength = magnitude;
        const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.dynamic_block | SDK3DVerse.PhysicsQueryFilterFlag.record_touches;

        const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(this.position, this.directionVector, rayLength, filterFlags);
        if (magnitude < this.playerCollisionDistance || touches.length > 0) {
            return true
        }
        else
        {
            return false
        }
    }

    // Follow phase movement managment
    async followLogic(camera) {

        let isCollision = await this.getFollowDirection(camera);
        if (!isCollision) {
            const height = await this.adjustHeight();

            let directionX = this.directionVector[0];
            let directionZ = this.directionVector[2];
            if (directionX < 0) {
                directionX = -directionX;
            }
            if (directionZ < 0) {
                directionZ = -directionZ;
            }
            let distanceRatio = directionX + directionZ

            this.setEnemyPos(
                this.position[0] + this.directionVector[0] / distanceRatio * this.speed, // X
                height,													 				 // Y
                this.position[2] + this.directionVector[2] / distanceRatio * this.speed  // Z
            )
        }
        else {


            // KILL PLAYER HERE


        }
        this.orientEnemy();
    }
}