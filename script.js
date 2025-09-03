// Load posts from Local Storage
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Render posts
function renderPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  posts.forEach((p, index) => {
    const commentsHTML = p.comments.map(c => `<div class="comment"><strong>${c.user}:</strong> ${c.text}</div>`).join("");

    postsDiv.innerHTML += `
      <div class="post card mb-3">
        <div class="d-flex align-items-center mb-2">
          <img src="https://i.pravatar.cc/40?img=${(index+5)}" class="profile-pic">
          <strong>User ${index+1}</strong>
        </div>
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}" class="img-post">` : ""}
        <div>
          <span class="like-btn" onclick="likePost(${index})"><i class="fa-solid fa-thumbs-up"></i> ${p.likes} Likes</span>
          <span class="comment-btn" onclick="toggleCommentBox(${index})"><i class="fa-solid fa-comment"></i> ${p.comments.length} Comments</span>
        </div>
        <div id="commentBox${index}" class="comment-box" style="display:none;">
          <input type="text" id="commentInput${index}" class="form-control mb-2" placeholder="Write a comment...">
          <button onclick="addComment(${index})" class="btn btn-sm btn-secondary">Comment</button>
          ${commentsHTML}
        </div>
      </div>
    `;
  });
}

// Create post
function createPost() {
  const text = document.getElementById("postText").value;
  const fileInput = document.getElementById("postImage");
  let image = "";

  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      image = e.target.result;
      savePost(text, image);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    savePost(text, image);
  }
}

function savePost(text, image) {
  if (text.trim() === "" && image === "") return;
  posts.unshift({ text, image, likes: 0, comments: [] });
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";
  renderPosts();
}

// Like post
function likePost(index) {
  posts[index].likes++;
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

// Toggle comment box
function toggleCommentBox(index) {
  const box = document.getElementById("commentBox" + index);
  box.style.display = box.style.display === "none" ? "block" : "none";
}

// Add comment
function addComment(index) {
  const input = document.getElementById("commentInput" + index);
  const text = input.value;
  if (text.trim() === "") return;
  posts[index].comments.push({ user: "You", text });
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

// Init
document.getElementById("postBtn").addEventListener("click", createPost);
renderPosts();
