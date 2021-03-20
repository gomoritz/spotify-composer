import React from "react"
import Header from "./Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthorizationCallback from "./authorization/AuthorizationCallback"
import WithAuthorization from "./authorization/WithAuthorization"
import Composer from "./composer/Composer"

const App: React.FC = () => {
    return (
        <Router>
            <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 select-none flex flex-col">
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