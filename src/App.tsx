function App() {
  return (
    <input
      type="file"
      capture="environment"
      accept="image/*"
      multiple={false}
      onChange={(e) => {
        console.log(e.target.files);
      }}
    />
  );
}

export default App;
