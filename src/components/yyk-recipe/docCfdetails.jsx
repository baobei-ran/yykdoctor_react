import React from 'react';
import $http from '../../api';
import time from '../../assets/img/icon_wsh@2x.png';
import sucPic from '../../assets/img/icon_shtg@2x.png';
import errNo from '../../assets/img/icon_shwtg@2x.png';
import errPic from '../../assets/img/icon_cfygq@2x.png';

class DocCfdetails extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            odata: '',
            drug: [],
            datalist: []
        }
    }
    componentDidMount () {
        this.initdata()
    }
    initdata () {
        var _self = this;
        var { did } = this.props.match.params;
        $http.post('/mobile/Doch5/recipe_look', { id: did }, function (res) {
            console.log(res)
            if (res.code == 1) {
                res.data.result = '还是--技术大纯净水--的减肥茶短时间内加上你的'
                res.data.result = res.data.result.replace(/--/g, '<br />');
                res.data.opinion = res.data.opinion.replace(/--/g, '<br />');
                console.log(res.data)
                _self.setState({
                    odata: res.data,
                    drug: res.recipe_eat? res.recipe_eat: [],
                    datalist: [{name: '姓名：', val: res.data.name },
                                {name: '性别：',val: res.data.sex == 1?  '女':'男' },
                                {name: '年龄：',val: res.data.age },
                                {name: '肝功能：',val: res.data.liver? res.data.liver: '正常' },
                                {name: '肾功能：',val: res.data.kidney?res.data.kidney: '正常' },
                                {name: '备孕情况：',val: res.data.yun?res.data.yun:'无' },
                                {name: '过敏史：',val: res.data.allergy? res.data.allergy: '无' },
                                {name: '过往病史：',val: res.data.ago?res.data.ago : '无'}]
                })
            } else {

            }
        })
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
    clickUprecipes () {
        this.props.history.push('/download/'+this.props.match.params.did+'/1')
    }

    render () {
        var d = this.state;
        return (
            <div className='cfdetails'>
                {
                    < TitleMsg data={ d.odata } />
                }
                <div className='cfdetails-msg'>
                    <div className='cf-pic'>
                        <div className='cf-box'>
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
                                <p className='result'><span>诊断结果：</span><span dangerouslySetInnerHTML={{ __html: d.odata.result }}></span></p>
                            </div>
                        </div>
                        <span className='cf-btn' onClick={ this.clickUprecipes.bind(this) }>查看完整处方</span>
                    </div>
                </div>
                <div className='cfdetails-user'>
                    <ul>
                        <li><span>处方单号</span><span>{ d.odata.number }</span></li>
                        <li><span>开具时间</span><span>{ this.date_format(d.odata.start_time) }</span></li>
                        <li><span>开具医生</span><span>{ d.odata.true_name }</span></li>
                    </ul>
                    <ul>
                        <li><span>患者信息</span><span>{ d.odata.name }<b>|</b>{ d.odata.sex== 1? '女':'男' }<b>|</b>{ d.odata.age }</span></li>
                        <li><span>患者手机</span><span>{ d.odata.phone }</span></li>
                        <li><span>患者主诉</span><span>{ d.odata.disease }</span></li>
                        <li><span>诊断结果</span><span dangerouslySetInnerHTML={{ __html: d.odata.result }}></span></li>
                        <li><span>处理意见</span><span dangerouslySetInnerHTML={{ __html: d.odata.opinion }}></span></li>
                    </ul>
                </div>
                <div className='docCfdetails-drug'>
                    <h2>{ d.odata.hospital_name }</h2>
                    <ul>
                        {  d.drug.length > 0 ? 
                            d.drug.map((val, j) => {
                                return (
                                    <li key={j} >
                                        <div className='flex flex-y'>
                                            <img src={ $http.baseURL+val.pic } alt=""/>
                                            <dl className='flex-1'>
                                                <dt><span>{ val.name }{ val.gg?"("+val.gg+")": '' }</span>
                                                    <b>
                                                        { val.money>0? '￥'+val.money: ''  }
                                                    </b>
                                                </dt>
                                                <dd>{ val.cname } <b>x{ val.num }</b></dd>
                                            </dl>
                                        </div>
                                        <p><span>用法用量：</span><span>{ val.usage }</span></p>
                                    </li>
                                )
                            }) : ''
                        }
                    </ul>
                </div>
                <div className='doc-Yaoshi'>
                    {
                        d.odata.flag > 0? (
                            <ul>
                                <li>
                                    <label>审核药师：</label>
                                    <span>{ d.odata.yname }</span>
                                </li>
                                <li>
                                    <label>审核时间：</label>
                                    <span>{  this.date_format(d.odata.flag_time)  }</span>
                                </li>
                                {
                                    d.odata.flag_text? (
                                        <li>
                                            <label>审核说明：</label> 
                                            <span>{ d.odata.flag_text }</span>
                                        </li>
                                    ) : ''
                                }
                                
                            </ul>
                        ) : ''
                    }
                </div>
            </div>
        )
    }
}


function TitleMsg (props) {
    let { data } = props;
    return (
        <div className='cfdetails-title'>
            {
                data.flag == 0? (
                    <div className='cfdetails-checks cfdetails-blue'>
                        <img src={ time } alt="" /><span>处方未审核</span>
                    </div>
                ) : data.flag == 1? (
                    <div className='cfdetails-checks cfdetails-blue'>
                        <img src={ sucPic } alt="" /><span>药师审核通过</span>
                    </div>
                 ) : data.flag == 2?(
                    <div className='cfdetails-checks cfdetails-orange'>
                        <img src={ errNo } alt="" /><span>药师审核未通过</span>
                    </div>
                 ) : data.flag == 3? (
                    <div className='cfdetails-checks cfdetails-orange'>
                        <img src={ errPic } alt="" /><span>处方已过期</span>
                    </div>
                 ) : ''
            }
        </div>
    )
}

export default DocCfdetails;