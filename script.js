function addPost() {
  let text = document.getElementById("newPost").value.trim();
  if (!text) return;
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.push({ text: text, likes: 0, comments: [] });
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("newPost").value = "";
  displayPosts();
}

function likePost(i) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts[i].likes++;
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

function addComment(i) {
  let input = document.getElementById("comment-" + i);
  let text = input.value.trim();
  if (!text) return;
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts[i].comments.push(text);
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

function displayPosts(list) {
  let posts = list || JSON.parse(localStorage.getItem("posts")) || [];
  let html = "";
  posts.forEach((p, i) => {
    html += `
      <div class="post">
        <p>${p.text}</p>
        <button onclick="likePost(${i})">👍 ${p.likes}</button>
        <div class="comments">
          ${(p.comments || []).map(c => `<p>💬 ${c}</p>`).join("")}
          <input type="text" id="comment-${i}" placeholder="Write a comment..."/>
          <button onclick="addComment(${i})">Reply</button>
        </div>
      </div>
    `;
  });
  document.getElementById("posts").innerHTML = html;
}

function searchPosts() {
  let query = document.getElementById("search").value.toLowerCase();
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let results = posts.filter(p => p.text.toLowerCase().includes(query));
  displayPosts(results);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

window.onload = displayPosts;
