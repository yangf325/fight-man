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
    this.combo = 0;
    this.rb = this.node.getComponent(cc.RigidBody);
    this.heroState = State.stand;
    this.heroAni = this.node.getComponent(cc.Animation);
    this.setAni("idle");
    this.heroAni.on("finished", this.onAnimaFinished, this);

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
    this.heroAni.off("Finished", this.onAnimaFinished, this);
  },

  setAni(anima) {
    if (this.anima == anima) {
      return;
    }

    this.anima = anima;
    this.heroAni.play(anima);
  },
  onAnimaFinished(event, data) {
    if (data.name.indexOf("attack") > -1) {
      this.heroState = State.stand;
      this.combo = (this.combo + 1) % 3;
      setTimeout(() => {
        if (this.heroState != State.attack) {
          this.combo = 0;
        }
      }, 500);
    }
  },

  attack() {
    this.sp.x = 0;
    if (Input[cc.macro.KEY.j]) {
      this.setAni(`attack${this.combo + 1}`);
    }
  },
  move(scaleX) {
    // 判断行走方向
    this.lv = this.rb.linearVelocity;
    if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
      this.node.scaleX = -scaleX;
      this.setAni("run");
      this.sp.x = -1;
    } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
      this.node.scaleX = scaleX;
      this.setAni("run");
      this.sp.x = 1;
    } else {
      this.sp.x = 0;
      this.setAni("idle");
    }

    // 移动
    if (this.sp.x) {
      this.lv.x = this.sp.x * this._speed;
    } else {
      this.lv.x = 0;
    }
    this.rb.linearVelocity = this.lv;
  },

  update(dt) {
    let scaleX = Math.abs(this.node.scaleX);

    // 处理状态
    switch (this.heroState) {
      case State.stand: {
        if (Input[cc.macro.KEY.j]) {
          this.heroState = State.attack;
        }
        break;
      }
    }

    // 根据状态处理逻辑
    if (this.heroState == State.attack) {
      this.attack();
    } else if (this.heroState == State.stand) {
      this.move(scaleX);
    }
  },
});
