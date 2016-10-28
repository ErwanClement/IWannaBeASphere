class Game {
    private eventTeleportEnd = new Event('onTeleportEnd');
    public static engine: BABYLON.Engine;
    public static scene: BABYLON.Scene;
    private camera;

    private dialogueMan: DialogueManager;
    private soundMan: SoundManager;
    private uiMan: UIManager;
    private triggerMan: TriggerManager;

    public currentLevel: BABYLON.AbstractMesh[];
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
                //... et créer les manager liésv (UIManager, Sound Manager et du triggerMan)
                this.triggerMan = new TriggerManager();
                this.uiMan = new UIManager(Game.scene);
                this.dialogueMan = new DialogueManager(JSON.parse(task.text), this.uiMan, this.triggerMan);
                this.soundMan = new SoundManager(JSON.parse(task.text));

                this._initGame();
            }
            textTask.onError = (task: BABYLON.TextFileAssetTask) => { console.log("errorload"); }

            loaderDialogue.onFinish = function (tasks) {
                var loaderSounds = new BABYLON.AssetsManager(Game.scene);
                SoundManager.loadMusics(loaderSounds);
                //SoundManager.loadSounds(loaderSounds);
                loaderSounds.load();
            }


            loaderDialogue.load();

            //Load les sons ...
            

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
        window.addEventListener('onTeleport', this.chargeLevel2.bind(this));
        Game.scene = new BABYLON.Scene(Game.engine);
        Game.scene.collisionsEnabled = true;

        let light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), Game.scene);
        light.intensity = 0.7;

        //Creation et Parametrage de la camera
        this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), Game.scene);
        this.camera.rotationOffset = -90;
        this.camera.maxCameraSpeed = 1; 
        //this.camera.cameraAcceleration = 0.05;
        this.camera.radius = 8; // how far from the object to follow
        this.camera.heightOffset = 2; // how high above the object to place the camera
    //    this.camera.rotationOffset = -90; // the viewing angle
        //this.scene.activeCamera = camera;

        //window.addEventListener("keyup", (e: KeyboardEvent) => { console.log(TriggerManager.triggerActiveArray); });
    }


    private _initGame() {
        //Game.scene.debugLayer.show();

        BABYLON.SceneLoader.ImportMesh("", "scenes/", "etage1.babylon", Game.scene, (meshes) => { this.currentLevel = meshes; window.dispatchEvent(this.eventTeleportEnd);});

        //TEST: Creation d'un trigger de dialogue
        let mesh = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_01", { size: 1 }, Game.scene);
        mesh.position.y = 2;
        mesh.position.x = 4;
        this.triggerMan.addTrigger(mesh);

        let mesh2 = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_02", { size: 1 }, Game.scene);
        mesh2.position.y = 2;
        mesh2.position.x = -4;
        mesh2.position.z = -4;
        this.triggerMan.addTrigger(mesh2);
        this.triggerMan.switchTriggerArray([mesh]);

        let mesh3 = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_03", { size: 1 }, Game.scene);
        mesh3.position.y = 2;
        mesh3.position.x = 4;
        mesh3.position.z = -4;
        this.triggerMan.addTrigger(mesh3);

        this.player = Player.getInstance();
        this.gameElement.push(this.player);
        this.camera.target = this.player.mesh;
    }

    private chargeLevel2() {
        for (var i: number = this.currentLevel.length - 1; i > 0 ; i--) {
            this.currentLevel[i].dispose();
        }

        BABYLON.SceneLoader.ImportMesh("", "scenes/", "etage2.babylon", Game.scene, (meshes) => { this.currentLevel = meshes;});
    }
}