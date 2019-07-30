import React from 'react';
import $http from '../../api';
import sucPic from '../../assets/img/icon_shtg@2x.png';
import errPic from '../../assets/img/icon_cfygq@2x.png';

class Cfdetails extends React.Component {
    state = {
        odata: '',
        drug: [],
        datalist: []
    }
    componentDidMount () {
        this.initdata()
    }
    initdata () {
        var _self = this;
        var { did } = this.props.match.params;
        $http.post('/mobile/doch5/user_recipe_detail', { id: did }, function (res) {
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
        this.props.history.push('/download/'+this.props.match.params.did)
    }

    render () {
        var d = this.state;
        return (
            <div className='cfdetails'>
                {
                    d.odata.drug_type == 2? < TitleMsg data={ d.odata } /> : d.odata.drug_type == 1? < TitleMsgs2 data={ d.odata } /> : ''
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
                                <p><span>诊断结果：</span><span>{ d.odata.result }</span></p>
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
                        <li><span>患者信息</span><span>{ d.odata.name }<b>|</b>{ d.odata.sex== 1? '男': '女' }<b>|</b>{ d.odata.age }</span></li>
                        {/* <li><span>患者手机</span><span></span></li> */}
                        <li><span>患者主诉</span><span>{ d.odata.opinion }</span></li>
                        <li><span>诊断结果</span><span>{ d.odata.result }</span></li>
                    </ul>
                </div>
                <div className='cfdetails-drug'>
                    <h2>处方的药品</h2>
                    <ul>
                        {
                            d.drug.map((val, j) => {
                                return (
                                    <li key={j}>
                                        <dl className='flex flex-sb'>
                                            <dt>{ val.name }<span>{ val.gg?"("+val.gg+")": '' }</span></dt>
                                            <dd>x{ val.num }</dd>
                                        </dl>
                                        <p><span>用法用量：</span><span>{ val.usage }</span></p>
                                    </li>
                                )
                            })
                        }
                    </ul>
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
                data.status == 1? (
                    <div className='cfdetails-checks cfdetails-blue'>
                        <img src={ sucPic } alt="" /><span>处方已开具</span>
                    </div>
                 ) : (
                    <div className='cfdetails-checks cfdetails-orange'>
                        <img src={ errPic } alt="" /><span>处方已过期</span>
                    </div>
                 )
            }
        </div>
    )
}

function TitleMsgs2 (props) {
    let { data } = props;
    return (
        <div className='cfdetails-title'>
            {
                data.drug_autdit == 0? (
                    <div className='cfdetails-checks cfdetails-blue'>
                        <img src={ sucPic } alt="" /><span>处方未审核</span>
                    </div>
                 ) : data.drug_autdit == 1? (
                    <div className='cfdetails-checks cfdetails-blue'>
                        <img src={ sucPic } alt="" /><span>药师审核通过</span>
                    </div>
                 ) : (
                    <div className='cfdetails-checks cfdetails-orange'>
                        <img src={ errPic } alt="" /><span>药师审核未通过</span>
                    </div>
                 )
            }
        </div>
    )
}

export default Cfdetails;