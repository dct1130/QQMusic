<template lang="html">
  <div class="welcome">
    <div class="tips">
      <span class="ani"></span>
      <span class="num" v-text="count"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['count']
}
</script>

<style lang="less">
div.welcome {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('../assets/img/welcome.jpg');
    background-prepeat: no-repeat;
    background-size: cover;
    z-index: 20;
    div.tips {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 10px;
        top: 10px;
        span {
            display: block;
            width: 30px;
            height: 30px;
            text-align: center;
        }
        span.ani {
            border: 1px solid #fff;
            border-radius: 999px;
            animation: ani 1s linear infinite;
            &:after,
            &:before {
                content: '';
                width: 0;
                height: 0;
                border-width: 6px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            &:before {
                border-color: transparent #fff transparent transparent;
                border-style: dashed solid dashed dashed;
                left: -11px;
            }
            &:after {
                border-color: transparent transparent transparent #fff;
                border-style: dashed dashed dashed solid;
                right: -12px;
            }
        }
        span.num {
            position: absolute;
            left: 0;
            top: 0;
            color: #fff;
            line-height: 30px;
        }
    }
}
@keyframes ani {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
