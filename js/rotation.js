class Rotation {
    constructor() {
        this.rotationImage();
    }

    // 轮播图的实现
    rotationImage() {
        // console.log(this.$('.photo-wrapper .photo-slide'));
        // 设置隐藏的图片索引
        let lastIndex = 0;
        // 设置显示的图片索引
        let index = 0;
        // 实现自动播放
        //自动播放的实现
        //设置定时器返回值
        let times = '';
        times = setInterval(function () {
            lastIndex = index;
            index++;
            // 判断索引是否超过最大值
            if (index > this.$('.photo-wrapper .photo-slide').length - 1) {
                index = 0;
            }
            //设置上一张图片隐藏
            this.$('.photo-wrapper .photo-slide')[lastIndex].className = 'photo-slide';
            //设置当前操作的图片显示
            this.$('.photo-wrapper .photo-slide')[index].className = 'photo-slide rotation';
        }, 2000)
    }

    // 封装获取节点的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是,单个节点集合,就返回单个节点,如果是多个节点集合,就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}
new Rotation;