import React from 'react';
import { nanoid } from 'nanoid';
import Form from './Form/form';
import Filter from './Filter/filter';
import ContactList from './ContactList/contactList';
import { Section } from './App.styled';

const LS_KEY = 'contacts';

export class App extends React.Component {
  state = {
    contacts: [],
    filters: '',
  };

  formSubmitHandler = data => {
    const { name, number } = data;

    this.addContacts(name, number);
  };

  addContacts = (name, number) => {
    const newContact = {
      id: nanoid(),
      name: name,
      number: number,
    };

    const isContactExist = this.state.contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (isContactExist) {
      alert(`${name} is already in contacts.`);
      return;
    }

    this.setState(prevState => ({
      contacts: [newContact, ...prevState.contacts],
    }));
  };

  handleChangeFilter = e => {
    this.setState({ filters: e.currentTarget.value });
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  componentDidMount() {
    let contactList = JSON.parse(localStorage.getItem(LS_KEY));
    this.setState({ contacts: contactList });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filters, contacts } = this.state;
    const normalazedFilter = filters.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalazedFilter)
    );

    return (
      <Section>
        <h1>Phonebook</h1>
        <Form onSubmit={this.formSubmitHandler} />

        <h2>Contacts</h2>
        <Filter value={filters} onChange={this.handleChangeFilter} />
        <ContactList
          filteredContacts={filteredContacts}
          onDeleteContact={this.deleteContact}
        />
      </Section>
    );
  }
}
