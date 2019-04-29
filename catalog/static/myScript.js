ReactDOM.render(<h1>Hello world!</h1>, document.getElementById("table"));
var Table;

function makeTable(toPoint) {
  fetch(toPoint)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function(data) {
        console.log(data);
        if (toPoint === 'api/getUsers') {
          Table = getTableUser(data);
          ReactDOM.render(Table, document.getElementById("table"));
        }
        if (toPoint === 'api/getGroups') {
          Table = getTableGroup(data);
          ReactDOM.render(Table, document.getElementById("table"));
        }
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function getTableUser(data) {
  console.log(data);
  return(
    <div>
      <div>
        <button onClick={makeFormUser}>Add User</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Created</th><th>Group</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {data.map(el => (
            <tr>
              {Object.entries(el.fields).map(el => <td>{el[1]}</td>)}<td><button name={el.fields.name}>Edit</button><button name={el.fields.name}>Delete</button></td>
            </tr>
              ))}
        </tbody>
    </table>
  </div>
  )
}

function getTableGroup(data) {
  console.log(data);
  var count = 1;
  return(
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {data.map(el => (
            <tr>
              <td>{count++}</td>{Object.entries(el.fields).map(el => <td>{el[1]}</td>)}<td>Hello world!</td>
            </tr>
              ))}
        </tbody>
    </table>
  </div>
  )
}


function makeFormUser() {
  ReactDOM.render(<FormUser />, document.getElementById("forForm"));
}

class FormUser extends React.Component {
  constructor() {
    super();
    this.state = {

        name: "",
        select: "",

      data: [],
    };
    this.submit = this.submit.bind(this);
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleSelectChange = (event) => {
    this.setState({ select: event.target.value });
  };

  componentDidMount() {
    fetch('api/getGroups')
      .then(response => {
        if (response.status !== 200) {
          console.log("Something went wrong");
          return;
        }
        return response.json();
      })
      .then(data => this.setState({ data: data }));
  }

  submit() {

    let userData = {'name':this.state.name, 'select':this.state.select}
    console.log(JSON.stringify(userData));
    if (userData.name === "" || userData.select === "") {
      alert("Enter login and group!")
      return
    }
    fetch('api/addUser',{
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(response => {
        return response.json() }).then(data => {
        if (data.status == "bad") {
          alert("Something went wrong");
          return;
        }
        if (data.status == "good") {
          closeForm();
          makeTable('api/getUsers');
      }})

  }

  render() {
    return (
      <div className="modalbackground">
      <div className="formuser">
        <h1>Add user.</h1>
        <label>Name: <input id="formElement" type="text" onChange={this.handleNameChange}/></label><br />
        <label>Group: <select id="formElement" onChange={this.handleSelectChange}><option selected disabled>Select a group</option>{this.state.data.map(el => (<option>{el.fields.name}</option>))}</select></label><br />
        <button id="buttonForm" onClick={this.submit}>Add.</button>
        <button id="buttonForm" onClick={closeForm}>Close.</button>
      </div>
      </div>
    );
  }
}
function closeForm() {
  ReactDOM.render(null, document.getElementById("forForm"));
}
