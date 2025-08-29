/* ===== Data ===== */
let data=JSON.parse(localStorage.getItem('ittihadData'))||{
  users:[
    {name:'You',grades:'Grades: A,B,C',bio:'Welcome!',avatar:'',friends:[],notifications:[],posts:[]},
    {name:'Jane',grades:'Grades: B,A,A',bio:'Hello!',avatar:'',friends:[],notifications:[],posts:[]},
    {name:'Ali',grades:'Grades: A,B,B',bio:'Hey!',avatar:'',friends:[],notifications:[],posts:[]},
    {name:'Sara',grades:'Grades: C,B,A',bio:'Hi!',avatar:'',friends:[],notifications:[],posts:[]}
  ]
};
let currentUserIndex=0;

/* ===== Functions ===== */
function saveData(){localStorage.setItem('ittihadData',JSON.stringify(data)); renderProfile(); renderPosts(); renderFriends(); updateTrending(); updateNotifCount();}
function switchUser(){currentUserIndex=document.getElementById('userSelect').selectedIndex; saveData();}
function renderUserSelect(){const sel=document.getElementById('userSelect'); sel.innerHTML=''; data.users.forEach(u=>sel.innerHTML+=`<option>${u.name}</option>`); sel.selectedIndex=currentUserIndex;}
function renderProfile(){const user=data.users[currentUserIndex];document.getElementById('profileName').innerText=user.name;document.getElementById('profileGrades').innerText=user.grades;document.getElementById('profileBio').innerText=user.bio;document.getElementById('profileAvatar').src=user.avatar||'';}
function updateAvatar(){const file=document.getElementById('avatarUpload').files[0];if(file){const reader=new FileReader();reader.onload=e=>{data.users[currentUserIndex].avatar=e.target.result;saveData();};reader.readAsDataURL(file);}}
function saveProfile(){const user=data.users[currentUserIndex];user.name=document.getElementById('profileName').innerText;user.grades=document.getElementById('profileGrades').innerText;user.bio=document.getElementById('profileBio').innerText;saveData();}
function createPost(){const text=document.getElementById('postText').value.trim();if(!text)return alert('Write something first!');let media=document.getElementById('mediaUpload').files[0];if(media){const reader=new FileReader();reader.onload=e=>{data.users[currentUserIndex].posts.unshift({text,media:e.target.result,likes:0,comments:[],time:new Date().toLocaleString()});document.getElementById('postText').value='';document.getElementById('mediaUpload').value='';saveData();};reader.readAsDataURL(media);}else{data.users[currentUserIndex].posts.unshift({text,media:'',likes:0,comments:[],time:new Date().toLocaleString()});document.getElementById('postText').value='';saveData();}}
function renderPosts(filtered=null){const container=document.getElementById('posts');container.innerHTML='';const allPosts=data.users.flatMap(u=>u.posts.map(p=>({...p,author:u.name})));const postsToRender=filtered||allPosts;postsToRender.forEach((p,i)=>{const mediaHTML=p.media?p.media.startsWith('data:image')?`<img src="${p.media}">`:`<video controls src="${p.media}"></video>`:'';const isOwn=p.author===data.users[currentUserIndex].name;container.innerHTML+=`<div class="post"><b onclick="viewProfile('${p.author}')" style="cursor:pointer;">${p.author}</b><p>${p.text}</p>${mediaHTML}<small>${p.time}</small><div class="post-actions"><button onclick="likePost('${p.author}',${i})">👍 ${p.likes}</button>${isOwn?`<button onclick="editPost('${p.author}',${i})">✏️</button><button onclick="deletePost('${p.author}',${i})">🗑</button>`:''}</div><div class="comment-box"><input id="comment-${p.author}-${i}" placeholder="Write a comment..."><button onclick="addComment('${p.author}',${i})">Reply</button></div><div>${p.comments.map(c=>`<p>💬 ${c}</p>`).join('')}</div></div>`;});}
function likePost(author,index){const user=data.users.find(u=>u.name===author);user.posts[index].likes++;addNotificationForUser(author,`${data.users[currentUserIndex].name} liked your post`);saveData();}
function editPost(author,index){if(author!==data.users[currentUserIndex].name)return;const user=data.users.find(u=>u.name===author);const txt=prompt("Edit post:",user.posts[index].text);if(txt!==null){user.posts[index].text=txt;saveData();}}
function deletePost(author,index){if(author!==data.users[currentUserIndex].name)return;if(confirm("Delete this post?")){const user=data.users.find(u=>u.name===author);user.posts.splice(index,1);saveData();}}
function addComment(author,index){const inp=document.getElementById(`comment-${author}-${index}`);if(!inp.value.trim())return;const user=data.users.find(u=>u.name===author);user.posts[index].comments.push(`${data.users[currentUserIndex].name}: ${inp.value.trim()}`);addNotificationForUser(author,`${data.users[currentUserIndex].name} commented on your post`);inp.value='';saveData();}
function renderFriends(){const user=data.users[currentUserIndex];const myList=document.getElementById('myFriends');myList.innerHTML='';user.friends.forEach(f=>myList.innerHTML+=`<li>${f} <button onclick="removeFriend('${f}')">Remove</button></li>`);const sugList=document.getElementById('suggestedFriends');sugList.innerHTML='';data.users.forEach(u=>{if(u.name!==user.name&&!user.friends.includes(u.name))sugList.innerHTML+=`<li>${u.name} <button onclick="addFriend('${u.name}')">Add</button></li>`;});}
function addFriend(name){const user=data.users[currentUserIndex];if(!user.friends.includes(name)){user.friends.push(name);addNotificationForUser(name,`${user.name} sent you a friend request`);saveData();}}
function removeFriend(name){const user=data.users[currentUserIndex];user.friends=user.friends.filter(f=>f!==name);saveData();}
function addNotification(msg){data.users[currentUserIndex].notifications.push(msg);updateNotifCount();}
function addNotificationForUser(name,msg){const u=data.users.find(u=>u.name===name);u.notifications.push(msg);}
function showNotifications(){const notifs=data.users[currentUserIndex].notifications;if(notifs.length===0){alert("No notifications");}else{alert(notifs.join('\n'));data.users[currentUserIndex].notifications=[];saveData();}updateNotifCount();}
function updateNotifCount(){document.getElementById('notifCount').innerText=data.users[currentUserIndex].notifications.length;}
function updateTrending(){const allPosts=data.users.flatMap(u=>u.posts.map(p=>({...p,author:u.name})));allPosts.sort((a,b)=>b.likes-a.likes);const list=document.getElementById('trendingList');list.innerHTML='';allPosts.slice(0,5).forEach(p=>list.innerHTML+=`<li onclick="viewProfile('${p.author}')">${p.author}: ${p.text.substring(0,30)}... (${p.likes}👍)</li>`);}
function searchPosts(){const query=document.getElementById('searchBar').value.toLowerCase();const filtered=data.users.flatMap(u=>u.posts.map(p=>({...p,author:u.name}))).filter(p=>p.text.toLowerCase().includes(query));renderPosts(filtered);}
function viewProfile(name){const user=data.users.find(u=>u.name===name);const modal=document.getElementById('profileModal');modal.style.display='flex';document.getElementById('modalAvatar').src=user.avatar||'';document.getElementById('modalName').innerText=user.name;document.getElementById('modalGrades').innerText=user.grades;document.getElementById('modalBio').innerText=user.bio;const postsDiv=document.getElementById('modalPosts');postsDiv.innerHTML='';user.posts.forEach(p=>{const media=p.media?p.media.startsWith('data:image')?`<img src="${p.media}">`:`<video controls src="${p.media}"></video>`:'';postsDiv.innerHTML+=`<div class="post"><p>${p.text}</p>${media}</div>`;});}
function closeModal(){document.getElementById('profileModal').style.display='none';}
function setTheme(theme){document.body.className='';if(theme==='dark')document.body.classList.add('dark');if(theme==='glass')document.body.classList.add('glass');localStorage.setItem('theme',theme);}
function showFooterModal(title,text){document.getElementById('footerModalTitle').innerText=title;document.getElementById('footerModalContent').innerText=text;document.getElementById('footerModal').style.display='flex';}
function closeFooterModal(){document.getElementById('footerModal').style.display='none';}

/* ===== Init ===== */
renderUserSelect(); renderProfile(); renderPosts(); renderFriends(); updateTrending(); updateNotifCount();
let savedTheme=localStorage.getItem('theme')||'light'; setTheme(savedTheme);
