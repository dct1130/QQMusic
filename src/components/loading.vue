<template lang="html">
  <div class="loading-mask">
    <div class="preloader">
	    <span></span>
	    <span></span>
	    <span></span>
	    <span></span>
      <!-- <span></span> -->
	   </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
div.loading-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.7);
    z-index: 19;

    // 方块旋转
    div.preloader {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        width: 42px;
        height: 42px;
        animation: preloader 5s infinite linear;
        span {
            width: 20px;
            height: 20px;
            position: absolute;
            background: red;
            display: block;
            animation: preloader_span 1s infinite linear;
            &:nth-child(1) {
                background: #2ecc71;
            }
            &:nth-child(2) {
                left: 22px;
                background: #9b59b6;
                animation-delay: 0.2s;
            }
            &:nth-child(3) {
                top: 22px;
                background: #3498db;
                animation-delay: 0.4s;
            }
            &:nth-child(4) {
                top: 22px;
                left: 22px;
                background: #f1c40f;
                animation-delay: 0.6s;
            }
        }
    }

    // 圆形旋转
    // div.preloader {
    //     position: fixed;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     margin: auto;
    //     width: 30px;
    //     height: 30px;
    //     background: #3498db;
    //     border-radius: 50px;
    //     animation: preloader 1.5s infinite linear;
    //     &:after {
    //         position: absolute;
    //         width: 50px;
    //         height: 50px;
    //         border-top: 10px solid #9b59b6;
    //         border-bottom: 10px solid #9b59b6;
    //         border-left: 10px solid transparent;
    //         border-right: 10px solid transparent;
    //         border-radius: 50px;
    //         content: '';
    //         top: -20px;
    //         left: -20px;
    //         animation: preloader_after 1.5s infinite linear;
    //     }
    // }

    // 圆点跳动
    // div.preloader {
    //     position: fixed;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     margin: auto;
    //     width: 100px;
    //     height: 100px;
    //     span {
    //         position: absolute;
    //         width: 20px;
    //         height: 20px;
    //         background: #3498db;
    //         opacity: 0.5;
    //         border-radius: 20px;
    //         animation: preloader 1s infinite ease-in-out;
    //         &:nth-child(2) {
    //             left: 20px;
    //             animation-delay: 0.2s;
    //         }
    //         &:nth-child(3) {
    //             left: 40px;
    //             animation-delay: 0.4s;
    //         }
    //         &:nth-child(4) {
    //             left: 60px;
    //             animation-delay: 0.6s;
    //         }
    //         &:nth-child(5) {
    //             left: 80px;
    //             animation-delay: 0.8s;
    //         }
    //     }
    // }
}
// 圆点跳动
// @keyframes preloader {
//     0% {
//         opacity: 0.3;
//         transform: translateY(0px);
//         box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
//     }
//     50% {
//         opacity: 1;
//         transform: translateY(-10px);
//         background: #f1c40f;
//         box-shadow: 0 20px 3px rgba(0, 0, 0, 0.05);
//     }
//     100% {
//         opacity: 0.3;
//         transform: translateY(0px);
//         background: #c11574;
//         box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
//     }
// }
// 圆形旋转
// @keyframes preloader {
//     0% {
//         transform: rotate(0deg);
//     }
//     50% {
//         transform: rotate(180deg);
//         background: #2ecc71;
//     }
//     100% {
//         transform: rotate(360deg);
//     }
// }
// @keyframes preloader_after {
//     0% {
//         border-top: 10px solid #9b59b6;
//         border-bottom: 10px solid #9b59b6;
//     }
//     50% {
//         border-top: 10px solid #3498db;
//         border-bottom: 10px solid #3498db;
//     }
//     100% {
//         border-top: 10px solid #9b59b6;
//         border-bottom: 10px solid #9b59b6;
//     }
// }
// 方块旋转
@keyframes preloader {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes preloader_span {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.5);
    }
    100% {
        transform: scale(1);
    }
}
</style>
