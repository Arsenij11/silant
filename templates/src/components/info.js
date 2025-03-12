import React from "react";
import Machine from "./machine";
import axios from "axios";

class Info extends React.Component {
    token = null;
    constructor(props) {
        super(props);
        this.state = {
            'machine' : null,
            'detail' : null,
            'error' : null,
            'status' : null
        }
    }

    componentDidMount () {
        if (document.cookie.match(/(token_silant)=(.+);/) !== null) {
            const token = document.cookie.match(/(token_silant)=(.+);/)[2];
            this.token = token;
            const name = document.cookie.match(/(name_silant)=(.+)/)[2];
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Token ' + token
                }
            }
            fetch(`http://127.0.0.1:8000/api/get_user_info/${name}`, options).
            then((response) => {
                return response.json();
            }).
            then((json) => {
                    const data = json;
                    if (data?.detail) {
                        this.setState({
                            'error' : true
                        })
                    }
                    else {
                        this.setState({
                            'status' : data.group,
                        })
                    }
            })
        }
        else {
            this.setState(
                {
                    status : 'not_auth'
                }
            )
        }
    }

    get_data (event) {
        event.preventDefault();
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
       
        }
        fetch(`http://127.0.0.1:8000/api/get_machine/${event.target.factory_number.value}/${this.token}`, options).
        then((response) => {
            return response.json();
        }).
        then((json) => {
                const data = json;
                if (data?.detail) {
                    this.setState({
                        'detail' : true
                    })
                }
                else {
                    this.setState({
                        'machine' : data,
                        'error' : null,
                        'detail' : null
                    })
                }
        })
        return false;
    }
    


    render() {
        const {machine, detail, error, status} = this.state;

        console.log(this.state);

        if (error) {
            return (
                <main>
                    <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                    <form className="search" onSubmit={this.get_data.bind(this)}>
                        <label htmlFor="factory_number" >Заводской номер:</label>
                        <input type="text" name="factory_number" />
                        <button type="submit">Поиск</button>
                    </form>
                    <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                    <div className="error">Произошла ошибка</div>
                </main>
            )
        }

        if (detail) {
            return (
                <main>
                    <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                    <form className="search" onSubmit={this.get_data.bind(this)}>
                        <label htmlFor="factory_number" >Заводской номер:</label>
                        <input type="text" name="factory_number" />
                        <button type="submit">Поиск</button>
                    </form>
                    <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                    <div className="error">К сожалению, по Вашему запросу ничего не найдено</div>
                </main>
            )
        }

        if (!status) {
            return (
                <main>
                <h2>Загружается. Подождите...</h2>
                </main>
                )
        }

        if (machine) {
            return <Machine machine = {machine} status = {status} token = {this.token} />
        }



            return (
                <main>
                    <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                    <form className="search" onSubmit={this.get_data.bind(this)}>
                        <label htmlFor="factory_number" >Заводской номер:</label>
                        <input type="text" name="factory_number" />
                        <button type="submit">Поиск</button>
                    </form>
                    {status !== 'not_auth' ? <p className="go_create" onClick = {(event) => window.location.href = "http://localhost:5000/create"}>Внести информацию по машине, ТО или рекламации</p> : <span></span>}
                </main>
            )

      
    }
}

export default Info;