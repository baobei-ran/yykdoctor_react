import React,{ Component } from 'react';
import http from '../../api/index';
import { Button,Toast,Modal } from 'antd-mobile';
const alert = Modal.alert;
class SetTime extends Component {
    constructor () {
        super ();
        this.state = {
            did: '',
            Time: [],   // 时间展示
            getTime: [],    // 设置完成的
            setTimes: [],    // 设置
            closeTime: [],  // 停诊
            address: '',    // 门诊地点
            type: '1',      // 门诊类型
            money: '',      // 金钱
            num: '',        // 人数
            disabled: false,    // 按钮控制
        }
        this.initdata = this.initdata.bind(this);
        this.ClicksaveComplete = this.ClicksaveComplete.bind(this)
    }

    initdata () { // 数据展示
        var that = this, SelectDate = [];
        var { did } = this.props.match.params;
        this.setState({
            did: did
        })
       http.post('/mobile/doch5/get_time', { did: did }, function (res) {
           console.log(res)
           that.setState({
               getTime: res.data.time,
               address: res.data.address,
               closeTime: res.time_close
           })
           if (res.code == 1) {
            var AllDays = 15;
            var num = (new Date().getDay()) + 1;
            for (var i = num; i < AllDays; i++) {
                SelectDate.push(setDate(new Date(), i))
            }
           if (SelectDate.length > 1) {
             that.setState({
                Time: SelectDate
             })
           }
           }
           setTimeout(() => {
           // 已设置的展示
           if (that.state.getTime && that.state.getTime.length > 0) {
                that.state.getTime.map((v,i) => {
                    var d = new Date(v.days * 1000);
                    var tMonth = d.getMonth();
                    var tDate = d.getDate();
                    tMonth = DoHandleMonth(tMonth + 1);
                    tDate = DoHandleMonth(tDate);
                    var id = tMonth + "-" + tDate;
                    
                    that.state.Time.map((val,j) => {
                        if (id == val.id) {
                            if (v.reg_time1) {
                                var ds = that.refs.sw.children
                                for (var i=0; i<ds.length; i++) {
                                   if (ds[i].getAttribute('data-date') == val.date) {
                                       ds[i].className = 'ysz'
                                       ds[i].style = 'background:url('+require("../../assets/img/icon/icon_ysz.png")+') no-repeat; background-size: contain'
                                   }
                                } 
                            } else if (v.reg_time2) {
                                var dx = that.refs.xw.children
                                for (var o=0;o<dx.length; o++) {
                                   if (dx[o].getAttribute('data-date') == val.date) {
                                       dx[o].className = 'ysz';
                                       dx[o].style = 'background:url('+require("../../assets/img/icon/icon_ysz.png")+') no-repeat; background-size: contain'
                                   }
                                } 
                            } else if (v.reg_time3) {
                                var dw = that.refs.ws.children
                                for (var p=0; p<dw.length; p++) {
                                   if (dw[p].getAttribute('data-date') == val.date) {
                                       dw[p].className = 'ysz'
                                       dw[p].style = 'background:url('+require("../../assets/img/icon/icon_ysz.png")+') no-repeat; background-size: contain'
                                   }
                                } 
                            }
                        }
                    })
                })
           }
            // 停诊展示
           if (that.state.closeTime && that.state.closeTime.length > 0) {
            that.state.closeTime.map((v,i) => {
                var d = new Date(v.close_days * 1000);
                var tMonth = d.getMonth();
                var tDate = d.getDate();
                tMonth = DoHandleMonth(tMonth + 1);
                tDate = DoHandleMonth(tDate);
                var id = tMonth + "-" + tDate;
                that.state.Time.map((val,j) => {
                    if (id == val.id) {
                        console.log(val)
                        if (v.close_reg_time1) {
                            var ds = that.refs.sw.children
                            for (var i=0; i<ds.length; i++) {
                               if (ds[i].getAttribute('data-date') == val.date) {
                                   ds[i].className = 'ytz'
                                   ds[i].style = 'background:url('+require("../../assets/img/icon/icon_ytz.png")+') no-repeat; background-size: contain'
                               }
                            } 
                        } else if (v.close_reg_time2) {
                            var dx = that.refs.xw.children
                            for (var y=0; y<dx.length; y++) {
                               if (dx[y].getAttribute('data-date') == val.date) {
                                   dx[y].className = 'ytz';
                                   dx[y].style = 'background:url('+require("../../assets/img/icon/icon_ytz.png")+') no-repeat; background-size: contain'
                               }
                            } 
                        } else if (v.close_reg_time3) {
                            var dw = that.refs.ws.children
                            for (var m=0; m<dw.length; m++) {
                               if (dw[m].getAttribute('data-date') == val.date) {
                                   dw[m].className = 'ytz'
                                   dw[m].style = 'background:url('+require("../../assets/img/icon/icon_ytz.png")+') no-repeat; background-size: contain'
                               }
                            } 
                        }
                    }
                })
            })
       }
    }, 100)
       })
    }
   
    componentDidMount () { // 生命周期
        this.initdata();
        this.ClicksaveComplete()
    }

    clickSetDate (e) { // 点击设定
        var $this = e.target;
        if ($this.className == 'ysz' || $this.className == 'ytz') {
            return;
        }
        if ($this.style.background !== '') {
            $this.style = '';
            $this.className = '';
        } else {
            
            $this.className = 'active';
            $this.style = 'background:url('+require("../../assets/img/icon/icon_active.png")+') no-repeat; background-size: contain'
        }

    }

    onSubmit () { // 提交保存
        var _self = this;
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; // 金钱正则
        var d = document.getElementsByClassName('active');
        var arr= [];
            for (var i=0;i<d.length;i++) {
                var objTime = {};
                    objTime.time_type = d[i].getAttribute('data-type');
                    objTime.time = d[i].getAttribute('data-time');
                    arr.push(objTime);
                    
            }
            _self.state.setTimes = arr;
            _self.setState({
                setTimes: _self.state.setTimes
            })
            console.log(_self.state)
        if (_self.state.setTimes.length <=0 ) {
            Toast.info('请选择时段', 2)
            return;
        }
        if (_self.state.money == '') {
            Toast.info('请设置门诊费用', 2)
            return;
        }
        if (!reg.test(_self.state.money)) {
            Toast.info('请设置正确的门诊费用', 2)
            return;
        }
        if (_self.state.num == '') {
            Toast.info('请设定可预约人数', 2)
            return;
        }
        var obj = { // 传参
            did: this.state.did,
            type: this.state.type,
            money: this.state.money,
            num: this.state.num,
            data: this.state.setTimes,
          }
        console.log(obj)
        _self.setState({
            disabled: true
        })
            
        alert('服务提示', '保存后患者可在你的主页上预约门诊是否确认保存设定？', [
        { text: '取消', onPress: () => { _self.setState({ disabled: false }) } },
        { text: '确定', onPress: () => {
            console.log(http)
            http.$postJson("/mobile/doch5/set_time", obj, null, function (res) {
                console.log(res)
                _self.setState({ disabled: false })
                  if (res.code == 1) {
                    Toast.success(res.msg, 2);
                    setTimeout(function(){
                        _self.setState({
                            money: '',
                            num: '',
                            type: '1',
                            setTimes: []
                        })
                        _self.initdata(); // 刷线数据
                        _self.refs.money.value = '';
                        _self.refs.num.value = '';
                        _self.ClicksaveComplete(); // 交互
                    }, 2000)
                  } else {
                    Toast.info(res.msg, 2)   
                  }
                 
            })
        }},
        ])
        
             
               
             
        
    }

    onType (val) { // 选择门诊类型
        this.setState({
            type: val
        })
    }
    onChangeMoney (e) { // 设置金钱
        var m = e.target.value;
        // m = m.replace(/\D?\+?\-?/g, '');
        m = m.replace(/^([1-9]\d*(\.[\d]{0,2})?|0(\.[\d.]{0,2})?)[\d]*/g, '$1');
        // m = m.replace(/[^\d\.\d$]/g, '');
        var money2 = m.match(/^\d*(\.?\d{0,2})/g)[0]; // 保留小数点后面两位小数
        e.target.value = money2
        this.setState({
            money: money2
        })
    } 
    onChangeNumber (e) { // 设置人数
        var n = e.target.value;
        var rg = /^\d+$/;
        if (!rg.test(n)) {
            n = n.replace(/\D?\+?\-?\.?/g, '')
            e.target.value = n
        }
        if (n == 0) {
            n = ''
        }
        e.target.value = n
        this.setState({
            num: e.target.value
        })
    }

    ClicksaveComplete () { // 和 ios 和 android 交互
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        console.log(isAndroid, isiOS)
        // if (isAndroid) {
        //     android.saveComplete();
        // }
        // if (isiOS) {
        //     window.webkit.messageHandlers.saveComplete.postMessage(null);
        // }
      }

    render () {
        var tds = { width: '0.88rem', height: '0.72rem'};
        return (
            <div className='SetTime'>
                <p>提示：可多选批量设定，每周日开启下一时间段预约</p>
                <div className='timer'>
                    <div className='timer-box'>
                        <table className='timer-table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    {  this.state.Time.map((val,i) => {
                                            return (
                                                <th style={tds} key={i}>{ val.week }<br/>{ val.date }</th>
                                            )
                                       })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr ref='sw'>
                                    <td>上午</td>
                                    { this.state.Time.map((val, index) => {
                                        return (
                                            <td data-type='1' onClick={ (e) => this.clickSetDate(e) } key={index} data-time={val.time} data-week={val.week} data-date={val.date} ></td>
                                        )
                                    }) }
                                </tr>
                                <tr ref='xw'>
                                    <td>下午</td>
                                    { this.state.Time.map((val, index) => {
                                        return (
                                            <td data-type='2' onClick={ (e) => this.clickSetDate(e) } key={index} data-time={val.time} data-week={val.week} data-date={val.date} ></td>
                                        )
                                    }) }
                                </tr>
                                <tr ref='ws'>
                                    <td>夜间</td>
                                    { this.state.Time.map((val, index) => {
                                        return (
                                            <td data-type='3' onClick={ (e) => this.clickSetDate(e) } key={index} data-time={val.time} data-week={val.week} data-date={val.date} ></td>
                                        )
                                    }) }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='setTime-setInfo'>
                    <ul>
                        <li>
                            <span>门诊类型</span>
                            <p className='types'>
                                <span className={ this.state.type === '1'?'blue':'' } onClick={this.onType.bind(this, '1')} >普通</span>
                                <span className={ this.state.type === '2'?'blue':'' } onClick={this.onType.bind(this, '2')} >专家</span>
                            </p>
                        </li>
                        <li><span>门诊地点</span><input type='text' style={{ color: '#777' }} defaultValue={ this.state.address } disabled/></li>
                        <li><span>挂号费用</span><input type='number' ref='money' onKeyUp={ (e) => this.onChangeMoney(e) } placeholder='输入单次挂号价格（元）' /></li>
                        <li><span>预约人数</span><input type='number' ref='num' onKeyUp={ (event) => this.onChangeNumber(event) } placeholder='输入可预约人数（人）' /></li>
                    </ul>               
                </div>
                <div className='setTime-footer'>
                    <Button type="primary" disabled={ this.state.disabled } onClick={ this.onSubmit.bind(this) } >保存设置</Button>
                </div>
            </div>
        )
    }
}

//    时间不足2位用0填充
function DoHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  }

// 现在获取两周时间排列
 function formatDate (date) {    
    // var year = date.getFullYear() 
    var month = DoHandleMonth(date.getMonth()+1);
    var day = DoHandleMonth(date.getDate());
    var targetday_milliseconds = date.getTime();
    var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()]; 
    return {
        date: month+'.'+day,
        id: month+'-'+day,
        time: parseInt(targetday_milliseconds / 1000),
        week: week,
    }
};
var addDate= function(date,n) {    
    date.setDate(date.getDate()+n);    
    return date;
};
var setDate = function(date, n) {       
    var week = date.getDay()-1;
    date = addDate(date,week*-1);
    for(var i = 0;i<n;i++) {         
    //  var timer = formatDate(i==0 ? date : addDate(date,1));    // 星期一开始
    var timer = formatDate(i==0 ? addDate(date,-1) : addDate(date,1));//星期日开始
    } 
    return timer   
};

export default SetTime;
