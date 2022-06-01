class Details {
    constructor() {
        this.addGoodsItem();
        // 绑定鼠标事件
        // console.log(this.$('.small'));
        this.$('.small').onmouseover = this.ovenFn;
        this.$('.small').onmouseout = this.outFn;
        this.$('.small').onmousemove = this.moveFn;
    }

    //给small设置鼠标移入事件,鼠标移入big显示
    ovenFn = () => {
        this.$('.big').style.display = 'block';
        this.$('.mask').style.display = 'block';
    }
    //给small设置鼠标移出事件,鼠标移入mask和big隐藏
    outFn = () => {
        this.$('.big').style.display = 'none';
        this.$('.mask').style.display = 'none';
    }
    //设置鼠标移动事件
    moveFn = (eve) => {
        let tmpx = eve.pageX - this.$('.detail-left').offsetLeft - this.$('.mask').offsetWidth / 2;
        let tmpy = eve.pageY - this.$('.detail-left').offsetTop - this.$('.mask').offsetHeight / 2;
        //设置mask能够达到的最大位置
        let maskMaxLeft = this.$('.small').offsetWidth - this.$('.mask').offsetWidth;
        let maskMaxTop = this.$('.small').offsetHeight - this.$('.mask').offsetHeight;
        //设置边界值
        if (tmpx < 0) tmpx = 0;
        if (tmpy < 0) tmpy = 0;
        if (tmpx > maskMaxLeft) tmpx = maskMaxLeft;
        if (tmpy > maskMaxTop) tmpy = maskMaxTop;
        this.$('.mask').style.left = tmpx + 'px';
        this.$('.mask').style.top = tmpy + 'px';
        // 小黄块的实时位置/小黄块移动的最大位置 == ===  大图实时位置/大图能够移动的最大位置
        //大图能够移动的最大位置
        let bigImgMaxLeft = this.$('.bigImg').offsetWidth - this.$('.big').offsetWidth;
        let bigImgMaxTop = this.$('.bigImg').offsetHeight - this.$('.big').offsetHeight;
        //大图实时位置
        let tmpBigLeft = tmpx / maskMaxLeft * bigImgMaxLeft;
        let tmpBigTop = tmpy / maskMaxTop * bigImgMaxTop;
        //设置大图的坐标
        this.$('.bigImg').style.left = -tmpBigLeft + 'px';
        this.$('.bigImg').style.top = -tmpBigTop + 'px';
    }
    /*********获取商品详细信息********/
    async addGoodsItem() {
        // 获取商品id
        let gId = localStorage.getItem('id');
        // console.log(gId);
        // 发送ajax请求获取数据
        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        let { data, status } = await axios.get('http://localhost:8888/goods/item', {
            params: {
                id: gId
            }
        })
        // console.log(data, status);
        // 判断请求的状态是否成功
        if (status == 200 && data.code == 1) {
            // console.log(data.info.src);
            this.$('.small img').src = data.info.src;
            this.$('.big img').src = data.info.src;
            this.$('.dbox1').innerHTML = data.info.titleEng;
            this.$('.dbox2').innerHTML = data.info.title;
            this.$('.dbox3').innerHTML = data.info.price;
            this.$('.dbox4').innerHTML = data.info.goodsClassify;
        }
    }

    // 封装获取节点的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是,单个节点集合,就返回单个节点,如果是多个节点集合,就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}
new Details;