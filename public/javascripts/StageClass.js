var renderer;
var scene;
var status;
var camera;
var meshlist=[];//メッシュの格納リスト
var Anamorlist = []; //objectの格納リスト
var rWidth;//rendererの横のサイズ
var rHeight;//rendererの縦のサイズ
var boneActor;//アナモルフォーズの骨(頂点と面だけのデータ)

//setupメソッド(舞台作り)
function setup(width,height) {
  // stats
    // statsInit();

    console.log("setup");
    // (1)レンダラの初期化
    renderer = new THREE.WebGLRenderer({ antialias:true });
    rWidth=width;//rendererの横のサイズ
    rHeight=height;//rendererの縦のサイズ
    renderer.setSize(rWidth, rHeight);
    renderer.setClearColorHex(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    // (2)シーンの作成
    scene = new THREE.Scene();

    // (3)カメラの作成
    camera = new THREE.PerspectiveCamera(15, rWidth / rHeight);
    camera.position = new THREE.Vector3(0, 0, 8);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // (4)ライトの作成
    var ambient = new THREE.AmbientLight(0xffffff);//環境光
    scene.add(ambient);

    //(5)オブジェクトの生成
    boneActor = makeBone();

    //stage準備OK
    console.log("Finish setting of renderer, scene, camera, and light.");
    console.log("Stage stand-by OK.");
}

//アナモルフォーズの骨組みを作る(頂点データと面データ)
function makeBone(){
    console.log("makeBone");
    var geometry = new THREE.Geometry();
    var uvs = [];
    var nullary = [];
    // MathAnamor(0.6,3.0,5.0);//(半径、視点Y、視点Z)
    MathAnamor(0.7,2.68,7);//(6cm、23cm、60cm)
    for(var y = 0 ; y <= 64 ; y++) {
        for(var x = 0 ; x <= 64 ; x++) {
        var Plot=MathDot(x / 32 - 1,y / 32 - 1);
        if(isNaN(Plot.x)){//値がNullの物をNullリスト登録
                      nullary.push(x + y * 65);
                    }
        geometry.vertices.push(
        new THREE.Vector3(
        Plot.x/2,
        Plot.y/2,
        0.0));
        uvs.push(
             new THREE.UV(x / 64, y / 64));
        }
    }

    // (5-3)面データの作成
    for(var y = 0 ; y < 64 ; y++) {
        for(var x = 0 ; x < 64 ; x++) {
        var b = x + y * 65;
        var m = (x + y) & 1;
            //使う頂点の中にnullがなければテクスチャを貼り付ける
            if(nullary.indexOf(b)==-1
                && nullary.indexOf(b+1)==-1
                && nullary.indexOf(b+65)==-1
                && nullary.indexOf(b+66)==-1){
                   geometry.faces.push(
                        new THREE.Face3(b + 0, b +  1, b + 65, null, null, 0),
                        new THREE.Face3(b + 1, b + 66, b + 65, null, null, 0));
                   geometry.faceVertexUvs[0].push(
                       [uvs[b + 0], uvs[b +  1], uvs[b + 65]],
                       [uvs[b + 1], uvs[b + 66], uvs[b + 65]]);
               }
        }
    }


    // (5-5)他のデータを自動計算
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
}


//meshのタッチクリック操作を付け加えるメソッド
function addActorAction(){

    var i=0;

    //タッチイベントをサポートしているか調べる
    //対応してなければクリック対応
    if(window.TouchEvent){
        console.log("タッチイベントに対応");
    } else {
        console.log("ERROR : タッチイベント未対応");
    }
        //Touch Event
        //移動
        renderer.domElement.addEventListener("touchstart", function(e){
            //中間値ベクトルの座標を求め、そこからレンダー自体の位置との差分を取る。
            // var moveX=(e.touches[0].pageX+e.touches[1].pageX)/2-renderer.domElement.offsetLeft;
            var moveY=(e.touches[0].pageY+e.touches[1].pageY)/2-renderer.domElement.offsetTop;
            var moveX=(e.touches[0].pageX+e.touches[1].pageX)/2-renderer.domElement.offsetLeft;

            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            meshlist[i].position.x=(moveX/rWidth)*2-1;
            meshlist[i].position.y=-(moveY/rHeight)*2+1;
        });

        //回転
        renderer.domElement.addEventListener("touchmove", function(e){
            //回転の処理

            console.log("touches[0].pageX" + e.touches[0].pageX);
            console.log("touches[0].pageY" + e.touches[0].pageY);
            console.log("touches[1].pageX" + e.touches[1].pageX);
            console.log("touches[1].pageY" + e.touches[1].pageY);

            //中間値
            var Py=(e.touches[0].pageY+e.touches[1].pageY)/2;
            var Px=(e.touches[0].pageX+e.touches[1].pageX)/2;
            // var Py=(e.touches[0].pageY+e.touches[1].pageY)/2;
            //中間値ベクトルの座標を求め、そこからレンダー自体の位置との差分を取る。
            var moveX=Px-renderer.domElement.offsetLeft;
            var moveY=Py-renderer.domElement.offsetTop;
            //回転を求める
            // var heigt=Math.abs(e.touches[0].pageY-Py);
            // var width=Math.abs(e.touches[0].pageX-Px);
            // var radian = Math.atan2(heigt,width)+Math.PI;
            var radian = Math.atan2(-(Py-e.touches[0].pageY),Px-e.touches[0].pageX)+Math.PI;
            var degree = radian*180/Math.PI;
            console.log("atan2:"+radian+"degree:"+degree);
            // meshlist[i].rotation.z = radian;
            Anamorlist[i].changeWithRadian(radian);


            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            meshlist[i].position.x=(moveX/rWidth)*2-1;
            meshlist[i].position.y=-(moveY/rHeight)*2+1;
        });

}

//オブジェクト、およびメッシュリストを追加する
function addActor(video){
	//オブジェクトの生成
	var Anamor = new AnamorClass(boneActor,video);
	Anamorlist.push(Anamor);
	//メッシュの作成
	// var Mesh = Anamor.makeAnamorObj();
    var Mesh = Anamor.mappingVideo();
	meshlist.push(Mesh);
	scene.add(Mesh);
	addActorAction();//タッチクリック操作をつける。


	//render
	render();
}

//videoが十分なデータをもっているか
function howVideoState(){
	var flag=0;

	for(var n=0;n<Anamorlist.length;n++){
		if(!Anamorlist[n].videoStatus()){
			flag++;
		}
	}

	return flag==0;//すべてのvideoは十分な状態だったか？
}

//すべてのvideoデータを更新
function reloadVideo(){
	for(var n=0;n<Anamorlist.length;n++){
		Anamorlist[n].reloadTexture();
	}
}



//render メソッド
function render() {
	if(howVideoState()) {
		reloadVideo();
		renderer.render(scene, camera);
    }
    //status 更新
    // status.update();

    requestAnimationFrame(render);

}

//statusInit メソッド
// function statsInit(){
//   status = new Stats();
//   status.domElement.style.position = 'absolute';
//   status.domElement.style.top = "143px";
//   status.domElement.style.zIndex = 100;
//   document.body.appendChild( status.domElement );
// }


