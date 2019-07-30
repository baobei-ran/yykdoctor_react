import React from 'react';
// 路由懒加载
export default function (lading) {
    return class Load extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                Com: null
            }
            this.load();
        }
        
        load () {
            lading().then((Com) => {
                this.setState({
                    Com: Com.default? Com.default : null
                })
            })
        }
        render() {
            let data = this.props.match;
            let Com = this.state.Com;
            return Com ? <Com match={ data } /> : null
        }
    }
}
