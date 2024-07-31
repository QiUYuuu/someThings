<template>
  <div style="position: relative" @mouseover="mOver" @mouseout="mOut">
    <!-- puzzle的情况 -->
    <div
      v-if="type === '2'"
      class="verify-img-out"
      v-show="showImage"
      :style="{
        position: mode === 'pop' ? 'absolute' : 'relative',
        height: parseInt(setSize.imgHeight) + vSpace + 'px',
        bottom: mode === 'pop' ? '78px' : undefined,
      }"
    >
      <div :class="msgClass" v-show="msgShow">{{msgText}}</div>
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          'background-image': 'url(' + imgUrl + ')',
          'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
        }"
      >
        <!-- <div class="verify-refresh" @click="refresh" v-show="showRefresh">
          <i class="iconfont icon-refresh"></i>
        </div> -->
        <div
          class="verify-gap"
          :style="{
            width: blockSize.width,
            height: blockSize.height,
            top: top + 'px',
            left: left + 'px',
          }"
        ></div>
      </div>
    </div>

    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.barWidth,
        height: barSize.height,
        'line-height': barSize.height,
        'border-radius': 0,
        padding: '0 5px',
      }"
    >
      <span class="verify-msg" v-text="text"></span>
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          'border-color': leftBarBorderColor,
          transaction: transitionWidth,
        }"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          class="verify-move-block"
          style="background-image: url('../../assets/imgs/1.jpg')"
          @touchstart="start"
          @mousedown="start"
          :style="{
            width: barSize.height,
            height: barSize.height,
            'background-color': moveBlockBackgroundColor,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
        >
          <i
            :class="['verify-icon iconfont', iconClass]"
            :style="{ color: iconColor }"
          ></i>
          <div
            class="verify-sub-block"
            :style="{
              width: blockSize.width,
              height: blockSize.height,
              top: '-' + (parseInt(setSize.imgHeight) - top + vSpace) + 'px',
              'background-image': 'url(' + imgUrl + ')',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
              'background-position-y': '-' + top + 'px',
              'background-position-x': '-' + left + 'px',
            }"
            v-show="showImage"
          ></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <img src="./img/关闭.png" @click="closeImg" width="25" height="25" alt="关闭" />
      <img
        style="margin-left: 20px"
        src="./img/刷新.png"
        width="25"
        height="25"
        alt="刷新"
      />
    </div>
  </div>
</template>
<script type="text/babel">
/**
 * VerifySlide
 * @description 滑块
 * */
import { resetSize } from "./util";

export default {
  name: "VerifySlide",
  props: {
    type: {
      type: String,
      default: "1",
    },
    mode: {
      type: String,
      default: "fixed",
    },
    vOffset: {
      type: Number,
      default: 5,
    },
    vSpace: {
      type: Number,
      default: 5,
    },
    explain: {
      type: String,
      default: "向右滑动完成验证",
    },
    imgName: {
      type: Array,
      default() {
        return ["350x150", "350x450"];
      },
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: "400px",
          height: "200px",
        };
      },
    },
    blockSize: {
      type: Object,
      default() {
        return {
          width: "40px",
          height: "40px",
        };
      },
    },
    barSize: {
      type: Object,
      default() {
        return {
          width: "400px",
          height: "40px",
        };
      },
    },
  },
  data() {
    return {
      msgText: '验证错误！',
      msgShow: false,
      msgClass: "msg",
      imgUrl: "",
      text: "",
      finishText: "",
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0,
      },
      top: 0,
      left: 0,
      showImage: true,
      shorImageV: true,
      moveBlockLeft: 0,
      leftBarWidth: undefined,
      // 移动中样式
      moveBlockBackgroundColor: undefined,
      leftBarBorderColor: "#ddd",
      iconColor: undefined,
      iconClass: "icon-right",
      status: false, //鼠标状态
      isEnd: false, //是够验证完成
      showRefresh: true,
      transitionLeft: "",
      transitionWidth: "",
    };
  },
  created() {
    this.generateRandomNumber();
  },
  computed: {
    barArea() {
      return this.$el.querySelector(".verify-bar-area");
    },
    resetSize() {
      return resetSize;
    },
  },
  methods: {
    closeImg() {
      this.$emit("close");
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; // 生成指定范围内的随机整数
    },
    generateRandomNumber() {
      const randomNumber = this.getRandomInt(0, 9); // 调用方法并更新数据
      this.imgUrl = require(`./img/${randomNumber}.jpg`);
    },
    init() {
      this.text = this.explain;

      this.$nextTick(() => {
        let setSize = this.resetSize(this); //重新设置宽度高度
        console.log("setSize", setSize);
        // 监听的问题
        for (let key in setSize) {
          this.$set(this.setSize, key, setSize[key]);
        }

        this.randSet();

        this.$parent.$emit("ready", this);
      });

      var _this = this;

      window.removeEventListener("touchmove", function (e) {
        _this.move(e);
      });
      window.removeEventListener("mousemove", function (e) {
        _this.move(e);
      });

      //鼠标松开
      window.removeEventListener("touchend", function () {
        _this.end();
      });
      window.removeEventListener("mouseup", function () {
        _this.end();
      });

      window.addEventListener("touchmove", function (e) {
        _this.move(e);
      });
      window.addEventListener("mousemove", function (e) {
        _this.move(e);
      });

      //鼠标松开
      window.addEventListener("touchend", function () {
        _this.end();
      });
      window.addEventListener("mouseup", function () {
        _this.end();
      });
    },
    mOver: function () {
      if (this.shorImageV) {
        this.showImage = true;
      }
    },
    mOut: function () {
      this.showImage = true;
    },

    //鼠标按下
    start: function (e) {
      if (this.isEnd == false) {
        this.text = "";
        this.moveBlockBackgroundColor = "#fec200";
        this.leftBarBorderColor = "#fec200";
        this.iconColor = "#fff";
        e.stopPropagation();
        this.status = true;
      }
    },
    //鼠标移动
    move: function (e) {
      if (this.status && this.isEnd == false) {
        let x = 0;
        if (!e.touches) {
          //兼容移动端
          x = e.clientX;
        } else {
          //兼容PC端
          x = e.touches[0].pageX;
        }
        var bar_area_left = this.getLeft(this.barArea);
        var move_block_left = x - bar_area_left; //小方块相对于父元素的left值

        if (this.type !== "1") {
          //图片滑动
          if (
            move_block_left >=
            this.barArea.offsetWidth -
              parseInt(parseInt(this.blockSize.width) / 2) -
              2
          ) {
            move_block_left =
              this.barArea.offsetWidth -
              parseInt(parseInt(this.blockSize.width) / 2) -
              2;
          }
        } else {
          //普通滑动
          if (
            move_block_left >=
            this.barArea.offsetWidth -
              parseInt(parseInt(this.barSize.height) / 2) +
              3
          ) {
            this.finishText = "松开验证";
            move_block_left =
              this.barArea.offsetWidth -
              parseInt(parseInt(this.barSize.height) / 2) +
              3;
          } else {
            this.finishText = "";
          }
        }

        if (move_block_left <= 0) {
          move_block_left = parseInt(parseInt(this.blockSize.width) / 2);
        }

        //拖动后小方块的left值
        const endLeft = move_block_left - parseInt(parseInt(this.blockSize.width) / 2);
        this.moveBlockLeft = `${endLeft > 300 ? 300 : endLeft}px`;
        this.leftBarWidth =
          move_block_left - parseInt(parseInt(this.blockSize.width) / 2) + "px";
      }
    },

    //鼠标松开
    end: function () {
      var _this = this;

      //                判断是否重合
      if (this.status && this.isEnd == false) {
        if (this.type !== "1") {
          //图片滑动

          var vOffset = parseInt(this.vOffset);
          if (
            parseInt(this.left) >=
              parseInt((this.moveBlockLeft || "").replace("px", "")) -
                vOffset &&
            parseInt(this.left) <=
              parseInt((this.moveBlockLeft || "").replace("px", "")) + vOffset
          ) {
            // 验证成功
            this.moveBlockBackgroundColor = "#5cb85c";
            this.leftBarBorderColor = "#5cb85c";
            this.iconColor = "#fff";
            this.iconClass = "icon-check";
            this.showRefresh = false;
            this.isEnd = true;
            this.msgClass = "msg fade-in success";
            this.msgShow = true;
            this.msgText = "√验证成功！";
            setTimeout(() => {
              this.msgClass = "msg";
              this.msgShow = false;
              this.$parent.$emit("success", this);
              this.$emit("success");
            }, 2000);
            
          } else {
            // 验证失败
            this.moveBlockBackgroundColor = "#d9534f";
            this.leftBarBorderColor = "#d9534f";
            this.iconColor = "#fff";
            this.iconClass = "icon-close";

            setTimeout(function () {
              _this.refresh();
              
            }, 400);

            this.$parent.$emit("error", this);
          }
        } else {
          //普通滑动

          if (
            parseInt((this.moveBlockLeft || "").replace("px", "")) >=
            parseInt(this.setSize.barWidth) -
              parseInt(this.barSize.height) -
              parseInt(this.vOffset)
          ) {
            this.moveBlockBackgroundColor = "#5cb85c";
            this.leftBarBorderColor = "#5cb85c";
            this.iconColor = "#fff";
            this.iconClass = "icon-check";
            this.showRefresh = false;
            this.finishText = "验证成功";
            this.isEnd = true;
            this.$parent.$emit("success", this);
          } else {
            this.finishText = "";
            this.moveBlockBackgroundColor = "#d9534f";
            this.leftBarBorderColor = "#d9534f";
            this.iconColor = "#fff";
            this.iconClass = "icon-close";
            this.isEnd = true;

            setTimeout(function () {
              _this.finishText = "";
              _this.refresh();
              _this.isEnd = false;
            }, 400);

            this.$parent.$emit("error", this);
          }
        }

        this.status = false;
      }
    },

    //随机出生点位
    randSet: function () {
      var rand1 = Math.floor(Math.random() * 9 + 1);
      var rand2 = Math.floor(Math.random() * 9 + 1);
      var top =
        (rand1 * parseInt(this.setSize.imgHeight)) / 15 +
        parseInt(this.setSize.imgHeight) * 0.1;
      var left =
        (rand2 * parseInt(this.setSize.imgWidth)) / 15 +
        parseInt(this.setSize.imgWidth) * 0.1;
      this.top = top;
      this.left = left;
    },

    hidden: function () {
      this.shorImageV = false;
      this.showImage = false;
    },

    refresh: function () {
      this.msgClass = "msg fade-in err";
      this.msgShow = true;
      this.msgText = "验证错误！";
      setTimeout(() => {
        this.showRefresh = true;
        this.shorImageV = true;
        this.finishText = "";
        this.transitionLeft = "left .3s";
        this.moveBlockLeft = 0;
        this.leftBarWidth = undefined;
        this.transitionWidth = "width .3s";
        this.leftBarBorderColor = "#ddd";
        this.moveBlockBackgroundColor = "#fff";
        this.iconColor = "#000";
        this.iconClass = "icon-right";
        this.randSet();
        this.msgClass = "msg";
        this.generateRandomNumber();
        this.msgShow = false;
        this.isEnd = false;
        this.transitionWidth = "";
        this.transitionLeft = "";
        this.text = this.explain;
      }, 2000);
    },

    //获取left值
    getLeft: function (node) {
      let leftValue = 0;
      while (node) {
        leftValue += node.offsetLeft;
        node = node.offsetParent;
      }
      let finalvalue = leftValue;
      return finalvalue;
    },
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler() {
        this.init();
      },
    },
  },
  mounted() {
    // 禁止拖拽
    this.$el.onselectstart = function () {
      return false;
    };
  },
  i18n: {
    messages: {
      "en-US": {},
      "zh-CN": {},
    },
  },
};
</script>
<style scoped>
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 10px);
  height: 36px;
  background-color: white;
  padding: 0 5px;
}
.footer img {
  cursor: pointer;
}
.verify-img-out {
  padding: 5px 5px 0 5px;
  background-color: white;
}

.msg {
  position: absolute;
  left: 5px;
  bottom: 0;
  z-index: 10;
  width: calc(100% - 10px);
  opacity: 0.7;
  height: 20px;
  line-height: 20px;
  color: white;
}
.err {
  background-color: red;
  
}
.success {
  background-color: #2cc02b;
}
@keyframes fadeIn {
  0% {
    /* 动画开始时 */
    opacity: 0; /* 完全透明 */
  }
  30% {
    opacity: 0.7;
  }
  50% {
    /* 动画结束时 */
    opacity: 0; /* 完全不透明 */
  }
  100% {
    opacity: 0;
  }
}
.fade-in {
  animation: fadeIn 4s ease-in-out forwards;
}
</style>