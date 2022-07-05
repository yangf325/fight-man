const State = {
  stand: 1,
  attack: 2,
  hurt: 3,
};

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.hp = 5;
    this.isHit = false;
    this.ani = this.node.getChildByName("body").getComponent(cc.Animation);

    this.rb = this.node.getComponent(cc.RigidBody);
    this._speed = 25;
    this.sp = cc.v2(0, 0);
    this.tt = 0;
    this.enemyState = State.stand;
    this.moveRight = 1;
    this.setAni("idle");
    this.ani.on("finished", (e, data) => {
      this.hp--;
      this.isHit = false;
      if (this.hp == 0) {
        this.node.destroy();
      }
    });
  },

  hurt() {
    this.isHit = true;
    this.ani.play("hurt");
  },
  setAni(anima) {
    if (this.anima == anima) {
      return;
    }

    this.anima = anima;
    this.ani.play(anima);
  },

  enemyAction() {},

  attack() {
    this.sp.x = 0;
    if (Input[cc.macro.KEY.j]) {
      this.setAni(`attack${this.combo + 1}`);
    }
  },
  move() {
    // 判断行走方向
    this.lv = this.rb.linearVelocity;
    this.node.scaleX = this.moveRight;
    if (this.moveRight === 1) {
      this.setAni("run");
      this.sp.x = -1;
    } else if (this.moveRight === -1) {
      this.setAni("run");
      this.sp.x = 1;
    } else {
      this.sp.x = 0;
      this.setAni("idle");
    }

    // 移动
    console.log(this.sp.x);
    if (this.sp.x) {
      this.lv.x = this.sp.x * this._speed;
    } else {
      this.lv.x = 0;
    }
    this.rb.linearVelocity = this.lv;
  },

  update(dt) {
    // 处理状态
    this.tt += dt;
    // if (this.tt >= 0.3 && this.enemyState == State.stand) {
    //   this.enemyAction(dt);
    //   this.tt = 0;
    // }

    if (this.enemyState == State.attack) {
      // 根据状态处理逻辑
      this.attack();
    } else if (this.enemyState == State.stand) {
      this.move();
    }
  },
});
