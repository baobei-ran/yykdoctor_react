import React from 'react';
import $http from '../../api';
import MsgIcon from "../../assets/img/icon/default.png";
import Swiper from 'swiper/dist/js/swiper.min.js'
import 'swiper/dist/css/swiper.min.css';
class ShopDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datalist: {},
            imgs: [],
            pics: [],
            isView: false,
            flag: false
        }
    }

    componentDidMount () {
        this.initdata()
    }
    initdata () {
        var _this = this;
        let { did } = this.props.match.params;
        $http.post('/mobile/doch5/doc_goods_detail', {id: did }, function (res) {
           var datas = res
        //    console.log(datas)
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
    render () {
        return (
            <div className='shopDetails'>
                {
                    this.state.isView? <Shop data={ this.state } /> : this.state.flag? ( <div className='fail-msg'><img src={ MsgIcon } alt="" />商品不存在或者已被下架</div> ) : ""
                }
            </div>
        )
    }
}


function Shop (props) {
    let { datalist } = props.data;
    return (
        <div className='shopDetails-box'>
            <div className='swiper-box'>
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {
                            props.data.swiperPic.map((val, i) => {
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
            <div className="shop-info">
                <span className="color-red">￥<span>{ datalist.price }</span></span>
                <h4>{ datalist.name }</h4>
                <p><span>{ datalist.sales_volume }</span>人购买</p>
            </div>    
            {/*  1 药品 2 保健品 3 医疗器械  */}
            {   datalist.type == 1? (
                <div className="detail_con" >        
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
            ) : ''
                 
            }    
            <div className="cont_img">
                <ul>
                    {
                        props.data.imgs.map((val,j ) => {
                            return <li key={j} ><img src={ $http.baseURL+val.img } alt="" /></li>
                        })
                    }
                </ul>
            </div>       
        </div>
    )
}

export default ShopDetails;