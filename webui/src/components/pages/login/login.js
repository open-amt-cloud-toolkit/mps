/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { AjaxError, Btn, FormSection, SectionHeader, FormControl, FormGroup } from 'components/shared';
import './login.scss';
import { LinkedComponent, Validator } from 'utilities';
import LogoPath from 'assets/images/react-logo.png';
import { Redirect } from 'react-router-dom'

export class Login extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    }
    this.userNameLink = this.linkTo('userName')
      .check(Validator.notEmpty, () => 'Please enter your user name');

    this.passwordLink = this.linkTo('password')
      .check(Validator.notEmpty, () => 'Please enter your password');
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.isLoggedIn !== prevProps.isLoggedIn) {
      this.props.history.push('/landing');
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.userLogin(this.state);
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  formIsValid = () => {
    return [this.userNameLink, this.passwordLink].every(link => !link.error)
  }

  clearAll = () => {
    this.setState({
      userName: '',
      password: ''
    })
  }

  render() {
    const { t, error, isLoggedIn } = this.props;
    let { userName, password } = this.state;
    return <React.Fragment>
      {isLoggedIn && <Redirect to='/landing' />}
      <form className="login-form-container" onSubmit={this.handleSubmit}>
        <div className="logo-container">
          <img src={LogoPath} alt="not avaliable" />
        </div>
        {error &&<AjaxError error={error} t={t}/>}
        <FormSection>
        
          <SectionHeader>{t('user.login.heading')}</SectionHeader>
          <FormGroup>
            <FormControl id="userName" type="text" className="long login-input" link={this.userNameLink} placeholder={t('user.login.userName')} value={userName} onChange={this.handleChange} />
          </FormGroup>
          <FormGroup>
            <FormControl
              id='password'
              type="password"
              className="long login-input"
              placeholder={t('user.login.password')}
              link={this.passwordLink}
              value={password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup className='btn-display'>
            <Btn className="login-btn" primary={true} disabled={!this.formIsValid()} type='submit' >{t('user.login.signIn')} </Btn>
            <Btn className='login-btn' primary={true} onClick={this.clearAll}>
              {t('user.login.cancel')}
            </Btn>
          </FormGroup>
        </FormSection></form>
    </React.Fragment>
  }
}
