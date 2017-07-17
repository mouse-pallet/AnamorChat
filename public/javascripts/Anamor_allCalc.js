function Anamor_allCalc(){
    var readImageCanvas = document.createElement("canvas");
    var writeImageCanvas = document.createElement("canvas");
    var readImageContext = readImageCanvas.getContext('2d');
    var writeImageContext = writeImageCanvas.getContext('2d');
    var image = new Image();
    image.src = "/images/testGirl.jpg";
    image.onload = function() {
        readImageCanvas.width = image.width;
        readImageCanvas.height = image.height;
        // console.log(readImageCanvas.width);
        // console.log(readImageCanvas.height);
        readImageContext.drawImage(image,0,0,image.width,image.height);
        // document.body.appendChild(readImageCanvas);
        MathAnamor(0.7,2.68,7);//(半径、視点Y、視点Z)

        var width = image.width, height = image.height;
        // ピクセル配列：RGBA4要素で1ピクセル
        var lut = [];
        var pos = 0;
        var maxLength =width;
        var converted_maxWidth = 0;
        var converted_maxHeight = 0;
        if(width < height ){ maxLength = height;}

        var converted_minWidth = 0;
        var converted_minHeight = 0;

        writeImageCanvas.width = 1200;
        writeImageCanvas.height = 1200;
        var readImageData = (readImageContext.getImageData(0, 0, image.width, image.height));
        var writeImageData = writeImageContext.createImageData(900, 900);
        var orginal = readImageData.data;
        var dist = writeImageData.data;
        for(i = 0; i <writeImageCanvas.width*writeImageCanvas.height*4;i = i +4){
            dist[i]=0;
            dist[i+1]=0;
            dist[i+2]=0;
            dist[i+3]=255;
        }
        // console.log(writeImageData);
        // console.log(readImageData);

        // ピクセル単位で操作できる
        for (var y = 0; y < height; ++y) {
          for (var x = 0; x < width; ++x) {
                    // var Plot=MathDot(x / (maxLength/2), y / (maxLength/2));
                    var Plot=MathDot(x / (maxLength) - 1, y / (maxLength) - 1);

                    // var multNum = maxLength/2;
                    var multNum = writeImageData.width;
                    if(!isNaN(Plot.x)){
                        // console.log(Plot);
                        var sx = (Plot.x + 1.5) * maxLength;
                        var sy = (Plot.y) * maxLength;
                        if(sx > converted_maxWidth){ converted_maxWidth = sx; }
                        if(sy > converted_maxHeight){ converted_maxHeight = sy; }
                        if(sx < converted_minWidth){ converted_minWidth = sx; }
                        if(sy < converted_minHeight){ converted_minHeight = sy; }

                        sx = Math.round(sx);
                        sy = Math.round(sy);


                        dist[(sy * writeImageData.width + sx) * 4 + 0] = orginal[(y * width + x) * 4 + 0];
                        dist[(sy * writeImageData.width + sx) * 4 + 1] = orginal[(y * width + x) * 4 + 1];
                        dist[(sy * writeImageData.width + sx) * 4 + 2] = orginal[(y * width + x) * 4 + 2];
                        dist[(sy * writeImageData.width+ sx) * 4 + 3] = orginal[(y * width + x) * 4 + 3];
                    }
                    // var sx = (Plot.x + 1.5) * maxLength/2 ;
                    // var sy = (Plot.y + 1.5) * maxLength/2 ;
                    // if(sx > converted_maxWidth){ converted_maxWidth = sx; }
                    // if(sy > converted_maxHeight){ converted_maxHeight = sy; }
                    // if(sx < converted_minWidth){ converted_minWidth = sx; }
                    // if(sy < converted_minHeight){ converted_minHeight = sy; }

                    // sx = Math.round(sx);
                    // sy = Math.round(sy);


                    // dist[(sy * width + sx) * 4 + 0] = orginal[(y * width + x) * 4 + 0];
                    // dist[(sy * width + sx) * 4 + 1] = orginal[(y * width + x) * 4 + 1];
                    // dist[(sy * width + sx) * 4 + 2] = orginal[(y * width + x) * 4 + 2];
                    // dist[(sy * width + sx) * 4 + 3] = orginal[(y * width + x) * 4 + 3];
          }
        }

        // writeImageCanvas.width = converted_maxWidth;
        // writeImageCanvas.height = converted_maxHeight;
        // var readImageData = (readImageContext.getImageData(0, 0, image.width, image.height));
        // var writeImageData = writeImageContext.createImageData(converted_maxWidth, converted_maxHeight);

        console.log("converted_maxWidth : " + converted_maxWidth);
        console.log("converted_maxHeight : " + converted_maxHeight);
        console.log("converted_minWidth : " + converted_minWidth);
        console.log("converted_minHeight : " + converted_minHeight);

        writeImageContext.putImageData(writeImageData, 0, 0);
        document.body.appendChild(writeImageCanvas);





    }
}
