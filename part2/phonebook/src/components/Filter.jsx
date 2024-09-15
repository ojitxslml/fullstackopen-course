const Filter = ({searchText, handleInputSearch}) => {
  return (
    <p>filter shown with <input value={searchText} onChange={handleInputSearch} /></p>
  )
}

export default Filter