class UIManager {
    private eventEnd = new Event('onEndDrawDialogue');
    private UI: BABYLON.ScreenSpaceCanvas2D;
    private UIText: BABYLON.Text2D;
    private scene: BABYLON.Scene;
    private stringToDraw;
    private currentDrawString;
    private countDrawLetter;
    private drawTime = 150;
    private drawEnd = true;

    private intervalFunct;

    constructor(pScene) {

        this.scene = pScene;
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
        this.UI.levelVisible = false;
        this.UI.actionManager = new BABYLON.ActionManager(this.scene);
    }

    public drawPrettyText(pString: string, test: boolean = false): void {
        console.log(pString);
        if (pString == null || pString == undefined || pString == "")
            return;
        this.UI.levelVisible = true;
        this.clearPrettyDrawVar();
        this.stringToDraw = pString;
        this.UI.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.onClickText.bind(this)));

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
    }

    private onClickText() {
        if (this.drawEnd) {
            this.UI.actionManager.actions = [];
            this.UI.levelVisible = false;
            window.dispatchEvent(this.eventEnd);
        }
        else {
            clearInterval(this.intervalFunct);
            this.drawEnd = true;
            this.UIText.text = this.stringToDraw;
        }
    }
}