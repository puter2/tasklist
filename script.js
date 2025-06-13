const apikey = '';
const apihost = 'https://todo-api.coderslab.pl';


function apiListTasks() {
  return fetch(
    apihost + '/api/tasks',
    {
      headers: { Authorization: apikey }
    }
  ).then(
    function(resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  )
}

function apiListOperations(task_data){
  return fetch(apihost + `/api/tasks/${task_data.id}/operations`,{
      headers: { Authorization: apikey }
    })
  .then(function(resp){
    if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  )
}

function createTask(task_data){
  let section = document.createElement('section');
  console.log('card mt-5 shadow-sm'.split(' '))
  section.className='card mt-5 shadow-sm';

  document.querySelector('#app').appendChild(section);
  let task_header = document.createElement('div');
  task_header.className='card-header d-flex justify-content-between align-items-center';
  section.appendChild(task_header);
  console.log('dodaje'+task_data)
  addTitleAndDesc(task_header,task_data);
  addButtons(task_header,task_data)
  //add list
  addList(section, task_data)
  .then(function(){
    //using promise in order to add form after list is added
    if(task_data.status =='open'){
      addForm(section)
    }
  })
}

//TODO: add time formatting
function addList(element, task_data){
  //returning promise in order to keep correct order of elements
  return apiListOperations(task_data)
  .then(function(operations){
    if(operations == undefined || operations.error){
    console.log(operations)
    return
    }
    console.log('a')
    console.log(operations)
    let ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    operations.data.forEach(operation=>{
      let li = document.createElement('li');
      li.classList = 'list-group-item d-flex justify-content-between align-items-center';
      let op_container = document.createElement('div');
      op_container.innerText = operation.description;
      let req_time = document.createElement('span');
      req_time.className = 'badge badge-success badge-pill ml-2';
      req_time.innerText = operation.timeSpent;
      op_container.appendChild(req_time);
      li.appendChild(op_container);
      addButtons(li,task_data);
      ul.appendChild(li)
    })
    console.log('dodaje liste')
    element.appendChild(ul);
    })
}

//add button functionality
function addForm(element){
  let form_area = document.createElement('div');
  form_area.className = 'card-body';
  let form = document.createElement('form');
  let form_body = document.createElement('div');
  form_body.className = 'input-group';

  let text_input = document.createElement('input');
  text_input.type = 'text';
  text_input.placeholder = 'Operation description'
  text_input.className = 'form-control';
  text_input.minLength = '5';
  form_body.appendChild(text_input);

  let button_area = document.createElement('div');
  button_area.className = 'input-group-append';
  let button = document.createElement('button');
  button.className = 'btn btn-info';
  button.innerText = 'Add';
  button_area.appendChild(button);
  form_body.appendChild(button_area);
  form.appendChild(form_body);
  form_area.appendChild(form);
  console.log('dodaje form')
  element.appendChild(form_area);
}

function addTitleAndDesc(element,task_data){
  let title = document.createElement('div');
  let h5 = document.createElement('h5');
  h5.innerText = task_data.title;
  let h6 = document.createElement('h6');
  h6.className = 'card-subtitle text-muted';
  h6.innerText = task_data.description;
  title.appendChild(h5);
  title.appendChild(h6);
  element.appendChild(title, task_data.open);
}

function apiDeleteTask(id){
  return fetch(apihost + `/api/tasks/${id}`,{
      method: 'DELETE',
      headers: { Authorization: apikey }
    })
  .then(function(resp){
    return resp;
  });
}

function deleteTask(event, task_data){
  console.log(event.target)
  let current_task = event.target.parentElement.parentElement.parentElement;
  
  apiDeleteTask(task_data.id)
  .then(function(resp){
    if(resp.ok){
      current_task.remove();
    }
  })
}

function apiFinishTask(task_data){
  let req_body = {title: task_data.title, description: task_data.description, status: "closed"};
  return fetch(apihost + `/api/tasks/${task_data.id}`,{
    method: 'PUT',
    headers: { Authorization: apikey, 'Content-Type': 'application/json'  },
    body: JSON.stringify(req_body)})
  .then(function(resp){
    console.log(resp)
    return resp;
  })
}

function finishTask(event, task_data){
  let form = event.target.parentElement.parentElement.parentElement.querySelector('.card-body');
  let list_buttons = event.target.parentElement.parentElement.parentElement.querySelectorAll('li')
  apiFinishTask(task_data)
  .then(function(resp){
    console.log(resp)
    if(resp.ok){
      form.remove();
      console.log(list_buttons)
      ////////////////////////////
      //NOT TESTED
      if(list_buttons.length>0){
      list_buttons.forEach(li=>{
          //remove buttons
          li.lastElementChild.remove()
        })
      }
      ////////////////////////////
        console.log('finishing task')
        event.target.remove();
        
    }
  })
}


// TODO: add button functionality: finish task, delete task, add time, delete op
function addButtons(element ,task_data){
  let button_area = document.createElement('div');
  let delete_button = document.createElement('button');
  delete_button.className = 'btn btn-outline-danger btn-sm ml-2';
  delete_button.innerText = 'Delete';
  console.log('task_data: ',task_data)
  switch(task_data.status){
    case 'open' : {
      let finish = document.createElement('button');
      finish.className = 'btn btn-dark btn-sm';
      finish.innerText = 'Finish';
      finish.addEventListener('click', (event)=>{finishTask(event, task_data)})
      button_area.appendChild(finish);
      delete_button.addEventListener('click',(event) =>{ deleteTask(event, task_data)});
      break;
    }
    case 'closed' : {
      delete_button.addEventListener('click',(event) =>{ deleteTask(event, task_data)});
      break;
    }
    default : { //default case is used when adding operations, not new task
      let plus15 = document.createElement('button');
      let plus1h = document.createElement('button');
      plus15.className = 'btn btn-outline-success btn-sm mr-2';
      plus1h.className = 'btn btn-outline-success btn-sm mr-2';
      plus15.innerText = '+15m';
      plus1h.innerText = '+1h';
      button_area.appendChild(plus15);
      button_area.appendChild(plus1h);
      break;
    }
  }
  button_area.appendChild(delete_button);

  element.appendChild(button_area);
}

function apiAddTask(new_task){
  return fetch(apihost + '/api/tasks',{
    method: 'POST',
    headers: { Authorization: apikey, 'Content-Type': 'application/json'  },
    body: JSON.stringify(new_task)
  });
}

document.addEventListener('DOMContentLoaded', function() {
    apiListTasks().then(
  function(response) {
    console.log('Odpowiedź z serwera to:', response);
    response.data.forEach(task=>createTask(task));
    //createTask(response.data[0])
  }
);
  let add_new_task_form = this.querySelector('.js-task-adding-form');
  add_new_task_form.addEventListener('submit', function(e){
    e.preventDefault();
    let title = this.elements.title.value;
    let description = this.elements.description.value;
    console.log(title, description)
    let new_task = {
      title: title,
      description: description,
      status: 'open'
    };
    console.log(new_task.title)
    apiAddTask(new_task)
    .then(function(resp){
      console.log(resp);
      if(resp.ok){
        return apiListTasks();
      }
    })
    .then(function(resp){
      createTask(resp.data[resp.data.length-1])
    })
  })
});