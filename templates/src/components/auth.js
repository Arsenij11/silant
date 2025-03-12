import React from "react";

class App extends React.Component {
    constructor(props) {
        if (document.cookie.match(/(token_silant)=(.+);/) !== null) {
            window.location.href = 'http://localhost:5000';
        }
        super(props);
        this.state = {
            error : null,
            token : null,
            name : null
        }
    }

    checkdata (event) {
        event.preventDefault();
        const username =  event.target.login.value;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                'username' : username,
                'password' : event.target.password.value
            })
        }
        fetch('http://127.0.0.1:8000/auth/token/login/', options). 
        then((response) => {
            return response.json();
        }).
        then((json) => {
            if (json?.non_field_errors) {
                this.setState({
                    error : true
                });
            }
            else {
                this.setState(
                    {
                        token : json.auth_token,
                        name :  username,
                        error : null
                    }
                )
            }
        })
      
        return false;
    }

    render () {
        const {error, token, name} = this.state;

        if (error) {
            return (
                <main>
                    <h1>Авторизация</h1>
                    <form className="auth" onSubmit = {this.checkdata.bind(this)}>
                        <label htmlFor="login">Логин</label>
                        <input type="text" name="login" /> 
                        <p className="error_login_or_password">Неверный логин или пароль</p>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name="password" />
                        <button type="submit">Войти</button>
                    </form>
                </main>
            )
        }
        if (!token) {
            return (
                <main>
                    <h1>Авторизация</h1>
                    <form className="auth" onSubmit = {this.checkdata.bind(this)}>
                        <label htmlFor="login">Логин</label>
                        <input type="text" name="login" />
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name="password" />
                        <button type="submit">Войти</button>
                    </form>
                </main>
            )
        }
        else {
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

            setCookie('token_silant', token, {secure: true, 'max-age': 'Tue, 5 Jan 2077 03:14:07 GMT'});
            setCookie('name_silant', name, {secure: true, 'max-age': 'Tue, 5 Jan 2077 03:14:07 GMT'});
            window.location.href = 'http://localhost:5000'
        }
    }
}

export default App;