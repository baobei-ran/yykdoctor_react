import React from 'react';
import $http from '../../api/index'
import html2canvas from 'html2canvas';
import { Toast } from 'antd-mobile';
class Cfdownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            odata: '',
            drug: [],
            datalist: [],
            isView: false,
            base64Pic: '',       // HTML转图片数据
            type: 0,
            viewMsg: '',
            is_loading: true,
        }
        Toast.loading('', 0);
    }
    
    componentDidMount () {
        let { did, type } = this.props.match.params;
        if (type == 1) {
            this.docCheckCf(did)
        } else {
            this.userCheckCf(did)
        }
        this.setState({
            type: type
        })
        
    }

    userCheckCf(id) {
        var _self = this;
        $http.post('/mobile/doch5/user_recipe_detail', {id: id}, function (res) {
            console.log(res)
            if (res.code == 1) {
                _self.setState({
                    odata: res.data,
                    drug: res.drug,
                    datalist: [{name: '姓名：', val: res.data.name },
                                {name: '性别：',val: res.data.sex == 1? '男': '女' },
                                {name: '年龄：',val: res.data.age },
                                {name: '肝功能：',val: res.data.liver? res.data.liver: '正常' },
                                {name: '肾功能：',val: res.data.kidney?res.data.kidney: '正常' },
                                {name: '备孕情况：',val: res.data.yun?res.data.yun:'无' },
                                {name: '过敏史：',val: res.data.allergy? res.data.allergy: '无' },
                                {name: '过往病史：',val: res.data.ago?res.data.ago : '无'}],
                    isView: true
                })
               _self.loadingCanvas()
            } else {
                Toast.hide()
                _self.setState({
                    isView: false,
                    viewMsg: '该处方单不存在或已销毁',
                    is_loading: false
                })
            }
        })
    }

    docCheckCf(id) {
        var _self = this;
        $http.post('/mobile/Doch5/recipe_look', { id: id }, function (res) {
            console.log(res)
            if (res.code == 1) {
                _self.setState({
                    odata: res.data,
                    drug: res.recipe_eat,
                    datalist: [{name: '姓名：', val: res.data.name },
                                {name: '性别：',val: res.data.sex == 1? '男': '女' },
                                {name: '年龄：',val: res.data.age },
                                {name: '肝功能：',val: res.data.liver? res.data.liver: '正常' },
                                {name: '肾功能：',val: res.data.kidney?res.data.kidney: '正常' },
                                {name: '备孕情况：',val: res.data.yun?res.data.yun:'无' },
                                {name: '过敏史：',val: res.data.allergy? res.data.allergy: '无' },
                                {name: '过往病史：',val: res.data.ago?res.data.ago : '无'}],
                    isView: true
                })
                _self.loadingCanvas()
            } else {
                Toast.hide()
                _self.setState({
                    isView: false,
                    viewMsg: '该处方单不存在或已销毁',
                    is_loading: false
                })
            }
        })
    }
    loadingCanvas() {
        var _self = this;
        if (_self.state.isView) {
            var t = setTimeout(() => {
                var doms = _self.refs.htmls;
                console.log(doms.offsetHeight)
                var width = doms.offsetWidth;       // 获取dom 宽度
                var height = doms.offsetHeight/2;   // 获取dom 高度，去除一半 transform 占位空白页面
                var canvas = document.createElement("canvas"); //创建一个canvas节点
                var scale = window.devicePixelRatio * 1;//获取设备的显示参数
                canvas.width = width * scale; //定义canvas 宽度 * 缩放
                canvas.height = height * scale; //定义canvas高度 *缩放
                canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
                var opts = {
                    backgroundColor:null,
                    scale: scale?scale:2, // 添加的scale 参数
                    canvas: canvas, //自定义 canvas
                    logging: false, //日志开关，便于查看html2canvas的内部执行流程
                    width: width, //dom 原始宽度
                    height: height,
                    // allowTaint: true,
                    // useCORS: true // 开启跨域配置
                };
                html2canvas(doms, opts).then(function (canvas) {
                    var imgs = canvas.toDataURL("image/png");
                    var dombox = _self.refs.picBox;
                    dombox.classList.add('flex');
                    dombox.classList.add('flex-y');
                    dombox.innerHTML = '<img style="width: 100%;" src="'+imgs+'" alt="" />'
                    _self.setState({
                        base64Pic: imgs,
                        is_loading: false
                    })
                    Toast.hide()
                })
                clearTimeout(t)
            }, 3000)
       }
    }

    time_date (n) { // 补零
        if (n < 10) {
            n = '0'+n
        }
        return n;
    }
    date_format (date) { // 格式时间
        if (!date) {
            return;
        }
        var zero = this.time_date;
        var time = new Date(date * 1000);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var hour = time.getHours();
        var mins = time.getMinutes();
        return year+'-'+zero(month)+'-'+zero(day)+' '+zero(hour)+':'+zero(mins);
    }

    downloadPic () {   // 调取安卓 和 ios方法
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            window.android.downLoad(this.state.base64Pic)
        }
        if (isiOS) {
            window.webkit.messageHandlers.downLoad.postMessage(this.state.base64Pic);
        }
    }

    render () {
        var d = this.state;
        return (
            <div className='Cfdownload'>
                <React.Fragment>
                    { d.is_loading? <div className='isLoading'></div> : '' }
                </React.Fragment>
                {
                    d.isView ? (
                        <React.Fragment>
                            <div className='Cfdownload-pic' ref='picBox'>
                                <div className='pic-box' ref='htmls'>
                                    <div className='cf-box' >
                                        <div className='cf-head'>
                                            <ul className='flex flex-sa'>
                                                <li>
                                                    <span>处方编号：</span>
                                                    <span>{ d.odata.number }</span>
                                                </li>
                                                <li><span>处方生成时间：</span><span>{ this.date_format(d.odata.start_time) }</span></li>
                                                <li><span>处方失效时间：</span><span>{ this.date_format(d.odata.undue_time) }</span></li>
                                            </ul>
                                            <h1>云医康互联网医院电子处方</h1>
                                        </div>
                                        <div className='cf-userInfo'>
                                            <ul className='flex flex-wp'>
                                                {
                                                    d.datalist.map((val,i) => {
                                                        return (
                                                            <li key={i}><span>{ val.name }</span><span>{ val.val }</span></li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                            <p><span>诊断结果：</span><span>{ d.odata.result }</span></p>
                                        </div>
                                        <div className='cf-drug'>
                                            <h2>Rp:</h2>
                                            {
                                                d.drug.map((val, j) => {
                                                    return (
                                                        <ul key={j}>
                                                            <li>
                                                                <span>{ val.name } <b>{ val.gg? '('+val.gg+')': '' }</b></span>
                                                                <span className='mg-l'>x{val.num}</span>
                                                            </li>
                                                            <li><span>用法用量：</span>
                                                                <span>{ val.usage }</span>
                                                            </li>
                                                        </ul>
                                                    )
                                                })
                                            }
                                            <div className='zhang'>
                                                <img src={ d.odata.seal?$http.baseURL+d.odata.seal:'' } alt='' />
                                            </div>
                                        </div>
                                        <p className='cf-msg'>( 一下空白，手写无效 )</p>
                                        <div className='cf-signature'>
                                            <ul>
                                                <li>
                                                    <span>处方医师：</span>
                                                    <img src={ d.odata.signpic?$http.baseURL+d.odata.signpic:'' } alt='' />
                                                </li>
                                                {
                                                    d.type == 1 ? ( d.odata.yname_pic? (
                                                            <li ><span>审核药师：</span><img ref='pharmacist' src={ $http.baseURL+d.odata.yname_pic} alt="" /></li>
                                                        ) : '') : ''
                                                    
                                                    
                                                }
                                               
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='Cfdownload-btn'>
                                <button onClick={ this.downloadPic.bind(this) }>下载处方</button>
                            </div>
                        </React.Fragment> 
                    ) : <div className='cf-dw-msg'>{ d.viewMsg }</div>
                }
            </div>
        )
    }


    componentWillUnmount(){ // 销毁
	    Toast.hide()
	}

}

export default Cfdownload;