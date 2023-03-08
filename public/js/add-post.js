const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#-title').value.trim();
  const description = document.querySelector('#post-input').value.trim();

  if (title && description) {
    const response = await fetch(`/api/post`, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create post');
    }
  }
};
