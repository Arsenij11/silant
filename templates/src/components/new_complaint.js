import React from "react";

class NewComplaint extends React.Component {
    token = this.props.token;
    constructor(props) {
        super(props);
        this.state = {
            error : null,
            success : null
        }
    }
    checkdata (event) {
        event.preventDefault();
        const form = event.target;
        const inputs = form.querySelectorAll('input');
        const data = {};
        for (let i of inputs) {
            data[i.getAttribute('name')] = i.value;
        }
        console.log(data);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Token ' + this.token
            },
            body : JSON.stringify(data)
        }
        fetch(`http://127.0.0.1:8000/api/new_complaint`, options).
        then((response) => {
            return response.json();
        }).
        then((json) => {
            console.log(json);
            if (json['detail'] !== 'ok') {
                this.setState({
                    error : true
                })
            }
            else {
                this.setState({
                    success : true,
                    error : null
                })
            }
        })

        return false;
    }
    render () {
        const {error, success} = this.state;
        if (success) {
            return (
                <main>
                    <h1>Данные были успешно внесены!</h1>
                    <p className="go_back" onClick={(event) => this.setState({success : null})}>Вернуться назад</p>
                </main>
            )
        }
        return (
            <main>
                    <p className="go_back" onClick={(event) => window.location.reload()}>Вернуться назад</p>
                    <form className="new_info" onSubmit={this.checkdata.bind(this)}>
                        <h2>Основная информация</h2>
                        {error ? <h1 className="error_request">Произошла ошибка! Проверьте корректность отправлемых данных!</h1> : <p></p>}

                        <label htmlFor="machine">Зав. № машины</label>
                        <input name="machine" type="text" />

                        <label htmlFor="operating_time">Наработка, м/час</label>
                        <input name="operating_time" type="number" />
                      
                        <label htmlFor="refusal_description">Описание отказа</label>
                        <input name="refusal_description" type="text" />

                        <label htmlFor="using_extra_components">Используемые запасные части</label>
                        <input name="using_extra_components" type="text" />

                        <label htmlFor="date_remaining">Дата восстановления</label>
                        <input name="date_remaining" type="datetime-local" />

                        <label htmlFor="downtime">Время простоя техники</label>
                        <input name="downtime" type="text" />

                        <label htmlFor="service_company">Сервисная компания</label>
                        <input name="service_company" type="text" />
                        <hr /> 

                        <h2>Дополнительная информация</h2>

                        <label htmlFor="refusal_node">Узел отказа</label>
                        <input name="refusal_node" type="text" />
                        <label htmlFor="refusal_node_description">Подробное описание узла отказа</label>
                        <input name="refusal_node_description" type="text" />


                        <label htmlFor="var_remaining">Способ восстановления</label>
                        <input name="var_remaining" type="text" />
                        <label htmlFor="var_remaining_description">Подробное описание способа восстановления</label>
                        <input name="var_remaining_description" type="text" />

                        <button type="submit">Отправить</button>
                    </form>
                </main>
        )
    }
}

export default NewComplaint;