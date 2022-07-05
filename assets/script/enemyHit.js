cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.enemy = this.node.parent.getComponent("enemy");
  },

  onCollisionEnter(other) {
    console.log("onCollisionEnter", other);
    if (other.node.group == "hero") {
      this.enemy.hurt();
    }
  },

  // update (dt) {},
});
