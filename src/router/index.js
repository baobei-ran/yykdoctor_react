import React from 'react';
import {Switch, 
    // BrowserRouter as Router, 
    HashRouter as Router,
    Route } from "react-router-dom";
import SetTime from '../components/yyk-vs1/SetTime';
import Details from '../components/yyk-vs1/Details';
import Agreement from '../components/yyk-vs1/Agreement';

import Cfdetails from '../components/yyk-recipe/cfdetails';
import Cfdownload from '../components/yyk-recipe/Cfdownload'
function ReactRouter () {
        return (
            <Router>
                <Switch>
                    <Route exact path="/SetTime/:did" exact component={ SetTime } />
                    <Route path="/Details/:did/:aid" component={Details} />
                    <Route path="/Agreement" component={Agreement} />
                    <Route path="/Cfdetails/:id" component={Cfdetails} />
                    <Route path="/Cfdownload/:id"  component={Cfdownload} />
                    {/* <Route path="/hooksTest1" component={HooksTest1} />
                    <Route path="/axiosTest" component={AxiosTest} />
                    <Route path="/hooksUseState" component={HooksUseState} /> */}
                </Switch>
            </Router>
        )
}

export default ReactRouter