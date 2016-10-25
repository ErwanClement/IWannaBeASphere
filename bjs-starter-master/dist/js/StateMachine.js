var StateMachineElement = (function () {
    function StateMachineElement() {
        this.doAction = this.doActionVoid;
    }
    StateMachineElement.prototype.setModeVoid = function () {
        this.doAction = this.doActionVoid.bind(this);
    };
    StateMachineElement.prototype.doActionVoid = function () { };
    return StateMachineElement;
}());
//# sourceMappingURL=StateMachine.js.map