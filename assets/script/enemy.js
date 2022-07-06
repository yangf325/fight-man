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
    this.playerNode = cc.find("Canvas/bg/hero");

    this.rb = this.node.getComponent(cc.RigidBody);
    this._speed = 25;
    this.sp = cc.v2(0, 0);
    this.tt = 0;
    this.enemyState = State.stand;
    this.moveRight = 0;
    this.setAni("idle");
    this.ani.on("finished", (e, data) => {
      if (data.name == "hurt") {
        this.hp--;
        this.sp.x = 0;
        this.isHit = false;
        this.enemyState = State.stand;
        if (this.hp == 0) {
          this.node.destroy();
        }
      } else if (data.name == "attack") {
        this.enemyState = State.stand;
        this.setAni("idle");
      }

      console.log("state", this.enemyState);
    });
  },

  hurt() {
    if (this.isHit) return;
    this.isHit = true;
    this.enemyState = State.hurt;
    this.sp.x = 0;
    this.setAni("hurt");
  },
  setAni(anima) {
    if (this.anima == anima) {
      return;
    }
    console.log("anima", anima);
    this.anima = anima;
    this.ani.play(anima);
  },

  enemyAction() {
    const dis = cc.Vec2.distance(this.playerNode.position, this.node.position);
    const face = this.node.position.sub(this.playerNode.position) > 0 ? 1 : -1;
    if (dis < 40) {
      console.log("功击");
      this.enemyState = State.attack;
      this.attack();
    } else if (dis < 150) {
      this.enemyState = State.stand;
      this.setAni("walk");
      console.log("追击", this.anima);
      this.moveRight = -face;
    } else {
      console.log("静止", this.anima);
      this.enemyState = State.stand;
      this.setAni("idle");
      this.sp.x = 0;
      this.moveRight = 0;
    }
  },

  attack() {
    this.setAni("attack");
    this.sp.x = 0;
  },
  move() {
    // 判断行走方向
    this.lv = this.rb.linearVelocity;
    if (this.moveRight === 1) {
      this.node.scaleX = -this.moveRight;
      this.setAni("walk");
      this.sp.x = -1;
    } else if (this.moveRight === -1) {
      this.node.scaleX = -this.moveRight;
      this.setAni("walk");
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
    // 处理状态
    this.tt += dt;
    if (this.tt >= 1.3 && this.enemyState == State.stand) {
      this.enemyAction(dt);
      this.tt = 0;
    }

    if (this.enemyState == State.attack) {
      // 根据状态处理逻辑
      this.attack();
    } else if (this.enemyState == State.stand) {
      this.move();
    }
  },
});
