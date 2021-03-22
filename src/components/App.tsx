import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Header from "@components/Header"
import AuthorizationCallback from "@components/AuthorizationCallback"
import WithAuthorization from "@components/WithAuthorization"
import Composer from "@components/Composer"

const App: React.FC = () => {
    return (
        <Router>
            <div className="w-full min-h-screen h-full select-none flex flex-col
            bg-trueGray-50">
                <Header/>
                <Switch>
                    <Route path="/authorization_callback">
                        <AuthorizationCallback/>
                    </Route>
                    <Route path="/">
                        <WithAuthorization>
                            <Composer/>
                        </WithAuthorization>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App