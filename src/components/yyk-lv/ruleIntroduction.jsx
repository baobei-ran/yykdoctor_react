import React from 'react';

class RuleIntroduction extends React.Component {
    render() {
        let { tag } = this.props.match.params;
        console.log(tag)
        return (
            <div className='ruleIntroduction'>
                {
                    tag == 1 ? <img src={require('../../assets/img/pic_djgz.png')} alt='' /> : <img src={require('../../assets/img/pic_ybgz@2.png')} alt='' />
                }
            </div>
        )
    }
}

export default RuleIntroduction