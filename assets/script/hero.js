const Input = {};
const State = {
  stand: 1,
  attack: 2,
};

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this._speed = 200;
    this.sp = cc.v2(0, 0);

    this.hereState = State.stand;

    this.heroAni = this.node.getComponent(cc.Animation);

    cc.systemEvent.on("keydown", this.onKeyDown, this);
    cc.systemEvent.on("keyup", this.onKeyUp, this);
  },

  onKeyDown(e) {
    Input[e.keyCode] = 1;
  },
  onKeyUp(e) {
    Input[e.keyCode] = 0;
  },

  onDestroy() {
    cc.systemEvent.off("keydown", this.offKeyDown, this);
    cc.systemEvent.on("keyup", this.onKeyUp, this);
  },

  setAni(anima) {
    if (this.anima == anima) {
      return;
    }

    this.anima = anima;
    this.heroAni.play(anima);
  },

  start() {},

  update(dt) {
    let anima = this.anima;
    let scaleX = Math.abs(this.node.scaleX);
    this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;

    if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
      this.node.scaleX = -scaleX;
      this.sp.x = -1;
    } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
      this.node.scaleX = scaleX;
      this.sp.x = 1;
    } else {
      this.sp.x = 0;
    }

    if (this.sp.x) {
      this.lv.x = this.sp.x * this._speed;
      anima = "run";
    } else {
      this.lv.x = 0;
      anima = "idle";
    }
    this.setAni(anima);
    this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;
  },
});
