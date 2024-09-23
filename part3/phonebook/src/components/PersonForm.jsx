import React from 'react'

const PersonForm = ({handleAdd, newName, handleInputName, handleInputNumber, newNumber}) => {
  return (
    <form onSubmit={handleAdd}>
    <div>
      name: <input value={newName} onChange={handleInputName} />
      number: <input value={newNumber} onChange={handleInputNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default PersonForm