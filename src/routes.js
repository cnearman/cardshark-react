import React from 'react';
import { Routes, Route } from 'react-router-dom';

import JoinPage from "./pages/JoinPage";

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
    }
}

/**
 * Routes component containing routes for the whole application
 * @returns {JSX}
 */
const RouteList = () => (
    <Routes>
        <Route exact path="/" element={<h1>INDEX</h1>} />
        <Route exact path={siteMap.JoinPage.path} element={<JoinPage/>} />
        <Route exact path={siteMap.ChatPage.path} element={<JoinPage/>} />
    </Routes>
);

export default RouteList;