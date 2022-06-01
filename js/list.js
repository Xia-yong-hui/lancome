class List {
    constructor() {
        this.getData();
        this.bindEve();
        // 默认页码
        this.currentPage = 1;
        // 使用锁
        this.lock = false;
    }
    // 绑定事件的方法
    bindEve() {
        // 给.data-list绑定点击事件
        // this.addCart 是.data-list的事件回调方法,故内部this默认指向当前节点  
        this.$('.data-list').addEventListener('click', this.checkLogin.bind(this));
        // 滚动条事件
        window.addEventListener('scroll', this.lazyLoader);
        // 给了解详情绑定点击事件
        this.$('.data-list').addEventListener('click', this.addGoodsJump.bind(this));
    }

    /*******获取数据*******/
    async getData(page = 1) {
        // console.log(1111);
        // 1 发送ajax请求获取数据
        // await等待后面的promise 解包完成.拿到最后结果
        let { status, data } = await axios.get('http://localhost:8888/goods/list?current=' + page);
        // console.log(goodsData); 
        // console.log(status, data);
        // 2 判断请求的状态是否成功
        // status 是ajax服务器请求成功
        // data.code 接口返回数据正常
        if (status !== 200 && data.code !== 1) throw new Error('获取数据失败...');

        // 3 循环渲染数据,追加到页面中
        let html = '';
        data.list.forEach(goods => {
            // console.log(goods);
            html += `
            <div class="goods" data-id="${goods.goods_id}">
                <!-- 图片部分 -->
                <div class="img-box">
                    <img src="${goods.src}" alt="">
                    <!-- 悬浮框 -->
                    <div class="goods-handle">
                        <div class="btn-box">
                            <a href='#none' class="btn btn-black jg">加入购物车</a>
                            <a href='#none' class="btn ljxq">了解详情</a>
                        </div>
                    </div>
                </div>
                <!-- 商品介绍部分 -->
                <div class="details-box">
                    <!-- 商品大小 -->
                    <div class="goods-capacity">
                        <p>${goods.goodsClassify}</p>
                    </div>
                    <!-- 商品名称 -->
                    <div class="goods-name">
                        <a href="#">${goods.title}</a>
                    </div>
                    <!-- 商品介绍 -->
                    <div class="goods-introduce">
                        <p>${goods.titleEng}</p>
                    </div>
                    <!-- 商品等级及价格 -->
                    <div class="goods-row">
                        <!-- 星级 -->
                        <div class="goods-star">
                            <ul class="star">
                                <li class="">
                                    <i class="icon"></i>
                                </li>
                                <li class="">
                                    <i class="icon"></i>
                                </li>
                                <li class="">
                                    <i class="icon"></i>
                                </li>
                                <li class="">
                                    <i class="icon"></i>
                                </li>
                                <li class="">
                                    <i class="icon"></i>
                                </li>
                            </ul>
                        </div>
                        <!-- 价格 -->
                        <div class="goods-price">
                            <span>${goods.price}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        // console.log(html);
        // 将拼接好的字符串追加到.data-list当中
        // console.log(this.$('.data-list'));
        this.$('.data-list').innerHTML += html;
    }

    /*******检查是否登录*******/
    checkLogin(eve) {
        // console.log(this);
        // 获取事件源,判断点击的是否为a标签
        // console.log(eve.target.classList);
        if (eve.target.nodeName != 'A' || eve.target.className != 'btn btn-black jg') return;
        // console.log(eve.target);
        // 判断用户是否登录,如果local中有token,表示登录,没有则表示未登录
        let token = localStorage.getItem('token');
        // console.log(token);
        // 没有token表示未登录,跳转到登录页面
        if (!token) location.assign('./login.html?ReturnUrl=./hufu.html');

        // 如果用户已经登录,此时就需要将商品加入购物车
        // 获取商品id和用户id
        let goodsId = eve.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
        // console.log(goodsId);
        let userId = localStorage.getItem('user_id');
        // console.log(userId);
        this.addCartGoods(goodsId, userId);
    }

    /*******加入购物车*******/
    addCartGoods(gId, uId) {
        // console.log(gId, uId);  
        // 给添加购物车接口,发送请求
        // 调用购物车接口,后台要验证是否为登录状态,需要传递token

        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let param = `id=${uId}&goodsId=${gId}`;
        // console.log(param);
        axios.post('http://localhost:8888/cart/add', param).then(({ data, status }) => {
            // console.log(data, status);
            // 判断添加购物车是否成功
            if (status == 200 && data.code == 1) {
                layer.open({
                    title: '商品添加成功'
                    , content: '去购物车看看'
                    , btn: ['留下', '购物车']
                    , btn2: function (index, layero) {
                        // console.log('去购物车了');
                        location.assign('./shopCar.html')
                    }
                });
            } else if (status == 200 && data.code == 401) {//登录过期,重新登录
                // 清除local中存的token和userId
                localStorage.removeItem('token');
                localStorage.removeItem('user-id');
                // 跳转到登录页面
                location.assign('./login.html?ReturnUrl=./hufu.html')
            } else {
                layer.open({
                    title: '失败提示框'
                    , content: '商品添加失败'
                    , time: 3000
                });
            }

        })
    }

    /*********商品详情页跳转********/
    addGoodsJump(eve) {
        // console.log(this);
        // console.log(eve.target);
        // 获取事件源,判断点击的是否为a标签
        if (eve.target.nodeName != 'A' || eve.target.className != 'btn ljxq') return;
        //获取商品id并保存
        let gId = eve.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
        // console.log(gId);
        localStorage.setItem('id', gId);
        // 跳转到详情页面
        location.assign('./goodsDetail.html')
    }

    /********懒加载********/
    lazyLoader = () => {
        // 需要滚动条高度,可视区高度,实际内容高度
        let top = document.documentElement.scrollTop;
        // console.log(top);
        let cliH = document.documentElement.clientHeight;
        // console.log(cliH);
        let conH = this.$('.right-data').offsetHeight;
        // console.log(conH);
        // 当滚动条高度 + 可视区的高度 > 实际内容高度时,就加载新数据
        if (top + cliH > (conH + 450)) {
            // 一瞬间就满足条件,会不停的触发数据加载,使用节流和防抖

            // 如果是锁着的,就结束代码执行
            if (this.lock) return;
            this.lock = true;
            // 指定时间开锁
            setTimeout(() => {
                this.lock = false
            }, 2000)
            // console.log(111);
            this.getData(++this.currentPage);
        }
    }

    // 封装获取节点的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是,单个节点集合,就返回单个节点,如果是多个节点集合,就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}
new List; 