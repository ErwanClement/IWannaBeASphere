var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(pGameScene, pGameEngine) {
        _super.call(this);
        this.eventTriggerDial = new Event('onTriggerDialogue');
        this.speed = 0.25;
        this.gravity = 0.1;
        this.angularSpeed = 2.5;
        //Bool de mouvement
        this._canMove = true;
        this.moveForward = false;
        this.moveBackward = false;
        this.turnRight = false;
        this.turnLeft = false;
        this.gameScene = pGameScene;
        this.gameEngine = pGameEngine;
        this._mesh = BABYLON.MeshBuilder.CreateBox("Player", { size: 1 }, this.gameScene);
        this._mesh.position.y = 0.5;
        this._mesh.position.z = 4;
        this.setModeNormal();
        Player.instance = this;
        return Player.instance;
    }
    //GETTER / SETTER
    Player.getInstance = function () {
        if (Player.instance == null) {
            new Player(Game.scene, Game.engine);
        }
        return Player.instance;
    };
    Object.defineProperty(Player.prototype, "canMove", {
        get: function () {
            return this._canMove;
        },
        set: function (value) {
            console.log("canMove : " + value);
            this._canMove = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "mesh", {
        get: function () {
            return this._mesh;
        },
        enumerable: true,
        configurable: true
    });
    ;
    //
    //SetMode
    //
    Player.prototype.setModeNormal = function () {
        var _this = this;
        this.doAction = this.doActionNormal.bind(this);
        window.addEventListener("keydown", function (e) {
            if (e.keyCode == 90) {
                _this.moveForward = true;
            }
            else if (e.keyCode == 83) {
                _this.moveBackward = true;
            }
            if (e.keyCode == 81) {
                _this.turnLeft = true;
            }
            else if (e.keyCode == 68) {
                _this.turnRight = true;
            }
        });
        window.addEventListener("keyup", function (e) {
            if (e.keyCode == 90) {
                _this.moveForward = false;
            }
            else if (e.keyCode == 83) {
                _this.moveBackward = false;
            }
            if (e.keyCode == 81) {
                _this.turnLeft = false;
            }
            else if (e.keyCode == 68) {
                _this.turnRight = false;
            }
        });
    };
    //
    //DoAction
    //
    Player.prototype.doActionNormal = function () {
        if (this.moveForward && this._canMove) {
            Player.instance._mesh.moveWithCollisions(this.getForward(true));
        }
        else if (this.moveBackward && this._canMove) {
            Player.instance._mesh.moveWithCollisions(this.getForward(false));
        }
        var rotationVector = new BABYLON.Vector3(0, 1, 0);
        if (this.turnLeft && this._canMove) {
            Player.instance._mesh.rotate(rotationVector, BABYLON.Tools.ToRadians(-this.angularSpeed));
        }
        else if (this.turnRight && this._canMove) {
            Player.instance._mesh.rotate(rotationVector, BABYLON.Tools.ToRadians(this.angularSpeed));
        }
        this.checkCollisionWithTrigger();
    };
    //On repupere le forward du player
    Player.prototype.getForward = function (pMoveForward) {
        var matrice = Player.instance._mesh.getWorldMatrix();
        var vector;
        if (pMoveForward)
            vector = new BABYLON.Vector3(1, 0, 0);
        else
            vector = new BABYLON.Vector3(-1, 0, 0);
        vector = vector.multiplyByFloats(this.speed, this.speed, this.speed);
        var forward = BABYLON.Vector3.TransformCoordinates(vector, matrice);
        forward = forward.subtract(Player.instance._mesh.position);
        return forward;
    };
    //Check la collision avec un trigger
    Player.prototype.checkCollisionWithTrigger = function () {
        //On recherche tout les triggers actifs, ...
        for (var i = 0; i < TriggerManager.triggerActiveArray.length; i++)
            //... et on voit si ils sont en contacte avec le Player.
            if (this._mesh.intersectsMesh(TriggerManager.triggerActiveArray[i], false)) {
                var meshName = TriggerManager.triggerActiveArray[i].name;
                //On regarde si le trigger, est un trigger de Dialogue, ...
                if (meshName.indexOf("Dial") != -1) {
                    //... puis on recuperer l'ID du dialogue que sens� lancer le trigger ...
                    var dividedMeshName = meshName.split('_');
                    var dialID = dividedMeshName[dividedMeshName.length - 1];
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
    };
    return Player;
}(StateMachineElement));
//# sourceMappingURL=Player.js.map