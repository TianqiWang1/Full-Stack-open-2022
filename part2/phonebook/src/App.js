import React from 'react';
import personService from './services/persons'
import { useEffect, useState } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"




const App = () => {


  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({name:'', number:''})
  const [filter, setFilter] = useState("")
  const [personsToShow, setPersonsToShow] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=> {
    personService.getAll().then(response => {
      console.log('promise fulfilled')
      setPersons(response)
      setPersonsToShow(response)
    })
  },[])


  useEffect(() => {
    const timer = setTimeout(() => {setErrorMessage(null)}, 1000)
    return () => {clearTimeout(timer)}
  },[errorMessage]);


  const addPerson = (event) => {
    event.preventDefault()
    console.log(newPerson.name)
    console.log(newPerson.number)
    const person_names = persons.map(person => person.name)
    const newObject = {
      name: newPerson.name,
      number: newPerson.number,
      id: persons.length+1
    }

    if (person_names.includes(newPerson.name)) {
      if (window.confirm(`${newPerson.name} is already added to the phone book, replace the old phone number with a new one?`)) {
        const current_person = persons.filter(person => person.name === newPerson.name)
        console.log(current_person)
        personService.update(current_person[0].id, newObject).then((response) => {
          const updatedPersons = persons.map(person => person.id !== response.id? person:response)
          setPersons(updatedPersons)
          setPersonsToShow(updatedPersons)
          setErrorMessage(`updated ${newPerson.name}`)
        })
        .catch(error => {setErrorMessage(`failed to upated person ${newPerson.name}`)})
      }
    }

    else {
      personService.create(newObject).then(response =>{
        setPersons(persons.concat(response))
        setPersonsToShow(persons.concat(response))
        setNewPerson({name:'',number:''})
        setErrorMessage(`Added ${newObject.name} to the phonebook`)
      }).catch(error => setErrorMessage(`failed to add person ${newObject.name}`))
    }

  }

  const handlePersonChange = (event) => {
    //console.log(event.target.value)
    setNewPerson({...newPerson, [event.target.name]: event.target.value})
  }

  const filterByName = (event) => {
    const search = event.target.value
    setFilter(search)
    setPersonsToShow(persons.filter(person => person.name.toLowerCase().includes(search)))

  }

  const deletePerson= (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(response => {
      const newPersons = persons.filter(person => person.id !== id)
      setPersons(newPersons)
      setPersonsToShow(newPersons)
      setErrorMessage(`Information of ${name} has been removed from the server.`)
      })
    }
  }

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter filter={filter} filterByName={filterByName}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} handlePersonChange={handlePersonChange} newPerson={newPerson}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App;