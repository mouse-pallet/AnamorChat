function Anamor_init(){
            // (1)レンダラの初期化
      var renderer = new THREE.WebGLRenderer({ antialias:true });
      renderer.setSize(900, 900);
      renderer.setClearColorHex(0x000000, 1);
      document.body.appendChild(renderer.domElement);

      // (2)シーンの作成
      var scene = new THREE.Scene();

      // (3)カメラの作成
      var camera = new THREE.PerspectiveCamera(15, 500 / 500);
      camera.position = new THREE.Vector3(0, 0, 8);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(camera);


      var ambient = new THREE.AmbientLight(0xffffff);
      scene.add(ambient);

      // (5)表示する物体の作成
     // (5-1)形状オブジェクトの作成
var geometry = new THREE.Geometry();

// (5-2)頂点データの作成
var uvs = [];
var nullary = [];
MathAnamor(0.7,2.68,7);//(半径、視点Y、視点Z)
var bunkatu=400;//分割数


for(var y = 0 ; y <=bunkatu ; y++) {
  for(var x = 0 ; x <= bunkatu ; x++) {
  //アナモル分割数実験
    var Plot=MathDot(x / (bunkatu/2) - 1,y / (bunkatu/2) - 1);
    if(isNaN(Plot.x)){//値がNullの物をNullリスト登録
                      nullary.push(x + y * (bunkatu+1));
                    }
    geometry.vertices.push(
      new THREE.Vector3(
        Plot.x/2,
        Plot.y/2,
        0.0));

    // //極座標
    //     var r = 0.5 + (y/96);
    //     var rad = 2*x*(2*Math.PI)/360;
    //     geometry.vertices.push(
    //                new THREE.Vector3(
    //                          // x / 32 - 1,
    //                          // (y / 32 - 1) * 0.3,
    //                          r*Math.cos(rad),
    //                          r*Math.sin(rad),
    //                          // Math.sin(x / 4 + y / 8) * 0.05
    //                          0));
    uvs.push(
      new THREE.UV(x / bunkatu, y / bunkatu));
  }
}

// (5-3)面データの作成
for(var y = 0 ; y < bunkatu ; y++) {
  for(var x = 0 ; x < bunkatu ; x++) {
    var b = x + y * (bunkatu+1);
    var m = (x + y) & 1;
    if(nullary.indexOf(b)==-1
        && nullary.indexOf(b+1)==-1
        && nullary.indexOf(b+(bunkatu+1))==-1
        && nullary.indexOf(b+(bunkatu+2))==-1){
    geometry.faces.push(
      new THREE.Face3(b + 0, b +  1, b + bunkatu+1, null, null, 0),
      new THREE.Face3(b + 1, b + bunkatu+2, b + bunkatu+1, null, null, 0));
    geometry.faceVertexUvs[0].push(
      [uvs[b + 0], uvs[b +  1], uvs[b + bunkatu+1]],
      [uvs[b + 1], uvs[b + bunkatu+2], uvs[b + bunkatu+1]]);
  }

  }
}

// (5-4)マテリアルの作成
var earthImg = THREE.ImageUtils.loadTexture('/images/testGirl.jpg');
geometry.materials = [
  new THREE.MeshPhongMaterial({
    color: 0xffffff, specular: 0xcccccc, shininess:50,
    ambient: 0xffffff, side: THREE.DoubleSide, map: earthImg }),
  new THREE.MeshPhongMaterial({
    color: 0xcccccc, specular: 0x888888, shininess:50,
    ambient: 0xcccccc, side: THREE.DoubleSide, map: earthImg })];

// (5-5)他のデータを自動計算
geometry.computeFaceNormals();
geometry.computeVertexNormals();

// (5-6)メッシュの作成
var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
mesh.position.y=-0.3;//はみ出たので少しずらす
// mesh.position.x=-0.3;//はみ出たので少しずらす
scene.add(mesh);

      // (6)レンダリング
      var baseTime = +new Date;
      function render() {
        requestAnimationFrame(render);
        // mesh.rotation.y = 0.3 * (+new Date - baseTime) / 1000;
        renderer.render(scene, camera);
      };
      render();
}
