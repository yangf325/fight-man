cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.enemy = this.node.parent.getComponent("enemy");
  },

  onCollisionEnter(other) {
    console.log(other);
    if (other.node.group == "hero" && other.tag === 1) {
      this.enemy.hurt();
    }
  },

  // update (dt) {},
});
