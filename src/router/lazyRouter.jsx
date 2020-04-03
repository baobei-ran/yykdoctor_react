import React from 'react';
// 路由懒加载
// webpack+es6的import纯粹的高阶组价
// export default function (loading) {
//     return class Load extends React.Component {
//         constructor (props) {
//             super(props);
//             this.state = {
//                 Com: null
//             }
//             this.load();
//         }
        
//         load () {
//             loading().then((Com) => {
//                 this.setState({
//                     Com: Com.default? Com.default : null
//                 })
//             })
//         }
//         render() {
//             let data = this.props.match;
//             let Com = this.state.Com;
//             return Com ? <Com match={ data } /> : null
//         }
//     }
// }


// webpack+es6的import +async（高阶函数）
// export default function (loading) {
//     return class extends React.Component {
//         constructor(props) {
//             super(props);
//             this.state = {
//                 Component: null
//             }
//         }
//         async componentWillMount () {
//             let res = await loading(); //依次执行，只有一个await往下走，res是有值的
//             this.setState({
//                 Component: res.default?res.default: null
//             })
//         }
//         render () {
//             let data = this.props.match;
//             let Com = this.state.Component;
//             return Com? < Com  match={ data } /> : null
//         }
//     } 
// }



// 4、路由懒加载 (高阶组价)
export default function(loading){    
    return class extends React.Component {  
        constructor (props) {            
            super (props);            
            this.state={                
                Com:null            
            };        
        };        
        componentWillMount(){
            loading().then(res => {
                this.setState({                    
                    Com: res.default?res.default:null
                }); 
            })             
        };        
        render(){            
            let Com=this.state.Com;            
            return Com && <Com { ...this.props }/>       
        };    
    };
};


// 使用方式
// import Load from '../components/lazy';
// let Demo2=Load(()=>import('../components/demo2'));

