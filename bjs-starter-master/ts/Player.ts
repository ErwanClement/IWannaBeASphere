class Player extends StateMachineElement {

    public static instance: Player;
    private eventTriggerDial = new Event('onTriggerDialogue');
    public speed = 0.03;
    public gravity = 0.1;
    public angularSpeed = 4;
    public actionManager;

    private gameScene;
    private gameEngine;
    private _mesh;

    //Bool de mouvement
    private _canMove = true;
    private moveForward = false;
    private moveBackward = false;
    private turnRight = false;
    private turnLeft = false;

    constructor(pGameScene, pGameEngine) {
        super();
        this.gameScene = pGameScene;
        this.gameEngine = pGameEngine;
        this._mesh = BABYLON.MeshBuilder.CreateBox("Player", { size: 1 }, this.gameScene);
        this._mesh.position.y = 0.5;
        this.setModeNormal();

        Player.instance = this;

        return Player.instance;
    }





    //GETTER / SETTER

    public static getInstance() {
        if (Player.instance == null) {
            new Player(Game.scene, Game.engine);
        }
        return Player.instance;
    }

    public get canMove(): boolean {
        return this._canMove;
    }
    public set canMove(value: boolean) {
        console.log("canMove : " + value);
        this._canMove = value;
    }

    public get mesh() {
        return this._mesh;
    };







    //
    //SetMode
    //
    private setModeNormal() {
        this.doAction = this.doActionNormal.bind(this);

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.keyCode == 90) {
                this.moveForward = true;
            } else if (e.keyCode == 83) {
                this.moveBackward = true;
            }

            if (e.keyCode == 81) {
                this.turnLeft = true;
            } else if (e.keyCode == 68) {
                this.turnRight = true;
            }
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.keyCode == 90) {
                this.moveForward = false;
            } else if (e.keyCode == 83) {
                this.moveBackward = false;
            }

            if (e.keyCode == 81) {
                this.turnLeft = false;
            } else if (e.keyCode == 68) {
                this.turnRight = false;
            }
        });
    }


    //
    //DoAction
    //
    private doActionNormal() {
        if (this.moveForward && this._canMove) {
            Player.instance._mesh.moveWithCollisions(this.getForward(true));
        } else if (this.moveBackward && this._canMove) {
            Player.instance._mesh.moveWithCollisions(this.getForward(false));
        }




        let rotationVector = new BABYLON.Vector3(0, 1, 0);
        if (this.turnLeft && this._canMove) {
            Player.instance._mesh.rotate(rotationVector, BABYLON.Tools.ToRadians(-this.angularSpeed));
        } else if (this.turnRight && this._canMove) {
            Player.instance._mesh.rotate(rotationVector, BABYLON.Tools.ToRadians(this.angularSpeed));
        }

        this.checkCollisionWithTrigger();
    }





    

    //On repupere le forward du player
    private getForward(pMoveForward) {
        let matrice = Player.instance._mesh.getWorldMatrix();
        let vector;
        if (pMoveForward)
            vector = new BABYLON.Vector3(1, 0, 0);
        else
            vector = new BABYLON.Vector3(-1, 0, 0);
        vector.multiplyByFloats(this.speed, this.speed, this.speed);
        let forward: BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates(vector, matrice);
        forward = forward.subtract(Player.instance._mesh.position);

        return forward;
    }

    //Check la collision avec un trigger
    private checkCollisionWithTrigger() {

        //On recherche tout les triggers actifs, ...
        for (let i = 0; i < TriggerManager.triggerActiveArray.length; i++)

            //... et on voit si ils sont en contacte avec le Player.
            if (this._mesh.intersectsMesh(TriggerManager.triggerActiveArray[i], false)) {
                let meshName: string = TriggerManager.triggerActiveArray[i].name;
                
                //On regarde si le trigger, est un trigger de Dialogue, ...
                if (meshName.indexOf("Dial") != -1) {

                    //... puis on recuperer l'ID du dialogue que sensé lancer le trigger ...
                    let dividedMeshName = meshName.split('_');
                    let dialID = dividedMeshName[dividedMeshName.length - 1];
                    if (dialID == null) {
                        console.log("Error Dial ID not Found");
                        break;
                    }

                    //... enfin on shoot l'event que le DialogueManager recevra pour lancer la discussion
                    DialogueManager.eventParam = dialID;
                    TriggerManager.eventParam = meshName;
                    window.dispatchEvent(this.eventTriggerDial);
                }
            }
    }
}