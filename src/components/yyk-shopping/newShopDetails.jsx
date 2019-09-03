import React from 'react';
import $http from '../../api';
import MsgIcon from "../../assets/img/icon/default.png";
import Swiper from 'swiper/dist/js/swiper.min.js'
import 'swiper/dist/css/swiper.min.css';
import emsPic from '../../assets/img/icon_js@2x.png';
import addPic from '../../assets/img/icon_zd@2x.png';
import { Toast } from 'antd-mobile';
class ShopDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datalist: {},
            imgs: [],
            pics: [],
            isView: false,
            flag: false,
            newisView: false,
            newDataobj: {},
            numVal: 0
        }
        this.add = this.add.bind(this)
    }
    componentWillMount () {
        window.add = this.add
    }
    componentDidMount () {
        let { tag, int } = this.props.match.params;
        this.setState({
            numVal: int
        })
        if (tag == 1) {
            this.newinitdata()
        } else {
            this.initdata()
        }
    }
    initdata () {
        var _this = this;
        let { did } = this.props.match.params;
        $http.post('/mobile/doch5/doc_goods_detail', {id: did }, function (res) {
           var datas = res
           console.log(datas)
           if (datas.code == 1) {
                _this.setState({
                    datalist: datas.data,
                    imgs: datas.img,
                    swiperPic: datas.pic,
                    isView: true
                })
                if (_this.state.swiperPic.length > 1) {
                    new Swiper ('.swiper-container', {
                        loop: true,
                        // autoplay: true,
                        pagination: {
                            el: '.swiper-pagination',
                        },
                        observer: true
                    })
                }
           } else {
               _this.setState({
                    flag: true
               })
           }
       })
    }
    newinitdata() {
        var self = this;
        let { did } = this.props.match.params;
        $http.post('/mobile/doch5/store_goods_detail', {id: did }, function (res) {
            console.log(res)
            if (res.code == 1) {
                self.setState({
                    newisView: true,
                    newDataobj: res.data
                })
            } else {
                self.setState({
                    newisView: false,
                    flag: true
                })
                
            }
        })
    }
    add (num) { // 交互获取数量
        let { numVal } = this.state
        numVal = num
        this.setState({
            numVal: numVal
        })
    }
    handleminus () {  // 减
        let { numVal } = this.state
        if (numVal <= 0) {
            return;
        }
        numVal --
        this.setState({
            numVal: numVal
        })
        this.handleClick('no', numVal)
    }
    handleadd () {  // 加
        var addn = this.state.numVal
        if (this.state.newDataobj.stock && addn >= this.state.newDataobj.stock) {
            Toast.info('此药品库存不足!', 2)
            return false;
        }
        addn ++
        this.setState({
            numVal: addn
        })
        this.handleClick('yes', addn)
    }
    handleClick (type, int) { // 和 ios 和 android 交互
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var obj = { type:type, val: int }   // 给 ios 传参
        var obj2 = {};
        let { tag } = this.props.match.params;
        if (tag == 1) { // 给 android 传参
            obj2 = JSON.stringify(this.state.newDataobj)
        } else {
            obj2 = JSON.stringify(this.state.datalist)
        }
        if (isAndroid) {
            window.android.getDrugNum(int, obj2)
        }
        if (isiOS) {
            window.webkit.messageHandlers.getDrugNum.postMessage(obj);
        }
    }
    render () {
        return (
            <div className='shopDetails'>
                {
                    this.state.isView? <Shop data={ this.state } ems={ this.handleminus.bind(this) } adds={ this.handleadd.bind(this) } /> : this.state.newisView ? < NewShop newData={ this.state } ems={ this.handleminus.bind(this) } adds={ this.handleadd.bind(this) } /> : this.state.flag? ( <div className='fail-msg'><img src={ MsgIcon } alt="" />商品不存在或者已被下架</div> ) : ""
                }
            </div>
        )
    }
}


class Shop extends React.Component {
    constructor (props) {
        super(props)
    }
    emsFn () {
        this.props.ems()
    }
    addFn () {
        this.props.adds()
    }
    render () {
        let { datalist, numVal } = this.props.data;
        return (
            <div className='shopDetails-box'>
                <div className='swiper-box'>
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {
                                this.props.data.swiperPic.map((val, i) => {
                                    return (
                                        <div className="swiper-slide" key={i}>
                                            <img src={ val.img?$http.baseURL+val.img:'' } alt="" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                </div>
                <div className="newshop-info">
                    <h4>{ datalist.name }</h4>
                    <div className='shop-money'>
                        <span className="color-red">￥<span>{ datalist.price }</span></span>
                        <div className="nums">
                            <span onClick={ this.emsFn.bind(this) }><img src={ emsPic } alt="" /></span>
                            <span>{ numVal }</span>
                            <span onClick={ this.addFn.bind(this) }><img src={ addPic } alt="" /></span>
                        </div>
                    </div>
                </div>
                {/*  1 药品 2 保健品 3 医疗器械  */}
                {   datalist.type == 1? (
                    <div className="detail_con">        
                        <ul>
                            <li className='border_blue'><span>商品类型：</span><span>{ datalist.recipe == 0? '非处方':'处方' }</span></li>
                            <li><span>商品剂型：</span><span>{ datalist.type2 }</span></li>
                            <li><span>商品用法：</span><span>{ datalist.usetype == 1? '内服': '外用' }</span></li>
                        </ul>
                        <ul>
                            <li className='border_blue'><span>规格：</span><span>{ datalist.specification }</span></li>
                            <li><span>成分：</span><span>{ datalist.type2 }</span></li>
                            <li><span>性状：</span><span>{ datalist.usetype== 1? '内服': '外用' }</span></li>
                            <li><span>功能主治：</span><span>{ datalist.attending_functions }</span></li>
                            <li><span>用法用量：</span><span>{ datalist.dose }</span></li>
                            <li><span>生产厂家：</span><span>{ datalist.enterprise }</span></li>
                            <li><span>有效期：</span><span>{ datalist.uselife }</span></li>
                            <li><span>批准文号：</span><span>{ datalist.code }</span></li>
                            <li><span>注意事项：</span><span>{ datalist.cautions }</span></li>
                        </ul>
                    </div>
                ) : datalist.type == 2? (
                    <div className="detail_con" >
                        <ul>
                            <li className='border_blue'><span>保健功能：</span><span>{ datalist.health }</span></li>
                            <li><span>商品剂型：</span><span>{ datalist.type2 }</span></li>
                            <li><span>商品用法：</span><span>{ datalist.usetype== 1? '内服': '外用' }</span></li>
                        </ul>
                        <ul>
                            <li className='border_blue'><span>规格：</span><span>{ datalist.specification }</span></li>
                            <li><span>成分：</span><span>{ datalist.type2 }</span></li>
                            <li><span>性状：</span><span>{ datalist.usetype== 1? '内服': '外用' }</span></li>
                            <li><span>适宜人群：</span><span>{ datalist.appropriate }</span></li>
                            <li><span>用法用量：</span><span>{ datalist.dose }</span></li>
                            <li><span>生产厂家：</span><span>{ datalist.enterprise }}</span></li>
                            <li><span>有效期：</span><span>{ datalist.uselife }</span></li>
                            <li><span>批准文号：</span><span>{ datalist.code }</span></li>
                            <li><span>注意事项：</span><span>{ datalist.cautions }</span></li>
                        </ul>
                    </div>
                ) :  datalist.type == 3? (
                    <div className="detail_con" >
                        <ul>
                            <li className='border_blue'><span>型号：</span><span>{ datalist.model }</span></li>
                            <li><span>生产企业：</span><span>{ datalist.enterprise }</span></li>
                            <li><span>适宜人群：</span><span>{ datalist.appropriate }</span></li>
                            <li><span>使用方法：</span><span>{ datalist.utype }</span></li>
                            <li><span>注意事项：</span><span>{ datalist.cautions }</span></li>
                        </ul>
                    </div>
                ) : ( <div></div>)
                    
                }    
                <div className="cont_img">
                    <ul>
                        {
                            this.props.data.imgs.map((val,j ) => {
                                return <li key={j} ><img src={ $http.baseURL+val.img } alt="" /></li>
                            })
                        }
                    </ul>
                </div>       
            </div>
        )
    }
}

class NewShop extends React.Component {
    constructor (props) {
        super(props);
        console.log(props)
    }
    emsFn () { // 减
        this.props.ems()
    }
    addFn () { // 加
        this.props.adds()
    }
    render () {
        let { newDataobj, numVal } = this.props.newData
        return (
            <div className='NewShop'>
                <div className='NewShop-banner'>
                    <img src={ $http.baseURL+newDataobj.pic } alt="" />
                </div>
                <div className="newshop-info">
                    <h4>{ newDataobj.name }</h4>
                    <div className='shop-money'>
                        <span className="color-red">￥<span>{ newDataobj.money }</span></span>
                        <div className="nums">
                            <span onClick={ this.emsFn.bind(this) }><img src={ emsPic } alt="" /></span>
                            <span>{ numVal }</span>
                            <span onClick={ this.addFn.bind(this) }><img src={ addPic } alt="" /></span>
                        </div>
                    </div>
                </div>    
                <div className="detail_con">        
                    <ul>
                        <li className='border_blue'><span>商品类型：</span><span>{ newDataobj.cfy }</span></li>
                        <li><span>商品剂型：</span><span>{ newDataobj.ypzt }</span></li>
                        <li><span>商品用法：</span><span>{ newDataobj.yfyl }</span></li>
                    </ul>
                    <ul>
                        <li className='border_blue'><span>规格：</span><span>{ newDataobj.gg }</span></li>
                        <li><span>成分：</span><span>{ newDataobj.cf }</span></li>
                        <li><span>性状：</span><span>{ newDataobj.xz }</span></li>
                        <li><span>功能主治：</span><span>{ newDataobj.syz }</span></li>
                        <li><span>用法用量：</span><span>{ newDataobj.yfyl }</span></li>
                        <li><span>生产厂家：</span><span>{ newDataobj.gc }</span></li>
                        <li><span>有效期：</span><span>{ newDataobj.yxq }</span></li>
                        <li><span>批准文号：</span><span>{ newDataobj.pzwh }</span></li>
                        <li><span>注意事项：</span><span>{ newDataobj.zysx }</span></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default ShopDetails;