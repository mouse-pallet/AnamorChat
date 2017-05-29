var renderer;
var scene;
var status;
var camera;
var meshlist=[];//メッシュの格納リスト
var Anamorlist = []; //objectの格納リスト
var rWidth;//rendererの横のサイズ
var rHeight;//rendererの縦のサイズ
var boneActor;//アナモルフォーズの骨(頂点と面だけのデータ)
var preStatus;
var nowStatus;
var waitTime =30000; //監視インターバルタイム　waitTimeミリ秒ごとに、差分を送信
/********test ****************/
var meshR;
var meshG;
var meshB;



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
    // 位置の初期化
    preStatus = null;
    nowStatus = null;

    var geo = new THREE.CubeGeometry(0.03, 0.03, 0.03); // 立方体作成
    meshR     = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: 0xaa0000}));
    meshG     = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: 0x00aa00}));
    meshB     = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: 0x0000aa}));
    scene.add(meshR);
    scene.add(meshG);
    scene.add(meshB);

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
    // MathAnamor(0.7,2.68,7);//(6cm、23cm、60cm)
    MathAnamor(0.78,2.68,7);//(7cm、23cm、60cm)
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
            if(nullary.indexOf( b ) == -1
                && nullary.indexOf( b + 1 ) == -1
                && nullary.indexOf( b + 65 ) == -1
                && nullary.indexOf( b + 66 ) == -1){
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

// function renderPoint(x,y ){
//     return {x: x - renderer.domElement.offsetLeft ,y : y - renderer.domElement.offsetTop}
// }

// function DetectStatus(pointVec0, pointVec1, pointVec2){
//     var pointVecs = [pointVec0, pointVec1, pointVec2];
//     var posX,posY;

//     // calculate each Line's value
//     var LinesVal = [ Math.sqrt( (pointVec1.x - pointVec2.x)**2 + (pointVec1.y - pointVec2.y)**2) , Math.sqrt( (pointVec2.x - pointVec0.x)**2 + (pointVec2.y - pointVec0.y)**2) , Math.sqrt( (pointVec0.x - pointVec1.x)**2 + (pointVec0.y - pointVec1.y)**2)];
//     //sets of diagonal line and point
//     var diagonalPoints = {0 : pointVec0, 1 :pointVec1 , 2: pointVec2 };
//     // console.log(LinesVal);
//     // console.log(diagonalPoints);

//     // anglePoint <= point which has a max diagonal line's value.
//     var maxPoint = 0;
//     for(var i =1; i < diagonalPoints.length ; i ++ ){
//         if(LinesVal[ anglePoint ] < LinesVal[i]){
//             maxPoint = i;
//         }
//     }
//     var anglePoint = pointVecs[maxPoint];
//     // console.log("anglePoint");
//     // console.log(anglePoint);
//     anglePoint = renderPoint(anglePoint.x, anglePoint.y);
//     // console.log("anglePoint-ren");
//     // console.log(anglePoint);

//     // caluculate Anamorphicon's location
//     if (anglePoint === pointVec0){
//             posX = (pointVec1.x + pointVec2.x) / 2;
//             posY = (pointVec1.y + pointVec2.y) / 2;
//     }else if (anglePoint === pointVec1){
//             posX = (pointVec2.x + pointVec0.x) / 2;
//             posY = (pointVec2.y + pointVec0.y) / 2;
//     }else{
//             posX = (pointVec0.x + pointVec1.x) / 2;
//             posY = (pointVec0.y + pointVec1.y) / 2;
//     }
//     var pos = renderPoint( posX, posY);
//     // console.log(anglePoint);
//     // console.log("posX : " + pos.x);
//     // console.log("posY : " + pos.y);
//     // Display vertical Line.
//     var axisLine = renderPoint(0,rHeight)
//     var radian = Math.atan2(axisLine.x * anglePoint.y - anglePoint.x * axisLine.y, axisLine.x * anglePoint.x + axisLine.y * anglePoint.y);
//     var degree = radian*180/Math.PI;
//     degree = -Math.round(degree);
//     // console.log("degree : " + degree);

//     // var angle = atan2{axisLine.x * v1.y - axisLine[angleLineNum].x * axisLine.y, axisLine.x * axisLine[angleLineNum].x + axisLine.y * axisLine[angleLineNum].y);
//     return { x : pos.x, y : pos.y, degree : degree, timeStamp : new Date()} ;  // status
// }

function DetectStatus(e){
    var touchList = e.touches;
    var nodeList = [{NO:01,LEN:0},{NO:12,LEN:0},{NO:02,LEN:0}];

    nodeList[0].LEN = Math.sqrt(Math.pow(touchList[0].pageX-touchList[1].pageX,2)
            + Math.pow(touchList[0].pageY-touchList[1].pageY,2));
    nodeList[0].NO = "01";

    nodeList[1].LEN = Math.sqrt(Math.pow(touchList[2].pageX-touchList[1].pageX,2)
        + Math.pow(touchList[2].pageY-touchList[1].pageY,2));
    nodeList[1].NO = "12";

    nodeList[2].LEN = Math.sqrt(Math.pow(touchList[0].pageX-touchList[2].pageX,2)
        + Math.pow(touchList[0].pageY-touchList[2].pageY,2));
    nodeList[2].NO = "02";

    nodeList.sort(function(a, b) {
        return (a.LEN < b.LEN) ? -1 : 1;
    });

    var longP;
    var semiLongP;
    var shortP;

    if(nodeList[2].NO==="01"){
        longP=touchList[2];
        if(nodeList[1].NO==="12"){
            semiLongP=touchList[0];
            shortP=touchList[1];
        }
        else if(nodeList[1].NO==="02"){
            semiLongP=touchList[1];
            shortP=touchList[0];
        }
    }
    else if(nodeList[2].NO==="12"){
        longP=touchList[0];
        if(nodeList[1].NO==="01"){
            semiLongP=touchList[2];
            shortP=touchList[1];
        }
        else if(nodeList[1].NO==="02"){
            semiLongP=touchList[1];
            shortP=touchList[2];
        }
    }
    else if(nodeList[2].NO==="02"){
        longP=touchList[1];
        if(nodeList[1].NO==="01"){
            semiLongP=touchList[2];
            shortP=touchList[0];
        }
        else if(nodeList[1].NO==="12"){
            semiLongP=touchList[0];
            shortP=touchList[2];
        }
    }
    // if((semiLongP.screenX-longP.screenX)!=0&&longP.screenY-semiLongP.screenY!=0){
    //     arctan = Math.atan2((semiLongP.screenX-longP.screenX),(longP.screenY-semiLongP.screenY));
    //     var degree = arctan*180/Math.PI;
    //     degree = -Math.round(degree);
    //     // console.log("degree : " + degree);
    // }



    meshR.position.set((shortP.x-renderer.domElement.offsetLeft / rWidth)*2-1,  - (shortP.y-renderer.domElement.offsetTop / rHeight)*2+1 , 0);
    meshG.position.set((semiLongP.x-renderer.domElement.offsetLeft / rWidth)*2-1,  - (semiLongP.y-renderer.domElement.offsetTop / rHeight)*2+1 , 0);
    meshB.position.set((longP.x-renderer.domElement.offsetLeft / rWidth)*2-1,  - (longP.y-renderer.domElement.offsetTop / rHeight)*2+1 , 0);



    var posX = (semiLongP.pageX + shortP.pageX) / 2;
    var posY = (semiLongP.pageY + shortP.pageY) / 2;

    var moveX = posX - renderer.domElement.offsetLeft;
    var moveY = posY - renderer.domElement.offsetTop;

    //中間点と、頂点のポイントの角度を取る
    var radian = Math.atan2(-(posY-longP.pageY), posX-longP.pageX)+Math.PI;
    var degree = radian*180/Math.PI;


    return { x : moveX, y : moveY, degree : degree, timeStamp : new Date()} ;  // status
}


//meshのタッチクリック操作を付け加えるメソッド
function addActorAction(webSocket){

    var i=0;
    // var preStatus;
    // var nowStatus;
    // var waitTime =3000; //監視インターバルタイム　waitTimeミリ秒ごとに、差分を送信


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


            if(e.touches.length >= 3){
                // var vec0 = {x : e.touches[0].pageX, y : e.touches[0].pageY};
                // var vec1 = {x : e.touches[1].pageX, y : e.touches[1].pageY};
                // var vec2 = {x : e.touches[2].pageX, y : e.touches[2].pageY};
                // preStatus = DetectStatus(vec0,vec1,vec2);

                if(nowStatus == null){
                    preStatus = DetectStatus(e);
                    console.log("preStatus");
                    console.log(preStatus);
                    console.log(" degree " + preStatus.degree);
                    //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
                    meshlist[i].position.x= (preStatus.x / rWidth)*2-1;
                    meshlist[i].position.y= - (preStatus.y / rHeight)*2+1;
                }else{

                    nowStatus = DetectStatus(e);
                    console.log(" degree " + nowStatus.degree);
                    // console.log("nowStatus");
                    // console.log(nowStatus);

                    if(nowStatus.timeStamp - preStatus.timeStamp > waitTime){
                        console.log("Time comming!");
                        console.log("nowStatus");
                        console.log(nowStatus);
                        var diff_degree = nowStatus.degree - preStatus.degree;
                        console.log("diff_angle : " + diff_degree);
                        if(Math.abs(diff_degree) > 10){
                            console.log("get " + diff_degree);
                            console.log("send " + Math.round(diff_degree/180*200));
                            webSocket.send(10);
                            // webSocket.send(Math.round(diff_degree/180*200));
                            // webSocket.onmessage = function(event){console.log(event.data);}
                            preStatus = nowStatus;
                        }
                    }

                }
            }

        });

        //回転
        renderer.domElement.addEventListener("touchmove", function(e){

            if(e.touches.length >= 3){
                // var vec0 = {x : e.touches[0].pageX, y : e.touches[0].pageY};
                // var vec1 = {x : e.touches[1].pageX, y : e.touches[1].pageY};
                // var vec2 = {x : e.touches[2].pageX, y : e.touches[2].pageY};
                // nowStatus = DetectStatus(vec0,vec1,vec2);
                nowStatus = DetectStatus(e);
                // console.log("nowStatus");
                // console.log(nowStatus);

                if(nowStatus.timeStamp - preStatus.timeStamp > waitTime){
                    console.log("Time comming!");
                    console.log("nowStatus");
                    console.log(nowStatus);
                    var diff_degree = nowStatus.degree - preStatus.degree;
                    console.log("diff_angle : " + diff_degree);
                    if(Math.abs(diff_degree) > 10){
                        console.log("get " + diff_degree);
                        console.log("send " + Math.round(diff_degree/180*200));
                        // webSocket.send(Math.round(diff_degree/180*200));
                        preStatus = nowStatus;
                    }
                }

                //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
                meshlist[i].position.x = (nowStatus.x / rWidth)*2-1;
                meshlist[i].position.y = -(nowStatus.y / rHeight)*2+1;
            }
        });

}

//オブジェクト、およびメッシュリストを追加する
function addActor(video,webSocket){
	//オブジェクトの生成
	var Anamor = new AnamorClass(boneActor,video);
	Anamorlist.push(Anamor);
	//メッシュの作成
	// var Mesh = Anamor.makeAnamorObj();
    var Mesh = Anamor.mappingVideo();
	meshlist.push(Mesh);
	scene.add(Mesh);
	addActorAction(webSocket);//タッチクリック操作をつける。


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


