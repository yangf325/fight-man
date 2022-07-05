cc.Class({
  extends: cc.Component,

  properties: {
    mapNode: cc.Node,
  },

  onLoad() {
    cc.director.getPhysicsManager().enabled = true;

    cc.director.getCollisionManager().enabled = true;
    cc.director.getCollisionManager().enabledDebugDraw = true;

    this.initMapNode(this.mapNode);
  },

  start() {},
  initMapNode(mapNode) {
    let tiledMap = mapNode.getComponent(cc.TiledMap);
    let tiledSize = tiledMap.getTileSize();
    let layer = tiledMap.getLayer("wall");
    let layerSize = layer.getLayerSize();

    for (let i = 0; i < layerSize.width; i++) {
      for (let j = 0; j < layerSize.height; j++) {
        let tiled = layer.getTiledTileAt(i, j, true);
        if (tiled.gid != 0) {
          tiled.node.group = "wall";

          let body = tiled.node.addComponent(cc.RigidBody);
          body.type = cc.RigidBodyType.Static;
          let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
          collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
          collider.size = tiledSize;
          collider.apply();
        }
      }
    }
  },

  // update (dt) {},
});
