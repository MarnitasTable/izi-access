import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import EmployeeRoute from '../ProtectedRoute/EmployeeRoute';

import Create360 from '../Create360/Create360';
import CreateUser from '../CreateUser/CreateUser';
import Dashboard from '../Dashboard/Dashboard';
import Generate360 from '../Generate360/Generate360';
import Home from '../HomePage/HomePage';
import Login from '../Login/Login';
import Manage360s from '../Manage360s/Manage360s';
import ManageUsers from '../ManageUsers/ManageUsers';
import UserProfile from '../UserProfile/UserProfile';
import View360 from '../View360/View360';
// import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPassword from '../ResetPassword/ResetPassword';

import './App.css';

class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
    this.props.dispatch({type: 'FETCH_IZI_CATEGORIES'});
  }

  render() {
    return (
      <Router>
        <div style= {{height: '100%'}}>
          <Nav />
          <section className="paper"> 
            <Switch>
              
              {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
              <Redirect exact from="/" to="/home" />

              {/* For the following pages, no login is necessary. */}
              <Route
                exact
                path="/home"
                component={Home}
              />
              <Route
                exact
                path="/view360"
                component={View360}
              />
              <Route
                exact
                path="/login"
                component={Login}
              />
              <Route
                exact
                path="/register"
                component={CreateUser}
              />
              <Route
                exact
                path="/reset/:token"
                component={ResetPassword}
              />

              {/* The following pages are protected. The user's access level will be checked.
                The user will be directed to the login page if they are not logged in, and to 
                the home page if they are logged in without the appropriate authorization level */}
              <ProtectedRoute
                exact
                path="/profile"
                component={UserProfile}
              />
              <EmployeeRoute
                exact
                path="/dashboard"
                component={Dashboard}
              />
              <EmployeeRoute
                exact
                path="/create360"
                component={Create360}
              />
              <EmployeeRoute
                exact
                path="/manage360s"
                component={Manage360s}
              />
              <EmployeeRoute
                exact
                path="/manageUsers"
                component={ManageUsers}
              />
              <EmployeeRoute
                exact
                path="/generate360"
                component={Generate360}
              />

              {/* If none of the other routes matched, we will show a 404. */}
              <Route render={() => <h1>404</h1>} />
            </Switch>
          </section>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
