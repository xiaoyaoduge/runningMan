//人物
function person (canvas,cobj,runImg,jumpImg) {
    this.x=100;
    this.y=0;
    this.endy=canvas.height/5*4-5;
    this.width=100;
    this.height=120;
    this.canvas=canvas;
    this.cobj=cobj;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.status="runImg";
    this.state=0;
    this.speedy=5;
    this.zhongli=10;
}
person.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,100,120,0,0,50,60);
        this.cobj.restore();
    },
    update:function () {
        if(this.y<this.endy){
            this.speedy+=this.zhongli;
            this.y+=this.speedy;
        }else if(this.y>=this.endy){
            this.y=this.endy
        }
    }
};
//创建障碍物
function hinder(canvas,cobj,hinderImg) {
    this.canvas = canvas;
    this.cobj = cobj;
    this.hinderImg = hinderImg;
    this.state = 0;
    this.x = canvas.width;
    this.y = canvas.height/5*4+15;
    this.width=56;
    this.height=40;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,564,399,0,0,this.width,this.height);
        this.cobj.restore();
    }
};
//游戏主程序
function game (canvas,cobj,runImg,jumpImg,hinderImg,end,tt,audio) {
    this.canvas=canvas;
    this.end=end;
    this.tt=tt;
    this.audio=audio
    this.canvasW=canvas.width;
    this.canvasH=canvas.height;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.hinderArr=[];
    this.person=new person(canvas,cobj,runImg,jumpImg);
    this.speed=8;
    this.score=1;
    this.life=3;
}
game.prototype = {
    play: function () {
        var that = this;
        that.key();
        var num = 0;
        var back = 0;
        var num2=0;
        var step=2000+parseInt(5*Math.random())*1000;
        var t=setInterval(function () {
            num++;
            back -= that.speed;
            that.cobj.clearRect(0, 0, that.canvasW, that.canvasH);
            if (that.person.status == "runImg") {
                that.person.state = num % 7;
            } else if (that.person.status == "jumpImg") {
                that.person.state = 0;
            }
            that.person.draw();
            that.person.update();
            that.canvas.style.backgroundPositionX = back + "px";
            if(num2%step==0){
                num2=0;
                step=2000+parseInt(5*Math.random())*1000;
                var hinderObj=new hinder(that.canvas,that.cobj,that.hinderImg);
                hinderObj.state=Math.floor(that.hinderImg.length*Math.random());
                that.hinderArr.push(hinderObj);
                if(that.hinderArr.length>5){
                    that.hinderArr.shift();
                }
            }

            num2+=50;

            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.speed;
                that.hinderArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    //if(!that.hinderArr[i].flag1) {
                    //    that.life--;
                    //}
                    //that.hinderArr[i].flag1=true;
                    //if(that.life<0){
                    //    clearInterval(t)
                    //    location.reload();
                    //}


                    that.end.style.display="block";
                    that.audio.pause();
                    clearInterval(t);
                    clearInterval(that.tt);
                    var rest=document.querySelectorAll(".rest")[0];
                    rest.onclick=function(){
                        location.reload();
                    }

                }else if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1) {
                        document.title=++that.score;
                        if(that.score%3==0){
                            that.speed+=2;
                        }
                    }
                    that.hinderArr[i].flag=true;
                }
            }

        }, 50)
  },
  key:function () {
      var that=this;
      var flag=true;
      that.canvas.onclick=function (e){
          if(!flag){
              return;
          }
          flag=false;
          //var code= e.keyCode;
          //if(code==32) {
              that.person.zhongli = 0;
              that.person.speedy = 0;
              that.person.status = "jumpImg";
              var initA = 0;
              var speedA = 8;
              var r = 150;
              var initY = that.person.y;
              var t = setInterval(function () {
                  initA += speedA;
                  if (initA > 180) {
                      clearInterval(t);
                      that.person.y = initY;
                      that.person.status = "runImg";
                      flag = true;
                  } else {
                      var len = Math.sin(initA * Math.PI / 180) * r;
                      that.person.y = initY - len;
                  }
              }, 50);
          //}
          //else if(code==38){
          //    that.person.zhongli=0;
          //    that.person.speedy=0;
          //    that.person.y-=10;
          //    if(that.person.y<=300){
          //        that.person.y=300
          //    }
          //    flag=true;
          //}else if(code==40){
          //    that.person.zhongli=0;
          //    that.person.speedy=0;
          //    that.person.y+=10;
          //    that.person.endy=480;
          //    flag=true;
          //}else if(code==37){
          //    that.person.x-=10;
          //    if(that.person.x<=120){
          //        that.person.x=120
          //    }
          //    flag=true;
          //}
          //else if(code==39){
          //    that.person.x+=10;
          //    if(that.person.x>=that.canvasW-120){
          //        that.person.x=that.canvasW-120
          //    }
          //    flag=true;
          //}

      }
  }
};