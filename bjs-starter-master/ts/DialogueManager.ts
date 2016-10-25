class DialogueManager {
    public static eventParam:string;
    private uiMan;
    private currentDialog: Array<Array<string>>;
    private Dialogs;
    private currentIndex: number = null;
    private currentIndexDialog: number = 0;

    constructor(pDialog, pUiMan) {

        this.uiMan = pUiMan;
        this.Dialogs = pDialog;
        window.addEventListener('onEndDrawDialogue', this.nextStep.bind(this));
        window.addEventListener('onTriggerDialogue', this.chargeDialog.bind(this));
        this.uiMan.drawPrettyText("text", true);
    }

    private chargeDialog() {
        if (this.Dialogs != null) {
            this.currentDialog = this.Dialogs["dialog_" + DialogueManager.eventParam];
            console.log("Dial: ", this.currentDialog["text"][0]);
            if (this.currentIndexDialog == 0)
                this.checkCallback(this.currentDialog["startCallback"]);
            
            this.uiMan.drawPrettyText(this.currentDialog["text"][0]);
        }
    }

    public nextStep() {
        this.currentIndexDialog++;
        if (this.currentIndexDialog >= this.currentDialog["text"].length) {
            this.checkCallback(this.currentDialog["endCallback"]);
            this.currentIndexDialog = 0;
        }
        else {
            this.uiMan.drawPrettyText(this.currentDialog["text"][this.currentIndexDialog]);
        }
    }
    
    private checkCallback(pAction) {
        if (pAction == null) return;
        switch (pAction) {
            case "DisablePlayer":
                Player.getInstance().canMove = false;
                break;
            case "EnablePlayer":
                Player.getInstance().canMove = true;
                break;
            default: console.log("No Callback");
        }
    }
}