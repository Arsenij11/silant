import React from 'react';
import {Route, Routes} from "react-router-dom";
import Header from "./components/header";
import Info from "./components/info";
import Footer from "./components/footer";
import Auth from "./components/auth";
import Create from './components/create';

class App extends React.Component {
    render() {
        return (
            <Routes>
                <Route path="/" element={
                    <>
                        <Header />
                        <Info />
                        <Footer />
                    </>
                } />
                <Route path="/auth" element={
                    <>
                        <Header />
                        <Auth />
                        <Footer />
                    </>
                } />
                <Route path="/create" element = {
                    <>
                        <Header />
                        <Create />
                        <Footer />
                    </>
                } />
            </Routes>
        )
    }
}

export default App;