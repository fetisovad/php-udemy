import React, {Component} from "react";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pass: ''
        }
    }


    onPasswordChange(e) {
        this.setState({
            pass: e.target.value
        })
    }

    render() {
        const {pass} = this.state;
        const {login, loginError, loginLengthError} = this.props;

        let renderLogError, renderLengthError;

        loginError ? renderLogError = <span className='login-error'>Введен неверный пароль</span> : null
        loginLengthError ? renderLengthError = <span className='login-error'>Пароль должен быть длиннее 5 символов</span> : null

        return (
            <div className='login-container'>
                <div className="login">
                    <h2 className='uk-modal-title uk-text-center'>Вход</h2>
                    <div className='uk-margin-top uk-text-lead'>Пароль:</div>
                    <input type="password" className='uk-input uk-margin-top'
                        name='' id='' placeholder='Пароль' value={pass} onChange={(e) => this.onPasswordChange(e)}
                    />
                    {renderLogError}
                    {renderLengthError}
                    <button
                        className='uk-button uk-button-primary uk-margin-top'
                        type='button'
                        onClick={() => login(pass)}
                    >Вход</button>
                </div>
            </div>
        )
    }
}