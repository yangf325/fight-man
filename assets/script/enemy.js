cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.hp = 5;
    this.isHit = false;
    this.ani = this.node.getComponent(cc.Animation);

    this.ani.on("finished", (e, data) => {
      this.hp--;
      this.isHit = false;
      if (this.hp == 0) {
        this.node.destroy();
      }
    });
  },

  onCollisionEnter(other) {
    console.log("onCollisionEnter", other);
    if (other.node.group == "hero") {
      this.isHit = true;
      this.ani.play("hurt");
    }
  },

  start() {},

  // update (dt) {},
});
