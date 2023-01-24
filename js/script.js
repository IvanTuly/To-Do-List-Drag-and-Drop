import {saveToFirebase, logOut} from '../firebase/js/firebase.js';

//массив с задачами и их статусом 
let tasks = [];

// //как только страница загрузится
// window.addEventListener('load', () => {

//получаем всю страницу
const web_page = document.querySelector(".wrapper");
//получаем задачи, куда будем добавлять новые
const list_el = document.querySelector(".dayTasks__row");
//получаем текущую дату, чтобы сделать рендер текущей недели
const date = new Date();
let renderWeekDay = new Date();

if (localStorage.getItem('tasks')) {
    //парсим JSON и записываем в массив tasks
    tasks = JSON.parse(localStorage.getItem('tasks'));
}
//проверяем массив на пустые задачи
chekNullItemsInArray();


//рендерим таблицу задач
renderWeekTasks(date);

//переменная всех полей ввода задач
const input = document.querySelector('#dayTasks__row');
console.log(input);

//слушаем input каждый раз, когда что-то вводим - вызываем updateValue
input.addEventListener('input', editTask);

//вызываем deleteTaskErase - функция, которая удаляет задачу из массива, если мы удалили ее через backSpace
input.addEventListener('input', deleteTaskErase);

//удаление задачи
list_el.addEventListener('click', deleteTask);

//отметка задачи как выполненной
list_el.addEventListener('click', doneTask);


// при клике в любом месте окна браузера вызываем функцию, которая удалит пустую строчку, если пользователь стер задачу
window.addEventListener('click', deleteByClick)

//удаление элемента если стереть задачу и кликнуть за ее пределами
function deleteByClick() {
    //получаем document
    const parentNode = document;
    //ищем класс task_delete
    const taskDelete = parentNode.querySelector(".task_delete");
    //если нет класса task_delete ни у одного элемента - выходим из функции
    if (taskDelete != null) {
        const taskID = Number(taskDelete.id);

        const parent = taskDelete.closest('.dayTasks__data');

        const parentDay = parent.closest('.dayTasks__tasks');

        // удаляем задачу с экрана 
        parent.remove();

        // удаляем задачу с массива
        const index = tasks.findIndex((task) => task.id === taskID);
        tasks.splice(index, 1)

        saveToLocalStorage();
    } return

}

//функция добавления новой задачи в массив
function addTask(newTaskValue, newTaskDate) {

    var newTaskID = Date.now()
    //объект создаваемой задачи, хранит id, текст и статус, выполнена/не выполнена.
    const newTask = {
        //id по мс текущего времени
        id: newTaskID,
        date: newTaskDate,
        data: newTaskValue,
        done: false,
    };
    //добавляем объект в массив с задачами
    tasks.push(newTask);
    //сохраняем в localStorage
    saveToLocalStorage();
    // возвращаем id, чтобы записать в задачу
    return newTaskID;
}//END addTask

//функция для изменения задачи или создания новой
function editTask(event) {
    //получаем значение input, каждый раз, когда меняем данные
    const task = event.target;
    var taskValue = task.value;
    const id = Number(task.id);

    //делаем проверку: задача новая или уже существует, у новых задач нет id
    if (id == 0) {
        //если задача новая, то создаем новый объект и добавляем его в массив задач
        //получаем родителя, чтобы потом найти поле с датой
        const parentNode = event.target.closest('.dayTasks__task');
        //получаем элемент с датой задачи
        const date = parentNode.querySelector('.task__date');
        //получаем текст, который написан в дате
        const dateValue = date.value;

        //вызываем функцию добавления новой задачи и получаем из нее id новой задачи
        const newTaskID = addTask(taskValue, dateValue);
        //устанавливаем id задачи, если она не была создана
        task.setAttribute("id", newTaskID);
        //устанавливаем значение в value
        task.setAttribute("value", taskValue);
        //убираем класс empty
        const taskParent = event.target.closest(".dayTasks__data")
        taskParent.classList.remove("empty");


        //создаем кнопки для новой задачи
        const parent = event.target.closest('.dayTasks__data');
        renderButtons(parent);

        //добавляем значение draggable="true", ondragstart='onDragStart(event);' и id задачи
        parent.setAttribute("id", newTaskID);
        parent.setAttribute("draggable", true);
        parent.setAttribute("ondragstart", 'onDragStart(event);');

        //когда создаем новую задачу надо добавить следующую пустую задачу
        const parentForAdd = event.target.closest('.dayTasks__tasks');
        createEmptyTask(parentForAdd);


    } else {
        //если задача уже есть, то меняем значение в массиве и в input value
        //меняем значение в массиве ищем по id 
        const taskFromArray = tasks.find(function (task) {
            if (task.id === id) {
                return true
            }
        })
        //меняем значение в массиве
        taskFromArray.data = taskValue;
        //устанавливаем значение в value
        task.setAttribute("value", taskValue);

        //если пользователь полностью стер значение задачи и начинает писать новое, то создаем кнопки и убираем класс task_delete
        if (task.className == "text task_delete") {
            const parent = event.target.closest('.dayTasks__data');
            renderButtons(parent);
            task.classList.remove("task_delete");
        }
    };
    //сохраняем в localStorage
    saveToLocalStorage();

}//END editTask

//удаление задачи через стирание backspase
function deleteTaskErase(event) {
    //ищем родителя - весь день,
    const parent = event.target.closest('.dayTasks__task');
    //ищем родитель в котором лежат наша задача
    const parentNode = event.target.closest('.dayTasks__data');
    //получаем значение input, каждый раз, когда меняем данные
    const task = event.target;
    const taskValue = task.value;
    //ищем id
    const taskID = Number(task.id);

    //если мы стираем задачу, то у нее есть свой id, который не равен 0, и ее значение пустое
    if (taskID != 0 && taskValue == "") {

        //добавляем класс - на удаление задачи, если пользователь кликнет по странице - задача будет удалена
        task.classList.add("task_delete");

        //убираем кнопки
        parentNode.querySelector('.dayTasks__actions').remove()

        //сохраняем данные массива в local storage
        saveToLocalStorage();
    }

}

//удаление задачи через кнопку delete
function deleteTask(event) {
    //проверяем по значению атрибута кнопок, которые равны  dataAction
    //если клик не по кнопки delete, не выполняем функцию
    if (event.target.dataset.action !== 'delete') return;

    //ищем родитель в котором лежат наша задача
    const parentNode = event.target.closest('.dayTasks__data');
    //получаем элемент с текстом задачи
    const task = parentNode.querySelector('.text');
    //определяем id задачи, чтобы удалить из массива и приводим к числу для сравнения
    const taskID = Number(task.id);

    //удаляем задачу с экрана 
    parentNode.remove();

    //находим задачу для удаления по индексу, для этого вызываем функцию, которая проходит по всем элементам массива task и сравнивает их id с необходимым
    //стрелочная функция, тк она состоит из одного выражения, которое дб возвращено из функции, то return не нужен
    const index = tasks.findIndex((task) => task.id === taskID);
    //понятная копия функции
    // const index = tasks.findIndex( function(task) { 
    //     //если нашли такой элемент вернем true
    //     if (task.id ===id){
    //         return true
    //     }
    // });

    //удаляем задачу из массива. (с какого илемента хотим вырезать, сколько элементов вырезать из массива)
    tasks.splice(index, 1)
    //сохраняем данные массива в local storage
    saveToLocalStorage();
}; //END deleteTask


//отметка задачи как выполненой через кнопку done
function doneTask(event) {
    //если клик не по кнопке done функцию не выполняем
    if (event.target.dataset.action !== 'done') return;

    //ищем родитель в котором лежат наша задача
    const parentNode = event.target.closest('.dayTasks__data');
    //получаем элемент с текстом задачи
    const task = parentNode.querySelector('.text');
    //определяем id задачи
    const id = Number(task.id);

    //ищем объект задачи по id, который мы получаем по ссылке, поэтому можем менять и будет изменения в массиве 
    const taskFromArray = tasks.find(function (task) {
        if (task.id === id) {
            return true
        }
    })
    //меняем значение в массиве
    taskFromArray.done = !taskFromArray.done;
    //добавляем или убираем класс, который с помощью css зачеркивает текст, если задача выполнена
    task.classList.toggle("task-title--done");

    //сохраняем данные массива в local storage
    saveToLocalStorage();
}; //END doneTask


//сохранение в localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    saveToFirebase(tasks);
}

//функция рендерит кнопки у новой задачи
function renderButtons(parent) {
    const taskHTML = `
        <div class="dayTasks__actions">
        <button class="button__done" data-action="done">v</button>
        <button class="button__delete" data-action="delete">x</button>
      </div>`
    parent.insertAdjacentHTML('beforeend', taskHTML);
}

//функция создает пустую задачу и добавляет ее в конец списка задач
function createEmptyTask(parent) {
    //создаем шаблонную строку с нашим значением задачи
    const taskHTML =
        `<div class="dayTasks__data empty">
            <div class="dayTasks__content">
              <input 
                id=""
                type="text"
                class="text"
                data-action="edit"
                value="" 
              />
            </div>
          </div>`;

    // вставляем фрагмент кода в код элемена дня, в котором лежат задачи
    parent.insertAdjacentHTML('beforeend', taskHTML);

}

//функция для рендера 7 блоков с днями недели с пн до вс, на вход передаем дату - получаем 7 блоков - дней недели
function renderWeekTasks(functionDate) {
    let date = functionDate;
    list_el.innerHTML = '';
    //для проверки сеггодняшнего дня, чтобы добавить ему класс today
    const todayDay = new Date();
    const todayDate =`${todayDay.getDate()} ${getMonthItem(todayDay)} ${todayDay.getFullYear()}`;
    //получаем дату понедельника этой недели
    let dayWeek = getMondayDate(date);
    let dayTask = '';
    let dateTask = '';
    let today = false;

    for (let i = 0; i < 7; i++) {
        //записываем в переменную название дня недели
        dayTask = getDayItem(dayWeek);
        //записываем в переменную дату в формате (день, месяц, год)   
        dateTask = `${dayWeek.getDate()} ${getMonthItem(date)} ${dayWeek.getFullYear()}`
        //переменная, которая добавит класс сегодняшнего дня
        if (dateTask == todayDate){
            today = true;
        } else {
            today = false;
        }
        //вызываем функцию для рендера дня недели с задачами
        renderTask(dayTask, dateTask, today);
        //обновляем день на следующий день недели
        var newDay = dayWeek.getTime()+86400000;
        dayWeek.setTime(newDay);
    }
}//END renderWeekTasks

//функция для рендеринга задач, передаем в нее дату в формате день, месяц, год - для поиска задач с такими датами в массиве задач
function renderSumOfTasks(taskDate) {
    let htmlCode = ""
    for (var i = 0; i < tasks.length; i++) {
        //формируем css класс
        //тернарный оператор для проверки задача выполнена или нет
        const cssClass = tasks[i].done ? "text task-title--done" : "text";
        if (tasks[i].date === taskDate) {
            htmlCode = htmlCode + `
                <div class="dayTasks__data" id="${tasks[i].id}" draggable="true" ondragstart="onDragStart(event);">
                <div class="dayTasks__content">
                  <input 
                    type="text"
                    id="${tasks[i].id}"
                    class="${cssClass}"
                    data-action="edit"
                    value="${tasks[i].data}"
                  />
                </div>
                <div class="dayTasks__actions">
                  <button class="button__done" data-action="done">v</button>
                  <button class="button__delete" data-action="delete">x</button>
                </div>
              </div>
              `;
        }
    }
    //добавляем пустую задачу без атрибута readonly и draggable
    htmlCode = htmlCode + `
            <div class="dayTasks__data empty">
            <div class="dayTasks__content">
              <input 
                id=""
                type="text"
                class="text"
                data-action="edit"
                value=""
              />
            </div>
          </div>`;


    return htmlCode
}//END renderSumOfTasks

//функция для рендера одного дня на вход поступаем название дня недели, дата этого дня и переменная today=true/false, которая определяет сегодняшний ли это день недели
function renderTask(taskDay, taskDate, today) {
    let taskHTML = ''
    if (today === true){
        taskHTML = `
        <div class="dayTasks__task dayTasks__task-today" id="dayTasks__task" ondragover="onDragOver(event);"
        ondrop="onDrop(event);">
            <div class="dayTasks__weekday">
            ${taskDay}
            </div>

            <div class="dayTasks__date">
            <input 
            type="text"
            class="task__date"
            value="${taskDate}"
            readonly />
            </div> 

            <div class="dayTasks__tasks">
            ${renderSumOfTasks(taskDate)}
            </div>
            
            <div class="dayTasks__emptyArea">   
            <textarea readonly>
            </textarea>
            </div>
        </div>`;
    } else {
        taskHTML = `
        <div class="dayTasks__task" id="dayTasks__task" ondragover="onDragOver(event);"
        ondrop="onDrop(event);">
            <div class="dayTasks__weekday">
            ${taskDay}
            </div>

            <div class="dayTasks__date">
            <input 
            type="text"
            class="task__date"
            value="${taskDate}"
            readonly />
            </div> 

            <div class="dayTasks__tasks">
            ${renderSumOfTasks(taskDate)}
            </div>
            
            <div class="dayTasks__emptyArea">   
            <textarea readonly>
            </textarea>
            </div>
        </div>`;
    }

    list_el.insertAdjacentHTML('beforeend', taskHTML);
}//END renderTask

//функция для вывода названия дня недели по дате этого дня
function getDayItem(date) {
    var day = date.getDay();
    var arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (arr[day]);
}//END getDayItem

//функция для вывода названия месяца по дат
function getMonthItem(date) {
    var month = date.getMonth();
    var arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];

    return (arr[month]);
}//END getMonthItem

//функция для выдова даты понедельника этой недели
function getMondayDate(date) {
    let newDate = new Date();
    //определяем текущий день
    const day = date.getDay();
    // создаем переменную для хранения мс
    var dateMonday = 0;
    switch (day) {
        case 0:
            dateMonday = date.getTime() - 86400000 * 6;
            break;
        case 1:
            dateMonday = date.getTime();
            break;
        case 2:
            dateMonday = date.getTime() - 86400000;
            break;
        case 3:
            dateMonday = date.getTime() - (86400000 * 2);
            break;
        case 4:
            dateMonday = date.getTime() - (86400000 * 3);
            break;
        case 5:
            dateMonday = date.getTime() - (86400000 * 4);
            break;
        case 6:
            dateMonday = date.getTime() - (86400000 * 5);
            break;
        default:
            date = null;
    }
    //возврашаем пн на этой неделе
    newDate.setTime(dateMonday);
    return newDate;
}//END getMondayDate

function chekNullItemsInArray() {
    //ищем индекс задачи, у которой пустое значение
    const index = tasks.findIndex((task) => task.data == "");
    //удаляем задачу с массива если нашли такую
    if (index != -1) {
        tasks.splice(index, 1)
    }
};//END chekNullItemsInArray

//функции для перетягивания задач, запись window.name = function() - делает функцию глобальной - ее видно за перделами модуля
window.onDragStart = function(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);

    //   event
    //   .currentTarget
    //   .style
    //   .border = '1px solid black';
}
window.onDragOver = function(event) {
    event.preventDefault();
}
window.onDrop = function(event) {

    const id = event
        .dataTransfer
        .getData('text');

    //сам элемент, который перетаскиваем, находим его по id 
    const draggableElement = document.getElementById(id);

    //получаем элемент, в который вставлена задача (это модет быть кнопка, может input...)
    const dropPlace = event.target;
    console.log(dropPlace)

    //получаем строку с задачей в которую попал перетаскиваемый элемент
    var dropzonePlace = dropPlace.closest(".dayTasks__data");

    var dropZoneItem
    if (dropzonePlace != null) {
        //ищем input с задачей в этой строке. Так сделано, чтобы при добавлении в кнопку задачи - все равно работало
        dropZoneItem = dropzonePlace.querySelector(".text");
        //переменная, чтобы узнать в пустую ли задачу вставили
        var taskValue = dropZoneItem.value;
    }



    //получаем элемент дня в который перетащили задачу
    const parentNode = dropPlace.closest(".dayTasks__task");
    // console.log("parentNode")
    // console.log(parentNode)

    const parentNodeEmptyArea = dropPlace.querySelector(".dayTasks__emptyArea");
    // console.log("empty")
    // console.log(parentNodeEmptyArea)

    // console.log(dropPlace)
    // console.log("^dropPlace \/parentNode")
    // console.log(parentNode)
    // console.log("dropZonePlace")
    // console.log(dropzonePlace)

    //выбираем куда вставить задачу
    if (dropzonePlace == null) {
        //если элемент втсавлен в дату или название дня, то значение emtyArea - null
        if (parentNodeEmptyArea == null) {
            //вставляем его вверх всех задач и в начало массива
            dropzonePlace = parentNode.querySelector(".dayTasks__tasks");
            dropzonePlace.insertAdjacentElement('afterBegin', draggableElement);
            saveTaskToStart(parentNode, id)
        } else {
            //если элемент перетягиваем в пустые строки полсе списка
            //вставляем его вниз всех задач и в конец массива
            dropzonePlace = parentNode.querySelector(".empty");
            dropzonePlace.insertAdjacentElement('beforeBegin', draggableElement);
            saveTaskToEnd(parentNode, id);

        }
    } //если элемент вставили в список
    else {
        //если задача пустая - вставляем до нее
        if (taskValue == "") {
            //вставляем его вниз всех задач и в конец массива
            dropzonePlace.before(draggableElement);
            saveTaskToEnd(parentNode, id);

            //если в задаче что-то есть - вставляем после нее
        } else {
            dropzonePlace.after(draggableElement);
            //вызываем функцию, которая сохранит задачу на новом месте, поменяя ее место в массиве
            arrayTaskChangePlace(parentNode, dropPlace, id)
        }
    }
    event
        .dataTransfer
        .clearData();
}

//функция переписывает элемент, который мы перетянули, в соответствии с его расположением в задачах
function arrayTaskChangePlace(parentNode, dropPlace, id) {
    console.log("arrayTaskChangePlace сработала")

    //получаем элемент с датой задачи
    const date = parentNode.querySelector('.task__date');
    //получаем текст, который написан в дате
    const dateValue = date.value;

    //в эту переменную записан элемент массива с перетаскиваемой задачей
    const taskFromArray = tasks.find(function (task) {
        if (task.id == id) {
            return true
        }
    })
    //индекс элемент массива с перетаскиваемой задачей
    const index = tasks.findIndex((task) => task.id == id);
    //меняем значение в массиве
    taskFromArray.date = dateValue;

    //получаем id элемента в который вставлена задача
    const regionID = dropPlace.id;
    //получаем index в массиве элемента в который вставлена задача
    const regionIndex = tasks.findIndex((task) => task.id == regionID);
    console.log("region index = " + regionIndex)
    console.log("index = " + index)

    //удаляем из массива перетаскиваемую задачу
    tasks.splice(index, 1)

    //корректируем вставку с учетом того, что мы удалили задачу и индекс мог поменяться
    if (index > regionIndex) {
        //вставляем перетаскиваемую задачу в массив после элемента куда ее перетянули
        tasks.splice(regionIndex + 1, 0, taskFromArray)
    } else {
        //вставляем перетаскиваемую задачу в массив после элемента куда ее перетянули
        tasks.splice(regionIndex, 0, taskFromArray)
    }

    //сохраняем
    saveToLocalStorage();

}

//функция переписывает элемент в начало массива
function saveTaskToStart(parentNode, id) {
    //получаем элемент с датой задачи
    const date = parentNode.querySelector('.task__date');
    //получаем текст, который написан в дате
    const dateValue = date.value;

    //в эту переменную записан элемент массива с перетаскиваемой задачей
    const taskFromArray = tasks.find(function (task) {
        if (task.id == id) {
            return true
        }
    })
    //индекс элемент массива с перетаскиваемой задачей
    const index = tasks.findIndex((task) => task.id == id);
    //меняем значение в массиве
    taskFromArray.date = dateValue;

    //удаляем из массива перетаскиваемую задачу
    tasks.splice(index, 1)
    //вставляем перетаскиваемую задачу в массив после элемента куда ее перетянули
    tasks.unshift(taskFromArray)
    //сохраняем
    saveToLocalStorage();

}

//функция переписывает элемент в конец массива
function saveTaskToEnd(parentNode, id) {
    //получаем элемент с датой задачи
    const date = parentNode.querySelector('.task__date');
    //получаем текст, который написан в дате
    const dateValue = date.value;

    //в эту переменную записан элемент массива с перетаскиваемой задачей
    const taskFromArray = tasks.find(function (task) {
        if (task.id == id) {
            return true
        }
    })
    //индекс элемент массива с перетаскиваемой задачей
    const index = tasks.findIndex((task) => task.id == id);
    //меняем значение в массиве
    taskFromArray.date = dateValue;

    //удаляем из массива перетаскиваемую задачу
    tasks.splice(index, 1)
    //вставляем перетаскиваемую задачу в массив после элемента куда ее перетянули
    tasks.push(taskFromArray)
    //сохраняем
    saveToLocalStorage();

}


//функции стрелок переключение недель. RenderWeekTasks - глобальная переменная - хранит один день недели, которая рендерится
document.querySelector(".button_previousWeek").addEventListener('click', () =>{
    let newDay = renderWeekDay.getTime()-604800000;
    let date = new Date();
    date.setTime(newDay);
    renderWeekDay = date;
    renderWeekTasks(date)   
})
document.querySelector(".button_nextWeek").addEventListener('click', () =>{
    let newDay = renderWeekDay.getTime()+604800000;
    let date = new Date();
    date.setTime(newDay);
    renderWeekDay = date;
    renderWeekTasks(date)   
})


//реализация фокусировки на пустое поле с задачей при клике на пустые задачи
const wrapper = document.querySelector('.wrapper');
wrapper.addEventListener('click', handleClick);
function handleClick(e) {
    console.log('click', e.target);
      const emptyArea = e.target.querySelector(".dayTasks__emptyArea");
      console.log(emptyArea)
  
      if (emptyArea != null){
          const task = e.target.querySelector(".empty")
          const taskField = task.querySelector(".text")
          taskField.focus()
          console.log(task)
      }
  }


//проверяем авторизован ли пользователь
//открываем бд
var openRequest = indexedDB.open('firebaseLocalStorageDb',1)
//если успешно
openRequest.onsuccess = function(event){
    //получаем что внутри
    var db = event.target.result;
    //посылаем get запрос через транзакцию - так работает .getAll-все содержимое 
    const request = db.transaction('firebaseLocalStorage')
    .objectStore('firebaseLocalStorage')
    .getAll();

    //если get запрос выполнет, то полуачам данные в переменную user
    request.onsuccess = ()=> {
    const user = request.result;
    if (user.length !=0){
        // console.log('Got user');
        // console.log(user[0].value.email)
        const userLogOut = document.querySelector(".login__logOut");
        userLogOut.classList.remove("empty");
        const logInButton = document.querySelector(".login__button");
        logInButton.classList.add("empty")
    };
    };

    //если get запрос не выполнен, то пользователь не авторизован
    request.onerror = (err)=> {
        console.error(`Error to get user: ${err}`)
        const userEmail = document.querySelector(".login__user");
        userEmail.innerText = "";
        userEmail.classList.add("empty");
        const logInButton = document.querySelector(".login__button");
        logInButton.classList.remove("empty")

    }
};


//реализация log out
const logOutButton = document.querySelector(".login__logOut");
logOutButton.addEventListener('click', logOutFunction);
function logOutFunction(){
    logOut();
    const userLogOut = document.querySelector(".login__logOut");
    userLogOut.classList.add("empty");
    const logInButton = document.querySelector(".login__button");
    logInButton.classList.remove("empty")

}



// });






