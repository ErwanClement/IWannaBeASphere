class DialogueManager {
    public static eventParam:string;
    private uiMan;
    private triggerMan;
    private currentDialog: Array<Array<string>>;
    private Dialogs;
    private currentIndex: number = null;
    private currentIndexDialog: number = 0;

    constructor(pDialog, pUiMan, pTriggerMan) {

        this.uiMan = pUiMan;
        this.triggerMan = pTriggerMan;
        this.Dialogs = pDialog;
        window.addEventListener('onEndDrawDialogue', this.nextStep.bind(this));
        window.addEventListener('onTriggerDialogue', this.chargeDialog.bind(this));
    }

    private chargeDialog() {
        if (this.Dialogs != null) {
            this.currentDialog = this.Dialogs["dialog_" + DialogueManager.eventParam];
            console.log("Dial: ", this.currentDialog["text"][0]);
                
            this.uiMan.drawText(this.currentDialog["text"][0]);
        }
    }

    public nextStep() {
        this.currentIndexDialog++;
        if (this.currentIndexDialog >= this.currentDialog["text"].length) {
            if (this.currentDialog["endCallback"] != null){
                let lLenght: number = this.currentDialog["endCallback"].length;
                for (var i = 0; i < lLenght; i++)
                    this.checkCallback(this.currentDialog["endCallback"][i]["fct"], this.currentDialog["endCallback"][i]["param"]);
            }
            this.currentIndexDialog = 0;
        }
        else {
            this.uiMan.drawText(this.currentDialog["text"][this.currentIndexDialog]);
        }
    }
    
    private checkCallback(pAction, pParam) {
        if (pAction == null) return;
        switch (pAction) {
            case "DisablePlayer":
                Player.getInstance().canMove = false;
                break;
            case "EnablePlayer":
                Player.getInstance().canMove = true;
                break;
            case "Teleport":
                break;
            case "EnableTrigger":
                this.triggerMan.switchTriggerArray([], true, "Trigger-Dial_" + pParam);
                console.log("Trigger-Dial_" + pParam);
                break;
            case "DisableTrigger":
                this.triggerMan.switchTriggerArray([], false, "Trigger-Dial_" + pParam);
                console.log("Trigger-Dial_" + pParam);
                break;
            default: console.log("No Callback");
        }
    }
}