import React from "react";
import NewMachine from "./new_machine";
import NewTO from "./new_to";
import NewComplaint from "./new_complaint";

class Create extends React.Component {
    token;
    constructor(props) {
        if (document.cookie.match(/(token_silant)=(.+);/) === null) {
            window.location.href = 'http://localhost:5000';
        }
        super(props);
        this.state = {
            machine : null,
            to : null,
            complaint : null,
            status : null,
            error : null
        }
    }
    componentDidMount() {
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
    render () {
        const {machine, to, complaint, status, error} = this.state;
        

        if (error) {
            return (<main>
                <h1>Произошла ошибка! Попробуйте перезагрузить страницу</h1>
            </main>)
        }

        if (!status) {
            return( <main>
                <h1>Загружается... Ожидайте...</h1>
            </main>)
        }

        if (machine && status === 'Managers') {
            return <NewMachine token = {this.token} />;
        }
        else if (to) {
            return <NewTO token = {this.token} />;
        }
        else if (complaint && ['Managers', 'Service_Company'].filter((el) => el === status).length > 0) {
            return <NewComplaint token = {this.token} />;
        }
     
        return (
            <main>
                {status === 'Managers' ? <p className="go_create" onClick = {(event) => this.setState({machine : true})}>Внести инфромацию о машине</p> : <p></p>}
                <p className="go_create" onClick = {(event) => this.setState({to : true})}>Внести инфромацию о ТО</p>
                {
                    ['Managers', 'Service_Company'].filter((el) => el === status).length > 0 ? 
                    <p className="go_create" onClick = {(event) => this.setState({complaint : true})}>Внести инфромацию о рекламации</p> :
                    <p></p>
                }

            </main>
        )
    }
}

export default Create;