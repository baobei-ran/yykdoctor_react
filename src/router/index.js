import React, { Suspense } from 'react';
import {Switch, 
    // BrowserRouter as Router, 
    HashRouter as Router,
    Route } from "react-router-dom";
import Load from './lazyRouter'; // 懒加载

let SetTime = Load(() => import('../components/yyk-vs1/SetTime'));
let Details = Load(() => import('../components/yyk-vs1/Details'));
let Agreement = Load(() => import('../components/yyk-vs1/Agreement'));

let Cfdetails = Load(() => import( /* webpackChunkName: "cf" */ '../components/yyk-recipe/cfdetails'));               // 患者处方
let Cfdownload = Load(() => import(/* webpackChunkName: "cf" */ '../components/yyk-recipe/Cfdownload'));             // 处方单
const DocCfdetails = React.lazy(() => import(/* webpackChunkName: "cf" */ '../components/yyk-recipe/docCfdetails')); // 药店处方

let ShopDetails = Load(() => import( /* webpackChunkName: "shop" */ '../components/yyk-shopping/ShopDetails')); // 商品详情
const NewShopDetails = React.lazy(() => import(/* webpackChunkName: "shop" */ '../components/yyk-shopping/newShopDetails')); // 可加减操作的商品详情页
const ExchangeDetail = React.lazy(() => import('../components/yyk-lv/exchangeDetail.jsx'));
const RuleIntroduction = React.lazy(() => import('../components/yyk-lv/ruleIntroduction.jsx'));

const Lazy = React.lazy(() => import('../components/lazy/lazyloading'));
const ReactLoading = {
    fontSize: '16px',
    color: '#666',
    width: '100%',
    textAlign: 'center',
    marginTop: '10%'
}
function ReactRouter () {
        return (
            <Router>
                <Suspense fallback={<div style={ ReactLoading } >Loading...</div>}>
                    <Switch>
                        <Route exact path="/SetTime/:did" exact component={ SetTime } />
                        <Route path="/Details/:did/:aid" component={Details} />
                        <Route path="/Agreement" component={Agreement} />
                        <Route path="/detail/:did" component={Cfdetails} />
                        <Route path="/download/:did/:type"  component={Cfdownload} />
                        <Route path="/shopdetails/:did" component={ShopDetails} />
                        <Route path="/doctordetail/:did" component={ DocCfdetails } />
                        <Route path="/newshopdetails/:did/:tag/:int" component={NewShopDetails} />
                        <Route path="/exchangeDetail/:id" component={ExchangeDetail} />
                        <Route path="/ruleIntroduction/:tag" component={RuleIntroduction} />
                        <Route path="/lazy" component={Lazy} />
                    </Switch>
                </Suspense>
            </Router>
        )
}

export default ReactRouter