class Game {

    public static engine: BABYLON.Engine;
    public static scene: BABYLON.Scene;
    private camera;

    private dialogueMan: DialogueManager;
    private uiMan: UIManager;
    private triggerMan: TriggerManager;

    public ground;
    public player;
    //Array qui contiendra tout les elements qui auront un doAction
    public gameElement: Array<StateMachineElement> = [];

    constructor(canvasId: string) {

        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        Game.engine = new BABYLON.Engine(canvas, true);

        Game.scene = null;

        window.addEventListener("resize", () => {
            Game.engine.resize();
        });

        this._run();
    }

    private _run() {

        this._initScene();

        Game.scene.executeWhenReady(() => {

            // Remove loader
            var loader = <HTMLElement>document.querySelector("#loader");
            loader.style.display = "none";

            //Load le Dialogue des Json ...
            var loaderDialogue = new BABYLON.AssetsManager(Game.scene);
            var textTask = loaderDialogue.addTextFileTask("dialogs", "dialogs.json");
            textTask.onSuccess = (task: BABYLON.TextFileAssetTask) => {
                //... et créer les manager liésv (UIManager et Sound Manager
                this.uiMan = new UIManager(Game.scene);
                this.dialogueMan = new DialogueManager(JSON.parse(task.text), this.uiMan);
            }
            textTask.onError = (task: BABYLON.TextFileAssetTask) => { console.log("errorload"); }

            loaderDialogue.load();
            Game.engine.runRenderLoop(() => {
                //On fait le doAction de tout les gameElements
                for (var gameElem of this.gameElement) {
                    gameElem.doAction();
                }
                Game.scene.render();
            });
        });
    }


    //Création de la scene, de la light et du Trigger Manager
    private _initScene() {
        Game.scene = new BABYLON.Scene(Game.engine);
        Game.scene.collisionsEnabled = true;
        this.triggerMan = new TriggerManager();

        let light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), Game.scene);
        light.intensity = 0.7;
        
        this._initGame();

        //window.addEventListener("keyup", (e: KeyboardEvent) => { console.log(TriggerManager.triggerActiveArray); });
    }


    private _initGame() {
        //Game.scene.debugLayer.show();

        BABYLON.SceneLoader.ImportMesh("", "scenes/", "toilette.babylon", Game.scene, () => { });

        this.player = Player.getInstance();
        this.gameElement.push(this.player);

        //TEST: Creation d'un trigger de dialogue
        let mesh = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_01", { size: 1 }, Game.scene);
        mesh.position.y = 3;
        mesh.position.x = 4;
        mesh.alphaIndex = 0;
        this.triggerMan.addTrigger(mesh);
        this.triggerMan.switchTriggerArray([mesh]);

        //Creation et Parametrage de la camera
        this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-1, 1, 0), Game.scene);
        this.camera.target = this.player.mesh;
        this.camera.rotationOffset = -90;
        this.camera.maxCameraSpeed = 5;
        //this.camera.cameraAcceleration = 0.05;
        //this.camera.radius = 30; // how far from the object to follow
        //this.camera.heightOffset = 8; // how high above the object to place the camera
        //this.camera.rotationOffset = 180; // the viewing angle
        //this.scene.activeCamera = camera;
    }
}