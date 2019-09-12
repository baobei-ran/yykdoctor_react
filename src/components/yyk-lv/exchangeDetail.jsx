import React from 'react';
import $http from '../../api';
import Swiper from 'swiper/dist/js/swiper.min.js'
import 'swiper/dist/css/swiper.min.css';
import LazyLoad from 'react-lazyload';



class ExchangeDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            orderdata: {
                banner_pic: [],
                details_pic: []
            },
            isView: false,
            isErr: false,
        }
    }
    componentDidMount() {
        var self = this;
        var { id } = this.props.match.params;
        $http.post('/mobile/DocIntegral/gift_shop_details', { id: id }, function(res) {
            console.log(res)
            if (res.code == 200) {
                var orderdataObj = res.data;
                if (orderdataObj.banner_pic) {
                    orderdataObj.banner_pic = orderdataObj.banner_pic.split(',');
                    orderdataObj.banner_pic.filter(val => {
                        return val !== "";
                    })
                }
                if (orderdataObj.details_pic) {
                    orderdataObj.details_pic = orderdataObj.details_pic.split(',');
                    orderdataObj.details_pic.filter(val => {
                        return val !== "";
                    })
                }
                self.setState({
                    isView: true,
                    orderdata: orderdataObj
                })
                if (self.state.orderdata.banner_pic.length > 1) {
                    new Swiper('.swiper-container', {
                        loop: true,
                        // autoplay: true,
                        pagination: {
                            el: '.swiper-pagination',
                        },
                        observer: true
                    })
                }
                
            } else {
                self.setState({
                   isErr: true
                })
            }
        })
    }
    render() {
        var orderdatas = this.state.orderdata;
        return (
            <div className='exchangeDetail'>
                {
                    this.state.isView ? <div className='exchangeDetail-box'>
                        <div className="bannerList">
                            <div className="swiper-container">
                                <div className="swiper-wrapper">
                                    {
                                        orderdatas.banner_pic.map((val,i) => {
                                            return <div className="swiper-slide" key={i}><img src={$http.baseURL + val} alt="" /></div>
                                        })
                                    }
                                </div>
                                <div className="swiper-pagination"></div>
                            </div>
                        </div>
                        <div className="shop-msg">
                            <h2>{ orderdatas.name }</h2>
                            <p>{ orderdatas.text }</p>
                            <ul className="flex flex-sb flex-y">
                                <li>{ orderdatas.gname }</li>
                                <li>
                                    <span>{ orderdatas.count }</span>云医币
                                </li>
                            </ul>
                        </div>
                        <div className="shop-detail">
                            <LazyLoadPage image={orderdatas.details_pic} />
                            {/* <ul>
                                {
                                    orderdatas.details_pic.map((img, j) => {
                                        return <li key={j + "_d"}><LazyLoad height={300}><img src={$http.baseURL + img} alt=""/></LazyLoad></li>
                                    })
                                }
                            </ul> */}
                        </div>
                        <div className="shop-dhgz">
                            <ul>
                                <h3><b></b><span>兑换规则</span><b></b></h3>
                                <li>1、商品及红包一经兑换，不可退换；</li>
                                <li>2、 兑换所得红包奖励，将于1个工作日内发放至鲁通账户中，医生在鲁医通账户中可提现；</li> 
                                <li>3、兑换所得商品，将于7个工作日内为您发货；</li>
                                <li>4、兑换活动的最终解释权归云医安康所有；</li>
                                <li>5、商品和活动皆与设备制作商Apple lnc.无关。</li>
                            </ul>
                        </div>
                    </div> : this.state.isErr ? <div className="exchangeDetail-errMsg"><img src={ require('../../assets/img/icon/default.png') } alt="" /><p>商品不存在</p></div> : <div></div>
                }
            </div>
        )
    }
}


function LazyLoadPage(props) {  // 图片懒加载封装
    const css = {
        imageBox: {
          width: '100%',
          minHeight: '300px',
        },
      }
        const images = [] // 要加载的 img 图片（jsx）
        const refs = [] // 图片的 ref（操作dom时用）
        if (props.image && props.image.length > 0) {
            props.image.map((val, i) => {
                const ref = React.createRef() // 新建空 ref
                refs.push(ref) // 放入 ref 数组
                images.push( // 新建 img jsx 放入 images （图片地址不放入 src 而是放入 自定义属性 data-src）
                    <div style={css.imageBox} key={i}>
                        <img ref={ref} data-src={$http.baseURL + val} />
                        {/* <img ref={ref} data-src={`https://pschina.github.io/src/assets/images/${i}.jpg`} alt="" /> */} 
                    </div>
                )
            })
        }       
    
        const threshold = [0.01] // 这是触发时机 0.01代表出现 1%的面积出现在可视区触发一次回掉函数 threshold = [0, 0.25, 0.5, 0.75]  表示分别在0% 25% 50% 75% 时触发回掉函数
    
        // 利用 IntersectionObserver 监听元素是否出现在视口
        const io = new IntersectionObserver((entries) => { // 观察者
            entries.forEach((item) => { // entries 是被监听的元素集合它是一个数组
                // console.log(item.intersectionRatio)
                if (item.intersectionRatio <= 0) return // intersectionRatio 是可见度 如果当前元素不可见就结束该函数。
                const { target } = item
                target.src = target.dataset.src // 将 h5 自定义属性赋值给 src (进入可见区则加载图片)
                target.parentNode.style['min-height'] = 'auto'; // 改变父元素的默认高度
            })
        }, {
            threshold, // 添加触发时机数组
        });
    
        // onload 函数
        const onload = () => {
            refs.forEach((item) => {
                io.observe(item.current) // 添加需要被观察的元素。
            })
        }
        return (
            <div>
                {images}
                <img onError={onload} src="" />
            </div>
        )
    
}



export default ExchangeDetail;