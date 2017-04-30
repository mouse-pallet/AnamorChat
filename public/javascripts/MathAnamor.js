var r;	//シリンダーの半径
var V;	//視点ベクトルオブジェクト


//////// 自作Vector関数 ////////////////////////////////////////////////////////////////


function vec3D(){							//3Dベクトル初期化関数
	return {x:null,y:null,z:null};
}

function vec3D(X,Y,Z){							//3Dベクトル初期化関数
	return {x:X,y:Y,z:Z};
}

function PrintVec(A){						//ベクトルをコンソール表示
	try{
		console.log(JSON.stringify(A));		//Chromeでのオブジェクト表示
	}
	catch(e){
		console.log(A.toSource());			//FireFoxでのオブジェクト表示
	}
}

function Objnum(A){							//オブジェクトの要素数を返す
	return Object.keys(A).length;
}


function dot(A,B){							//３D内積ベクトル
	var dotResult=0;
	if(Objnum(A)==Objnum(B)){				//ベクトルの次元はあっているか
		for(var elem in A){	
			dotResult+=A[elem]*B[elem];
		}
	}
	else{
		console.log(" Object's length is not equals. ")
	}
	return dotResult;
}

function Scalar(A,Scalar){
	var Result=vec3D();
	for(var elem in A){
		Result[elem]=A[elem]*Scalar;
	}
	return Result;
}
///////////////////////////////////////////////////////////////////////////////////////

function MathAnamor(R,vy,vz){				//コンストラクター的な存在
	r=R;
	if(r<vy && r<vz){
		V={x:0,y:vy,z:vz};
	
	}
	else{
		console.log("Viewer in the cylinder!? it's unbelievable!");
	}	
}

function MathDot(X,Y){						//X,Yは元画像の位置
    
    var P=vec3D(X,0,Y);						//絵はXZ平面上にあると仮定

    var a=P.x*P.x + P.y*P.y - 2*P.x*V.x + V.x*V.x - 2*P.y*V.y + V.y*V.y;
	var	b=- 2*P.x*P.x - 2*P.y*P.y + 2*P.x*V.x + 2*P.y*V.y;
	var	c=P.x*P.x + P.y*P.y;

	var	t=(-b+Math.sqrt(b*b - 4*a*(c-r*r)))/(2*a);

	var L=vec3D();
	for(var elem in P){						//L=P+t(V-P)
		L[elem]=P[elem]+t*(V[elem]-P[elem]);
	}

	var n=vec3D(L.x,L.y,0);


	var vv=vec3D();
	for(var elem in P){						//L=P+t(V-P)
		vv[elem]=V[elem]-P[elem];
	}


	var Proj=Scalar(n,(dot(n,vv)/dot(n,n)));	//Proj=(n・v/|n|^2)*n

	var avec=vec3D();
	for(var elem in Proj){					//L=Proj-v
		avec[elem]=Proj[elem]-vv[elem];
	}


	var R=vec3D();
	var a2=Scalar(avec,2);

	for(var elem in R){						//R=v-2*a
		R[elem]=vv[elem]+a2[elem];					
	}


	var Plot=vec3D();
	Plot.x=L.x-L.z / R.z*R.x;
	Plot.y=L.y-L.z / R.z*R.y;
	Plot.z=0;

	// console.log("Plot:");
	// PrintVec(Plot);
	return Plot;
	
}