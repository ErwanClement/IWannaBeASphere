class StateMachineElement {
    public doAction: () => void = this.doActionVoid;

    private setModeVoid() {
        this.doAction = this.doActionVoid.bind(this);
    }

    private doActionVoid() { }
}