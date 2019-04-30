ReactDOM.render(<h1>Hello world!</h1>, document.getElementById("table"));
var Table;
var btnuser = document.getElementById("navToUsers");
var btngroup = document.getElementById("navToGroups");

function ID() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

btnuser.addEventListener("click", function() {
  this.classList.add("active");
  btngroup.classList.remove("active");
});

btngroup.addEventListener("click", function() {
  this.classList.add("active");
  btnuser.classList.remove("active");
});

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
        <button className='mainButton' onClick={makeFormUser}>Add User</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Created</th><th>Group</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {data.map(el => (
            <tr key={ID()}>
              {Object.entries(el.fields).map(el => <td key={ID()}>{el[1]}</td>)}<td><button name={el.fields.name} value={el.fields.group} onClick={makeFormUserEdit} className='editButton'>Edit</button><button name={el.fields.name} onClick={userDelete} className='deleteButton'>Delete</button></td>
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
      <div>
        <button className='mainButton' onClick={makeFormGroup}>Add Group</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {data.map(el => (
            <tr key={ID()}>
              <td>{count++}</td>{Object.entries(el.fields).map(el => <td key={ID()}>{el[1]}</td>)}<td><button name={el.fields.name} onClick={makeFormGroupEdit} className='editButton'>Edit</button><button name={el.fields.name} onClick={groupDelete} className='deleteButton'>Delete</button></td>
            </tr>
              ))}
        </tbody>
    </table>
  </div>
  )
}

function makeFormGroup() {
  ReactDOM.render(<FormGroup />, document.getElementById("forForm"));
}

function makeFormUser() {
  ReactDOM.render(<FormUser />, document.getElementById("forForm"));
}

function makeFormUserEdit(e) {
  ReactDOM.render(<FormUser oldname={e.target.name} oldselect={e.target.value} isEdit={true} />, document.getElementById("forForm"));
}

function makeFormGroupEdit(e) {
  ReactDOM.render(<FormGroup oldname={e.target.name} isEdit={true} />, document.getElementById("forForm"));
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
      .then(data => this.setState({ data: data, select: data[0].fields.name }));
  }

  submit() {
    if (this.props.isEdit===true) {
      var userData = {'name':this.state.name, 'oldname':this.props.oldname, 'select':this.state.select, 'oldselect':this.props.oldselect}
      var toPoint = 'api/editUser';
    }
    else {
      var userData = {'name':this.state.name, 'select':this.state.select}
      var toPoint = 'api/addUser';
    }
    console.log(JSON.stringify(userData));
    if (userData.name === "" || userData.select === "") {
      alert("Enter login and group!")
      return
    }
    fetch(toPoint,{
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
        <h1>{this.props.isEdit ? 'Edit user'+' '+this.props.oldname : 'Add user'}.</h1>
        <label htmlFor="formElementName">{this.props.isEdit ? 'New name: ' : 'Name: '}</label><br />
        <input id="formElementName" type="text" onChange={this.handleNameChange}/><br />
        <label htmlFor="formElementDescription">{this.props.isEdit ? 'New group: ' : 'Group: '}</label><br />
        <select id="formElementDescription" onChange={this.handleSelectChange}>{this.state.data.map(el => (<option>{el.fields.name}</option>))}</select><br />
        <button id="buttonForm" className='editButtonForm' onClick={this.submit}>Add.</button>
        <button id="buttonForm" className='deleteButtonForm' onClick={closeForm}>Close.</button>
      </div>
      </div>
    );
  }
}

class FormGroup extends React.Component {
  constructor() {
    super();
    this.state = {
        name: "",
        description: "",
    };
    this.submit = this.submit.bind(this);
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };
  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  submit() {
    if (this.props.isEdit===true) {
      var userData = {'name':this.state.name, 'oldname':this.props.oldname, 'description':this.state.description}
      var toPoint = 'api/editGroup';
    }
    else {
      var userData = {'name':this.state.name, 'description':this.state.description}
      var toPoint = 'api/addGroup';
    }
    console.log(JSON.stringify(userData));
    if (userData.name === "" || userData.description === "") {
      alert("Enter login and description!")
      return
    }
    fetch(toPoint,{
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
          makeTable('api/getGroups');
      }})
  }

  render() {
    return (
      <div className="modalbackground">
      <div className="formuser">
        <h1>{this.props.isEdit ? 'Edit group'+' '+this.props.oldname : 'Add group'}.</h1>
        <label htmlFor="formElementName">{this.props.isEdit ? 'New name: ' : 'Name: '}</label><br />
        <input id="formElementName" type="text" onChange={this.handleNameChange}/><br />
        <label htmlFor="formElementDescription">{this.props.isEdit ? 'New description: ' : 'Description: '}</label><br />
        <textarea id="formElementDescription" onChange={this.handleDescriptionChange} rows="4" cols="40" maxLength="150"></textarea><br />
        <button id="buttonForm" className='editButtonForm' onClick={this.submit}>Add.</button>
        <button id="buttonForm" className='deleteButtonForm' onClick={closeForm}>Close.</button>
      </div>
      </div>
    );
  }
}

function closeForm() {
  ReactDOM.render(null, document.getElementById("forForm"));
}

function userDelete(e) {
  if (confirm("Delete user?")) {
    fetch('api/deleteUser',{
        method: "POST",
        body: JSON.stringify({'name':e.target.name}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
        .then(response => {return response.json() })
        .then(data => {if (data.status == "bad") {
          alert("Something went wrong");
          return;
        }
        if (data.status == "good") {
          makeTable('api/getUsers');
      }})
  }
  else {
    return
  }
}

function groupDelete(e) {
  if (confirm("Delete group?")) {
    fetch('api/deleteGroup',{
        method: "POST",
        body: JSON.stringify({'name':e.target.name}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
        .then(response => {return response.json() })
        .then(data => {if (data.status == "bad") {
          alert("You can not delete a group that has users!");
          return;
        }
        if (data.status == "good") {
          makeTable('api/getGroups');
      }})
  }
  else {
    return
  }
}
