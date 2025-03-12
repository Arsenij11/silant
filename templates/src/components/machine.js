import React from 'react';

class Machine extends React.Component {
    factory_number = this.props.machine.main_info.factory_number;
    access = ['Clients', 'Managers', 'Service_Company'].filter((el) => {return this.props.status === el}).length > 0;
    token = this.props.token;
    constructor (props) {
        super (props);
        this.state = {
            more_info : null,
            machine : this.props.machine,
            to: null,
            complaints : null,
            'error' : null,
            'detail' : null
        }
    }
    go_back (event) {
        this.setState({
            'more_info' : null
        })
    }

    get_TO (event) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Token ' + this.token
            },
        }
        let errors = false;
        fetch(`http://127.0.0.1:8000/api/get_to/${this.factory_number}`, options).
        catch((error) => {
            errors = true;
            console.log(error);
            this.setState({
                'error': error
            })
        }).
        then((response) => {
            if (!errors) {
                return response.json();
            }
        }).
        then((json) => {
            if (!errors) {
                const data = json;
                if (data?.detail) {
                    this.setState({
                        'detail' : true
                    })
                }
                else {
                    this.setState({
                         machine : null,
                        'to' : data.data,
                         complaints : null,
                        'error' : null,
                        'detail' : null
                    })
                }
            }
        })
    }
    get_machine() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
           
        }
        let errors = false;
        fetch(`http://127.0.0.1:8000/api/get_machine/${this.factory_number}/${this.token}`, options).
        catch((error) => {
            errors = true;
            console.log(error);
            this.setState({
                'error': error
            })
        }).
        then((response) => {
            if (!errors) {
                return response.json();
            }
        }).
        then((json) => {
            if (!errors) {
                const data = json;
                if (data?.detail) {
                    this.setState({
                        'detail' : true
                    })
                }
                else {
                    this.setState({
                        'machine' : data,
                        'to' : null,
                         complaints : null,
                        'error' : null,
                        'detail' : null
                    })
                }
            }
        })
    }
    get_complaint() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Token ' + this.token
            },
        }
        let errors = false;
        fetch(`http://127.0.0.1:8000/api/get_complaint/${this.factory_number}`, options).
        catch((error) => {
            errors = true;
            console.log(error);
            this.setState({
                'error': error
            })
        }).
        then((response) => {
            if (!errors) {
                return response.json();
            }
        }).
        then((json) => {
            if (!errors) {
                const data = json;
                if (data?.detail) {
                    this.setState({
                        'detail' : true
                    })
                }
                else {
                    this.setState({
                        'machine' : null,
                        'to' : null,
                         complaints : data.data,
                        'error' : null,
                        'detail' : null
                    })
                }
            }
        })
    }
    componentDidMount() {
        const results = document.querySelector('.results');
        if (results !== null) {
            const us = results.querySelectorAll('u');
            for (let u of us) {
                u.addEventListener('click', (event) => {
                    let ourinfo;
                    for (let i of this.props.machine.more_info) {
                        if (i.model_type === u.id) {
                            ourinfo = i;
                            break;
                        }
                    }
                    this.setState({
                        more_info : ourinfo
                    })
                })
            }
            
        }
    }

    componentDidUpdate() {
        const machine_info = document.querySelector('#machine_info');
        console.log(machine_info);
        if (machine_info !== null) {
            const us = machine_info.querySelectorAll('u');
            for (let u of us) {
                u.addEventListener('click', (event) => {
                    let ourinfo;
                    for (let i of this.state.machine.more_info) {
                        if (i.model_type === u.id) {
                            ourinfo = i;
                            break;
                        }
                    }
                    this.setState({
                        more_info : ourinfo
                    })
                })
            }
            
        }

        const to_table = document.querySelectorAll('.to_table');
        console.log(to_table);
        if (to_table !== null) {
            for (let t of to_table) {
                const u = t.querySelector('u');
                u.addEventListener('click', (event) => {
                    let ourinfo;
                    for (let to of this.state.to) {
                        if (String(to.more_info.id) === u.id) {
                            ourinfo = to.more_info;
                            break;
                        }
                    }
                    console.log(ourinfo);
                    this.setState({
                        more_info : ourinfo
                    })
                })
            }
            
        }

        const complaint_table = document.querySelectorAll('.complaint_table');
        console.log(complaint_table);
        if (complaint_table !== null) {
            for (let ct of complaint_table) {
                const us = ct.querySelectorAll('u');
                for (let u of us) {
                    u.addEventListener('click', (event) => {
                        let ourinfo;
                        for (let i of this.state.complaints) {
                            for (let m of i.more_info.other_info) {
                                if (m.directory_type === u.id && String(i.more_info.id) === u.getAttribute('name')) {
                                    ourinfo = m;
                                    break;
                                }
                            }
                        }
                        console.log(ourinfo);
                        this.setState({
                            more_info : ourinfo
                        })
                    })
                }
            }
        }
    }

    render () {
        const {more_info, machine, to, complaints, error, detail} = this.state;
            
        console.log(complaints);
        if (error) {
            return (
                <main>
                    <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                    <p className="go_back" onClick={(event) => window.location.reload()} onMouseOver={(event) =>{event.target.style.color = '#D20A11'; event.target.style.cursos = 'pointer'}} 
                        onMouseOut={(event) => {event.target.style.color = '#163E6C'; event.target.style.cursos = 'none'}}>Вернуться назад</p>
                    <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                    <div className="error">Произошла ошибка {error}</div>
                </main>
            )
        }

        if (detail) {
            return (
                <main>
                    <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                    <p className="go_back" onClick={(event) => window.location.reload()} onMouseOver={(event) =>{event.target.style.color = '#D20A11'; event.target.style.cursos = 'pointer'}} 
                         onMouseOut={(event) => {event.target.style.color = '#163E6C'; event.target.style.cursos = 'none'}}>Вернуться назад</p>
                    <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                    <div className="error">К сожалению, по Вашему запросу ничего не найдено</div>
                </main>
            )
        }

        if (more_info) {
            if (more_info?.model_type) {
                switch (more_info.model_type) {
                    case 'machine_model': 
                        more_info.model_type = 'техники';
                        break;
                    case 'engine_model': 
                        more_info.model_type = 'двигателя';
                        break;
                    case 'transmission_model': 
                        more_info.model_type = 'трансмиссии';
                        break;
                    case 'drive_axle_model': 
                        more_info.model_type = 'ведущего моста';
                        break;
                    case 'steerable_bridge_model': 
                        more_info.model_type = 'управляемого моста';
                        break;
                }
            }

            if (more_info?.directory_type) {
                switch (more_info.directory_type)  {
                    case 'refusal_node':
                        more_info.directory_type = 'об узле отказа';
                        break;
                    case 'var_remaining':
                        more_info.directory_type = 'о способе восстановления';
                        break;
                }
            }

            return (
                <main>
                    <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                    <p className="go_back" onClick={this.go_back.bind(this)}>Вернуться назад</p>
                    <div className="info_machine">Полная информация {more_info?.model_type ? <span>о модели {more_info.model_type}</span> : more_info?.directory_type ? <span>{more_info.directory_type}</span> : <span>{more_info.name}</span>} машины № {more_info.machine}</div>
                    <table className="more">
                        <thead>
                            <tr>
                                <td>Зав. № машины</td>
                                <td>Название</td>
                                <td>Описание</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{more_info.machine}</td>
                                <td>{more_info.name}</td>
                                <td>{more_info.description}</td>
                            </tr>
                        </tbody>
                    </table>
                </main>
            )
        }

        if (machine) {
            return (
            <main>
                <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                <p className="go_back" onClick={(event) => window.location.reload()}>Вернуться назад</p>
                <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                <div className="caption">Результаты запроса</div>
                <div className="type_of_information">
                    <span className="selected">Общая информация</span>
                    {this.access ? <span onClick={this.get_TO.bind(this)}>ТО</span> : <span></span>}
                    {this.access ? <span onClick={this.get_complaint.bind(this)}>Рекламации</span> : <span></span>}
                </div>
                <table className="results" id="machine_info">

                    <thead>
                        <tr>
                            <td>Зав. № машины</td>
                            <td>Модель техники</td>
                            <td>Модель двигателя</td>
                            <td>Зав. № двигателя</td>
                            <td>Модель трансмиссии</td>
                            <td>Зав. № трансмиссии</td>
                            <td>Модель ведущего моста</td>
                            <td>Зав. № ведущего моста</td>
                            <td>Модель управляемого моста</td>
                            <td>Зав. № управляемого моста</td>
                            {this.access ? <td>Договор поставки №, дата</td> : <td> - </td>}
                            {this.access ? <td>Дата отгрузки с завода</td> : <td> - </td>}
                            {this.access ? <td>Грузополучатель (конечный потребитель)</td> : <td> - </td>}
                            {this.access ? <td>Адрес поставки (эксплуатации)</td> : <td> - </td>}
                            {this.access ? <td>Комплектация (доп. опции)</td> : <td> - </td>}
                            {this.access ? <td>Клиент</td> : <td> - </td>}
                            {this.access ? <td>Сервисная компания</td> : <td> - </td>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id = "factory_number">{machine.main_info.factory_number}</td>
                            <td><u id = "machine_model">{machine.main_info.machine_model}</u></td>
                            <td><u id = "engine_model">{machine.main_info.engine_model}</u></td>
                            <td>{machine.main_info.engine_number}</td>
                            <td><u id = "transmission_model">{machine.main_info.transmission_model}</u></td>
                            <td>{machine.main_info.transmission_number}</td>
                            <td><u id = "drive_axle_model">{machine.main_info.drive_axle_model}</u></td>
                            <td>{machine.main_info.drive_axle_number}</td>
                            <td><u id = "steerable_bridge_model">{machine.main_info.steerable_bridge_model}</u></td>
                            <td>{machine.main_info.steerable_bridge_number}</td>
                            {this.access ? <td>{machine.main_info.delivery_contract}</td> : <td> - </td>}
                            {this.access ? <td>{machine.main_info.date_shipment}</td> : <td> - </td>}
                            {this.access ? <td>{machine.main_info.customer}</td> : <td> - </td>}
                            {this.access ? <td>{machine.main_info.delivery_address}</td> : <td> - </td>}
                            {this.access ? <td>{machine.main_info.equipment}</td> : <td> - </td>}
                            {this.access ? <td>{machine.main_info.client}</td> : <td> - </td>}
                            {this.access ? <td>{machine.main_info.service_company}</td> : <td> - </td>}
                        </tr>
                    </tbody>
                </table>
            </main>
            )
        }
        else if (to && this.access) {
            const data = [];
            for (let t of to) {
                data.push(
                <table className="results to_table" key={t.main_info.id}>
                    <thead>
                        <tr>
                            <td>Зав. № машины</td>
                            <td>Вид ТО</td>
                            <td>Дата проведения ТО</td>
                            <td>Наработка, м/час</td>
                            <td>№ заказ-наряда</td>
                            <td>Дата заказ-наряда</td>
                            <td>Организация, проводившая ТО</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{t.main_info.machine}</td>
                            <td><u id = {t.main_info.id}>{t.main_info.type_to}</u></td>
                            <td>{t.main_info.date_TO}</td>
                            <td>{t.main_info.operating_time}</td>
                            <td>{t.main_info.order_number}</td>
                            <td>{t.main_info.date_order}</td>
                            <td>{t.main_info.service_company}</td>
                        </tr>
                    </tbody>
                </table>
                )
            }

            return (<main>
                        <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                        <p className="go_back" onClick={(event) => window.location.reload()}>Вернуться назад</p>
                        <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                        <div className="caption">Результаты запроса</div>
                        <div className="type_of_information">
                            <span onClick={this.get_machine.bind(this)}>Общая информация</span>
                            <span className="selected">ТО</span>
                            <span onClick={this.get_complaint.bind(this)}>Рекламации</span>
                        </div>

                        {data}
                    </main>)
        }
        else if (complaints && this.access){
            const data = [];
            for (let c of complaints) {
                data.push(
                <table className="results complaint_table" key={c.main_info.id}>
                    <thead>
                        <tr>
                        <td>Зав. № машины</td>
                            <td>Дата отказа</td>
                            <td>Наработка, м/час</td>
                            <td>Узел отказа</td>
                            <td>Описание отказа</td>
                            <td>Способ восстановления</td>
                            <td>Используемые запасные части</td>
                            <td>Дата восстановления</td>
                            <td>Время простоя техники</td>
                            <td>Сервисная компания</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{c.main_info.machine}</td>
                            <td>{c.main_info.date_order}</td>
                            <td>{c.main_info.operating_time}</td>
                            <td><u id = "refusal_node" name = {c.main_info.id}>{c.main_info.refusal_node}</u></td>
                            <td>{c.main_info.refusal_description}</td>
                            <td><u id = "var_remaining" name = {c.main_info.id}>{c.main_info.var_remaining}</u></td>
                            <td>{c.main_info.using_extra_components}</td>
                            <td>{c.main_info.date_remaining}</td>
                            <td>{c.main_info.downtime}</td>
                            <td>{c.main_info.service_company}</td>
                        </tr>
                    </tbody>
                </table>
                )
            }
            return (
            <main>
                <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                <p className="go_back" onClick={(event) => window.location.reload()}>Вернуться назад</p>
                <div className="info_machine">Информация о комплектации и технических характеристик Вашей техники</div>
                <div className="caption">Результаты запроса</div>
                <div className="type_of_information">
                    <span onClick={this.get_machine.bind(this)}>Общая информация</span>
                    <span onClick={this.get_TO.bind(this)}>ТО</span>
                    <span className="selected">Рекламации</span>
                </div>
                {data}
            </main>
            )
        }
        else {
            <main>
                <h2>Проверьте комплетацию и технические характеристики техники Силант</h2>
                <p className="go_back" onClick={(event) => window.location.reload()}>Вернуться назад</p>
                <h2>Произошла ошибка</h2>
            </main>
        }
    }
    
}

export default Machine;