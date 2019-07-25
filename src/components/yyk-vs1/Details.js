import React from 'react';
import $http from '../../api/index';
import msgPic from '../../assets/img/icon/default.png';
class Details extends React.Component {
    constructor () {
        super();
        this.state = {
            content: '',
            create_time: '',
            title: '',
            editer: '',
            msg: '',
            isStatus: false
        }
    }
    componentDidMount () {
        this.initdata()
    }
    initdata () {
        let { did, aid } = this.props.match.params;
        var obj = {did:did, aid: aid}, _self = this;
        $http.post('/mobile/doch5/articledata', obj, function (res) {
            console.log(res)
            if (res.code == 1) {
                _self.setState({
                    title: res.data.title,
                    create_time: _self.date_format(res.data.created_at),
                    content: res.data.content,
                    editer: res.data.editer,
                    msg: '来源'
                })
            } else {
                _self.setState({
                    isStatus: true
                })
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
        var sec = time.getSeconds();
        return year+'/'+zero(month)+'/'+zero(day)+' '+zero(hour)+':'+zero(mins)+':'+zero(sec);
    }

    render () {
        return (
            <div className='Details'>
                { this.state.isStatus? <DelMsg /> : <Info data={ this.state } />  }
                {/* {
                    this.state.isStatus? 
                        (
                            <div className='delmsg'>
                                <img src={msgPic} alt='' />
                                <p>文章已被删除</p>
                            </div> 
                        ): 
                        (
                            <div>
                                <div className='Details-title'>{ this.state.title }</div>
                                <div className='details-msg'>
                                    <p>
                                        <span>{ this.state.msg }</span>
                                        <span>{ this.state.editer }</span>
                                    </p>
                                    <p>{ this.state.create_time }</p>
                                </div>
                            </div>
                        )
                } */}
            </div>
        )
    }
}



function Info (props) {
    var { data } = props;
    return (
        <div className='Details-box'>
            <div className='Details-title'>{ data.title }</div>
            <div className='Details-msg'>
                <p className='fl'>
                    <span>{ data.msg }</span>
                    <span>{ data.editer }</span>
                </p>
                <p className='fr'>{ data.create_time }</p>
            </div>
            <div className='Details-content'>
                <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
        </div>
    )
}

function DelMsg () {
    return (
        <div className='Details-delmsg'>
            <img src={msgPic} alt='' />
            <p>您查阅的文章已被删除，请查阅其他文章。</p>
        </div>
    )
}

export default Details