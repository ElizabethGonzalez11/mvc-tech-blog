const commentFormHandler = async (event) => {
  event.preventDefault();

  const comment_text = document.querySelector('.post-input').value.trim();
  const post_id = document.querySelector('#new-comment').value.trim();

  if (comment_text) {
    const response = await fetch(`/api/comment`, {
      method: 'POST',
      body: JSON.stringify({ post_id, comment_text }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
};
document.querySelector('.post-input').addEventListener('submit', commentFormHandler);