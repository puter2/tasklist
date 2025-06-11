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

  addTitleAndDesc(task_header,task_data);
  addButtons(task_header,task_data.status)
  //add list
  addList(section, task_data)
  .then(function(){
    //using promise in order to add form after list is added
    if(task_data.status =='open'){
      addForm(section)
    }
  })
}

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
      req_time.time = element.timeSpent;
      op_container.appendChild(req_time);
      li.appendChild(op_container);
      addButtons(li);
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

// TODO: add button functionality
function addButtons(element ,buttons_type){
  let button_area = document.createElement('div');
  let delete_button = document.createElement('button');
  delete_button.className = 'btn btn-outline-danger btn-sm ml-2';
  delete_button.innerText = 'Delete';
  switch(buttons_type){
    case 'open' : {
      let finish = document.createElement('button');
      finish.className = 'btn btn-dark btn-sm';
      finish.innerText = 'Finish';
      button_area.appendChild(finish);
      break;
    }
    case 'closed' : {
      break;
    }
    default : {
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


document.addEventListener('DOMContentLoaded', function() {
    apiListTasks().then(
  function(response) {
    console.log('Odpowiedź z serwera to:', response);
    response.data.forEach(task=>createTask(task));
    //createTask(response.data[0])
  }
);
});