import React from 'react';
import { Routes, Route } from 'react-router-dom';

import JoinPage from "./pages/JoinPage";
import LoginPage from './pages/login';
import IndexPage from './pages';

export const siteMap = {
    JoinPage: {
        title: 'Join Page',
        path: 'join',
        description: 'My sub page'
    },
    ChatPage: {
        title: 'Chat Page',
        path: '/chat/:session_id',
        description: 'My sub page'
    },
    LoginPage: {
        title: 'Login Page',
        path: '/login',
        description: 'Login page'
    }
}

/**
 * Routes component containing routes for the whole application
 * @returns {JSX}
 */
const RouteList = () => (
    <Routes>
        <Route exact path="/" element={<IndexPage/>} />
        <Route exact path={siteMap.JoinPage.path} element={<JoinPage/>} />
        <Route exact path={siteMap.ChatPage.path} element={<JoinPage/>} />
        <Route exact path={siteMap.LoginPage.path} element={<LoginPage/>} />
    </Routes>
);

export default RouteList;