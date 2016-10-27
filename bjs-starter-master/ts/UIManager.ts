class UIManager {
    private eventEnd = new Event('onEndDrawDialogue');
    private UI: BABYLON.ScreenSpaceCanvas2D;
    private BlackScreen: BABYLON.ScreenSpaceCanvas2D;
    private UIAction: BABYLON.ScreenSpaceCanvas2D;
    private UIText: BABYLON.Text2D;
    private scene: BABYLON.Scene;
    private stringToDraw;
    private currentDrawString;
    private countDrawLetter;
    private drawTime = 50;
    private drawEnd: boolean = true;
    private messageDisplayed: boolean = false;

    private intervalFunct;

    constructor(pScene) {
        window.addEventListener('onTeleport', this.showBlackScreen.bind(this));
        window.addEventListener('onTeleportEnd', this.hideBlackScreen.bind(this));
        this.scene = pScene;

       this.BlackScreen = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
            id: "BlackScreen",
            size: new BABYLON.Size(window.innerWidth, window.innerHeight),
            backgroundFill: "#00000000",
            backgroundRoundRadius: 50,
            x: window.innerWidth / 2 - 1000
        });
        this.UIText = new BABYLON.Text2D("", {
            id: "text",
            marginAlignment: "h: center, v:center",
            fontName: "20pt Arial",
        });
        this.UI = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
            id: "ScreenCanvas",
            size: new BABYLON.Size(1000, 150),
            backgroundFill: "#4040408F",
            backgroundRoundRadius: 50,
            x: window.innerWidth / 2 - 1000,
            children: [this.UIText]
        });
        this.UIAction = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
            id: "ActionCanvas",
            size: new BABYLON.Size(1500, 250),
            backgroundFill: "#ffffff88",
            backgroundRoundRadius: 50,
            x: window.innerWidth / 2 - 1000
        });
        this.BlackScreen.levelVisible = false;
        this.UI.levelVisible = false;
        this.UIAction.actionManager = new BABYLON.ActionManager(this.scene);
        this.UIAction.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.onClickText.bind(this)));
    }

    public drawText(pString: string): void {
        this.messageDisplayed = true;
        this.UI.levelVisible = true;
        this.UIText.text = pString;
        this.drawEnd = true;
    }

    public drawPrettyText(pString: string): void {
        if (pString == null || pString == undefined || pString == "")
            return;
        this.UI.levelVisible = true;
        this.clearPrettyDrawVar();
        this.stringToDraw = pString;

        this.intervalFunct = setInterval(this.addCharToDrewText.bind(this), this.drawTime);
    }

    private addCharToDrewText() {
        this.currentDrawString = "";
        for (var i = 0; i < this.stringToDraw.length; i++) {
            if (i >= this.countDrawLetter) {
                this.UIText.text = this.currentDrawString;
                this.countDrawLetter++;
                return;
            }
            this.currentDrawString += this.stringToDraw[i];
        }

        this.UIText.text = this.stringToDraw;
        this.drawEnd = true;
        clearInterval(this.intervalFunct);
    };

    private clearPrettyDrawVar() {
        this.UIText.text = " ";
        this.stringToDraw = " ";
        this.currentDrawString = " ";
        this.countDrawLetter = 0;
        this.drawEnd = false;
        this.messageDisplayed = true;
    }

    private onClickText() {
        if (this.messageDisplayed) {
            if (this.drawEnd) {
                this.messageDisplayed = false;
                this.UI.levelVisible = false;
                window.dispatchEvent(this.eventEnd);
            } else {
                clearInterval(this.intervalFunct);
                this.drawEnd = true;
                this.UIText.text = this.stringToDraw;
            }
        }
    }

    private showBlackScreen() {
        this.BlackScreen.levelVisible = true;
    }

    private hideBlackScreen() {
        this.BlackScreen.levelVisible = false;
    }
}