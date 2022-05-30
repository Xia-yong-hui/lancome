class Cart {
    constructor() {
        this.getCartGoods();
        // 给.shop绑定点击事件,实现事件委托
        this.$('.shop').addEventListener('click', this.dispatch);
        // 给全选按钮绑定点击事件
        this.$('#allcheck').addEventListener('click', this.checkAll);
    }
    /******全选的实现******/
    checkAll = (eve) => {
        // console.log(this);
        // 点击全选的时候,应该让单个商品的选中框状态,跟随全选
        // console.log(eve.target);
        let allStatus = eve.target.checked;
        // console.log(allStatus);
        this.oneCheckGoods(allStatus)
    }
    // 让单个商品跟随全选的状态
    oneCheckGoods(status) {
        // console.log(this.$('.checkbox'));
        this.$('.checkbox').forEach(input => {
            input.checked = status;
        })
    }
    /******单选的实现******/
    oneGoodsCheckBox() {
        // console.log(this.$('.checkbox'));
        // 给每个单选按钮绑定点击事件
        this.$('.checkbox').forEach(input => {
            // 保存this的指向
            let self = this;
            input.onclick = function () {
                // 获取当前点击状态
                // console.log(this.checked);
                // 判断当前商品的input点击是取消,则此时取消全选
                if (!this.checked) {
                    self.$('#allcheck').checked = false;
                }
                // 点击选中时,则判断页面中有其他的未选中,如果都选中,则全选选中
                if (this.checked) {
                    let status = self.getOneGoodsStatus();
                    // console.log(status);
                    self.$('#allcheck').checked = status;
                }
            }
        })
    }
    /******获取单个商品的选中状态******/
    getOneGoodsStatus() {
        // console.log(this.$('.checkbox'));
        // 寻找是否有未选中的,如果页面都选中res为空数组
        let res = Array.from(this.$('.checkbox')).find(input => {
            // console.log(input.checked);
            return !input.checked
        })
        // console.log(res);
        // 如果res有值,则页面中有未被选中的
        // 页面中都被选中,则返回true
        return !res;
    }

    /******事件委托******/
    dispatch = (eve) => {
        // console.log(this);
        // 事件源的获取
        let target = eve.target;
        // console.log(target);
        if (target.nodeName == 'A' && target.classList.contains('delete')) this.delGoodsData(target);
    }
    // 删除购物车中的商品,需要用户id和商品id
    delGoodsData(tar) {
        // console.log(tar);

        // console.log(id);
        // 弹出框询问是否确认删除
        layer.confirm('是否确认删除商品', {
            title: '删除提示框'
        }, function () {  //确认的回调函数
            // console.log(111);
            // 给后台发送数据,删除记录
            // 找到ul上的商品id
            let div = tar.parentNode.parentNode.parentNode
            let gId = div.dataset.id;
            // 用户id
            let uId = localStorage.getItem('user_id');
            // console.log(gId, uId);
            // 必须携带token,后台需要进行验证
            const AUTH_TOKEN = localStorage.getItem('token');
            axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
            let res = axios.get(' http://localhost:8888/cart/remove', {
                params: {
                    id: uId,
                    goodsId: gId
                }
            }).then(res => {
                // console.log(res);
                // 直接刷新页面
                // location.reload();
                // 无刷新删除,关闭弹出框,且删除对应的div
                layer.closeAll();
                div.remove();
            })
        })
    }

    /******取出商品信息*******/
    async getCartGoods() {
        // 必须携带token,后台需要进行验证
        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        let { data, status } = await axios.get('http://localhost:8888/cart/list', {
            params: {
                id: localStorage.getItem('user_id')
            }
        })
        // console.log(res);
        // 判断ajax的请求状态
        if (status == 200 && data.code == 1) {
            // console.log(data.cart);
            let html = '';
            data.cart.forEach(goods => {
                // console.log(goods);
                html += `<div class="shop-data" data-id="${goods.goods_id}">
                <!-- 左侧图片 -->
                <div class="shop-data-left">
                    <!-- 勾选框 -->
                    <label class="form-checkbox">
                        <!-- 若选中的话加一个类名 is-checked -->
                        <input type="checkbox" class="checkbox">
                    </label>
                    <!-- 图片 -->
                    <div class="shop-img">
                        <img src="${goods.src}" alt="">
                    </div>
                </div>
                <!-- 右侧价格 -->
                <div class="shop-data-right">
                    <!-- 商品信息 -->
                    <div class="shopcart-goods">
                        <div class="data-title">
                            <p>${goods.title}</p>
                        </div>
                        <div class="data-capacity">
                            <div class="capacity">${goods.goodsClassify}</div>
                            <i class="icon"></i>
                        </div>
                    </div>
                    <!-- 单价 -->
                    <div class="unit-price">
                        <p>${goods.price}</p>
                    </div>
                    <!-- 数量选择区间 -->
                    <div class="shop-random">
                        <span class="jian">-</span>
                        <div class="num">${goods.count}</div>
                        <span class="jia">+</span>
                    </div>
                    <!-- 小计 -->
                    <div class="shopcart-sum">
                        <p class="total-price">${goods.price}</p>
                    </div>
                    <!-- 删除单个商品 -->
                    <div class="shopcart-del-single">
                        <a href="#none" class="delete">删除</a>           
                    </div>
                </div>
            </div>`
            });
            // 将拼接好的字符串追加到页面中
            this.$('.shop').innerHTML += html;
            // 单选按钮事件绑定
            // 单个商品的追加是异步实现的
            this.oneGoodsCheckBox();
        }
        // 登录过期的处理
        if (status == 200 && data.code == 401) {//登录过期,重新登录
            // 清除local中存的token和userId
            localStorage.removeItem('token');
            localStorage.removeItem('user-id');
            // 跳转到登录页面
            location.assign('./login.html?ReturnUrl=./shopCar.html')
        }
    }
    // 封装获取节点的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是,单个节点集合,就返回单个节点,如果是多个节点集合,就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}
new Cart;  