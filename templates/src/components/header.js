import React from 'react';
import logo1 from '../Сервис _Мой Силант_/Logotype accent RGB 1.jpg';
import logo2 from '../Сервис _Мой Силант_/Logotype accent RGB 2.jpg'

class Header extends React.Component {
    render() {
        console.log(document.cookie);
        const cookie_name = document.cookie.match(/(name_silant)=(.+)/);
        const name = cookie_name ? cookie_name[2] : null;
        const cookie_token = document.cookie.match(/(token_silant)=(.+);/);
        const token = cookie_token ? cookie_token[2] : null;

        return (
            <header>
                <span>
                    <img onMouseOver={(event) => event.target.src = logo2}
                         onMouseOut={(event) => event.target.src = logo1}
                         onClick={(event) => window.location.href = "http://localhost:5000"}
                         src={logo1}
                    />
                </span>
                <span onClick={(event) => window.location.href = "https://web.telegram.org"}>+7-8352-20-12-09, telegram</span>
                {name && token ? <span>{name} | 
                            <span
                            style={{marginLeft : '2%'}}
                            onClick={(event) => {
                                const setCookie = (name, value, options = {}) => {

                                    options = {
                                        path: '/',
                                        ...options
                                    };
                    
                                    if (options.expires instanceof Date) {
                                        options.expires = options.expires.toUTCString();
                                    }
                    
                                    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                    
                                    for (let optionKey in options) {
                                        updatedCookie += "; " + optionKey;
                                        let optionValue = options[optionKey];
                                        if (optionValue !== true) {
                                            updatedCookie += "=" + optionValue;
                                        }
                                    }
                    
                                    document.cookie = updatedCookie;
                                }
                    
                                setCookie('token_silant', '', {secure: true, 'max-age': -1});
                                setCookie('name_silant', '', {secure: true, 'max-age': -1});
                                window.location.reload();
                            }}>Выйти</span>
                        </span> 
                        :
                        <span onClick={(event) => window.location.href = "http://localhost:5000/auth"}>Авторизация</span>}
                <span onClick={(event) => window.location.href = "http://sb.silant.com/search/"}>Электронная сервисная книжка "Мой Силант"</span>
            </header>
        )
    }
}

export default Header;