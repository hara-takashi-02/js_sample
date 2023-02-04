const url = "asset/js/task.json";
const taskValueTitle = document.getElementsByClassName('task_value_title')[0];
const taskValueBody = document.getElementsByClassName('task_value_body')[0];
const taskSubmit = document.getElementsByClassName('task_submit')[0];
const taskList = document.getElementsByClassName('task_list')[0];

// 起動時の処理
window.addEventListener("load", () => {
  loadLists(url);
});

// 追加ボタン発火
taskSubmit.addEventListener('click', evt => {
  if (taskValueTitle.value) {
    evt.preventDefault();
    const taskTitle = taskValueTitle.value;
    const taskBody = taskValueBody.value;
    addTasks(taskTitle, taskBody);
    taskValueTitle.value = '';
    taskValueBody.value = '';
  }
});

//---------------
// 関数
//---------------
// 日付設定
const setToday = () => {
  const date = new Date();
    var month = ("0" + (date.getMonth()+1)).slice(-2)
    var day = ("0" + date.getDate()).slice(-2)
    let formatted_date = date.getFullYear() + "/" + month + "/" + day
    //console.log(formatted_date);
    return formatted_date;
  };
  
// 追加
const addTasks = (taskTitle, taskBody) => {
  const set_today = setToday();

  // 入力したタスクを追加・表示
  const listItem = document.createElement('li');
  listItem.classList.add('is-del'); // クラス名の追加
  addTasksDylay(listItem);
  const showItem = taskList.appendChild(listItem);//タスク追加

  //タイトル追加
  const listItemTitle = document.createElement('input');
  listItemTitle.setAttribute("type", "text");
  listItemTitle.setAttribute("value", taskTitle);
  listItemTitle.classList.add('taskTitle');
  listItemTitle.innerHTML = taskTitle;
  listItem.appendChild(listItemTitle);

  //ボディ追加
  const listItemBody = document.createElement('textarea');
  listItemBody.classList.add('taskBody');
  listItemBody.innerHTML = taskBody;
  listItem.appendChild(listItemBody);

  //時間追加
  const listItemDate = document.createElement('p');
  listItemDate.classList.add('taskDate');
  listItemDate.innerHTML = set_today;
  listItem.appendChild(listItemDate);

  // タスクに削除ボタンを付与
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteBtn');
  deleteButton.setAttribute('onclick', 'deleteTasksDylay(this)');
  deleteButton.innerHTML = 'Delete';
  listItem.appendChild(deleteButton);

  item = {"update":set_today,"title":taskTitle,"body":taskBody};
  console.log(item);

  updateLists(url,item);
};
const addTasksDylay = (listItem) => {
  window.setTimeout(addTasksClass, 0, listItem);
};
const addTasksClass = (listItem) => {
  listItem.classList.remove('is-del');
  //listItem.classList.add('is-show');
};

// 削除
const deleteTasks = (button) => {   
  const chosenTask = button.closest('li');
  taskList.removeChild(chosenTask);
};
const deleteTasksDylay = (button) => {
  const delTask = button.closest('li');
  delTask.classList.add('is-del'); // クラス名の追加
  window.setTimeout(deleteTasks, 500, button);
};

//非同期処理
const loadLists = (url) => {
  fetch(url)
    .then(response => response.json())
    .then(data => formatJSON(data))
    .catch(error => {
      console.error('通信に失敗しました', error);
    });

};

const updateLists = (url,item) => {
  fetch(url)
    .then(response => response.json())
    .then(data => updateJSON(url,data))
    .catch(error => {
      console.error('通信に失敗しました', error);
    });

};

//読み込み処理
const formatJSON = (json) => {
  console.log(json);
  let html = "";
  for (let item of json) {
    //console.log(item);
    if (item) {
      html += '<li>';
      html += '<input type="text" value="' + item.title + '" class="taskTitle">';
      html += '<textarea class="taskBody">' + item.body + '</textarea>';
      html += '<p class="taskDate">' + item.update + '</p>';
      html += '<button class="deleteBtn" onclick="deleteTasksDylay(this)">Delete</button>';
      html += '</li>';
    }
  }
  taskList.innerHTML = html;
};

//描き込み処理
const updateJSON = (url,json) => {
  //----
  // phpとかで処理
  //----
  console.log(json);
};

//並び替え
var el = document.getElementById('sort');
var sortable = Sortable.create(el, {
  sort: true,
		animation: 150,
    easing: "cubic-bezier(1, 0, 0, 1)",
		ghostClass: 'ghost',
 });