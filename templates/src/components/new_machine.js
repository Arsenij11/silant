import React from "react";

class NewMachine extends React.Component {
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
        fetch(`http://127.0.0.1:8000/api/new_machine`, options).
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
        console.log(this.token)
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

                        <label htmlFor="factory_number">Зав. № машины</label>
                        <input name="factory_number" type="text" />

                        <label htmlFor="engine_number">Зав. № двигателя</label>
                        <input name="engine_number" type="text" />

                        <label htmlFor="transmission_number">Зав. № трансмиссии</label>
                        <input name="transmission_number" type="text" />

                        <label htmlFor="drive_axle_number">Зав. № ведущего моста</label>
                        <input name="drive_axle_number" type="text" />

                        <label htmlFor="steerable_bridge_number">Зав. № управляемого моста</label>
                        <input name="steerable_bridge_number" type="text" />

                        <label htmlFor="delivery_contract">Договор поставки №, дата</label>
                        <input name="delivery_contract" type="text" />

                        <label htmlFor="date_shipment">Дата отгрузки с завода</label>
                        <input name="date_shipment" type="datetime-local" />

                        <label htmlFor="customer">Грузополучатель (конечный потребитель)</label>
                        <input name="customer" type="text" />

                        <label htmlFor="delivery_address">Адрес поставки (эксплуатации)</label>
                        <input name="delivery_address" type="text" />

                        <label htmlFor="equipment">Комплектация (доп. опции)</label> 
                        <input name="equipment" type="text" />

                        <label htmlFor="client">Клиент</label>
                        <input name="client" type="text" />

                        <label htmlFor="service_company">Сервисная компания</label>
                        <input name="service_company" type="text" />

                        <hr /> 

                        <h2>Дополнительная информация</h2>

                        <label htmlFor="machine_model">Модель техники</label>
                        <input name="machine_model" type="text"  />
                        <label htmlFor="machine_model_description">Описание модели техники</label>
                        <input name="machine_model_description" type="text" />

                        <label htmlFor="engine_model">Модель двигателя</label>
                        <input name="engine_model" type="text" /> 
                        <label htmlFor="engine_model_description">Описание модели двигателя</label>
                        <input name="engine_model_description" type="text" /> 

                        <label htmlFor="transmission_model">Модель трансмиссии</label>
                        <input name="transmission_model" type="text"  />
                        <label htmlFor="transmission_model_description">Описание модели трансмиссии</label>
                        <input name="transmission_model_description" type="text" />

                        <label htmlFor="drive_axle_model">Модель ведущего моста</label>
                        <input name="drive_axle_model" type="text"  />
                        <label htmlFor="drive_axle_model_description">Описание модели ведущего моста</label>
                        <input name="drive_axle_model_description" type="text" />
                        
                        <label htmlFor="steerable_bridge_model">Модель управляемого моста</label>
                        <input name="steerable_bridge_model" type="text" />
                        <label htmlFor="steerable_bridge_model_description">Описание модели управляемого моста</label>
                        <input name="steerable_bridge_model_description" type="text" />

                        <button type="submit">Отправить</button>
                    </form>
                </main>
        )
    }
}

export default NewMachine;