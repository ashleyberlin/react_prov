import React, { Component } from "react";

import './App.css';

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const numberRegex = RegExp(/^0[0-9].*$/);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;
  //validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

class App extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      personalNumber:"",
      phoneNumber: null,
      email: null,
      country: null,
      formErrors: {
        personalNumber: "",
        phoneNumber: "",
        email: "",
        country: ""
      },
      countries:[]
    };
  }


  handleSubmit = e => {

    if (formValid(this.state)) {
      console.log(`
        --SUCCESS--
        Personal number: ${this.state.personalNumber}
        Phone number: ${this.state.phoneNumber}
        Email: ${this.state.email}
        Country: ${this.state.country}
      `);
      localStorage.clear();
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  }

  //Validating the values on the inputs on change and setting state
  handleChange = e => {
    e.preventDefault();
 
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "personalNumber":
        formErrors.personalNumber =
          value.length !== 10 ? "Invalid Personal Number" : "";
        break;
      case "phoneNumber":
        formErrors.phoneNumber =
        !numberRegex.test(value) || value.length < 5 || value.length > 10  ? "Invalid Phone Number" : "";
        break;
      case "email":
        formErrors.email = 
        emailRegex.test(value) || value.length === 0 ? "" : "invalid email address";
      break;
      // no default
    }
    this.setState({ formErrors, [name]: value }, () => this.setLocalStorage());//Set state and local storage
  }

  setLocalStorage(){
    
    const { personalNumber, phoneNumber, email, country, formErrors} = this.state;
    localStorage.setItem('personalNumber', personalNumber);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('email', email);
    localStorage.setItem('country', country);
    localStorage.setItem('formErrors', JSON.stringify(formErrors));
    /*localStorage.setItem('savedState', JSON.stringify(this.state));*/
  }
  //Fetching the countries from the API and displaying them as options
  componentDidMount() {
    fetch('https://restcountries.eu/rest/v2/all')
    .then(res => res.json())
    .then((data) => {
      let countries = data.map((country, index) => {
        return <option key={index} > {country.name} </option>})
        this.setState({countries:countries}, () => console.log(this.state) )
    })
    .catch(console.log);

    //Getting the local storage and displaying it in the input field 
    const personalNumber = localStorage.getItem('personalNumber');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const email = localStorage.getItem('email');
    const country = localStorage.getItem('country');
    this.setState({ personalNumber, phoneNumber, country, email});
    /*let formErrors =JSON.parse(localStorage.getItem('formErrors'));
    formErrors = { ...this.state.formErrors }
    this.setState({formErrors})*/
  }

  render() {
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className='form-wrapper'>
          <h1>Create Account</h1>
            <form onSubmit={this.handleSubmit} noValidate>
                <div className='formfield'>
                  <label htmlFor='personalNumber'>Personal Number</label>
                  <input 
                  value= {this.state.personalNumber || ''}
                  type='number' 
                  name='personalNumber'
                  className='{formErrors.personalNumber.length > 0 ? "error" : null}' 
                  placeholder='YYMMDDXXXX' 
                  onChange={this.handleChange}
                  noValidate
                  />
                  {formErrors.personalNumber.length > 0 && (
                  <span className="errorMessage">{formErrors.personalNumber}</span>
                  )}
                </div>
                <div className='formfield'>
                  <label htmlFor='phoneNumber'>Phone Number</label>
                  <input 
                  value= {this.state.phoneNumber || ''}
                  type='number'
                  name='phoneNumber' 
                  className='{formErrors.phoneNumber.length > 0 ? "error" : null}' 
                  placeholder='0XXXXXXXX' 
                  onChange={this.handleChange}
                  noValidate
                  />
                  {formErrors.phoneNumber.length > 0 && (
                  <span className="errorMessage">{formErrors.phoneNumber}</span>
                  )}
                </div>
                <div className='formfield'>
                  <label htmlFor='emailAddress'>Email Address</label>
                  <input 
                  value= {this.state.email || ''}
                  type='email' 
                  name= 'email'
                  className='{formErrors.email.length > 0 ? "error" : null}' 
                  placeholder='email@address.com' 
                  onChange={this.handleChange}
                  noValidate
                  />
                  {formErrors.email.length > 0 && (
                  <span className="errorMessage">{formErrors.email}</span>
                  )}
                </div>
                <div className='formfield'>
                  <label htmlFor='country'>Country</label>
                  <select 
                  id='country' 
                  name='country'
                  value= {this.state.country || ''}
                  onChange={this.handleChange}
                  placeholder='select a country'>
                  {this.state.countries}
                  </select>
                </div>
                <div className ='createAccount'>
                  <button type='submit'>Create Account</button>
                </div>
              </form>
        </div>
      </div>
    );
  }
}

export default App;
